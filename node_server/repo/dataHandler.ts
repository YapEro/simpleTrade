import {logUtils} from "../utils/logUtils";
import {getMetas} from "../../models/modelDecorator";
import * as mysql from "mysql";
import {isArray} from "util";
import {Request, Response} from "express";
import {response} from "../../models/response";

export class dataHandler{
    protected dbConf:JSON = require("../conf/db.json");
    protected logger = new logUtils("repo.dataHandler");
    protected modelMetadata:any[];
    protected modelName:string;
    protected modelInstance:Object;
    public constructor(modelName:string, modelInstance:Object){
        this.modelName = modelName;
        this.modelInstance = modelInstance;
        this.modelMetadata = getMetas(this.modelName, this.modelInstance);
    }
    public handlerErr(err:Error){
        if(err){
            this.logger.logError(err);
            throw err;
        }
    }

    //读取对象主键属性名称
    public getKeyProperty():string{
        let keyMetadata = this.modelMetadata.find(item=>item.metadatas.isPK);
        if(keyMetadata) return keyMetadata.name;
        return null;
    }
    //转换对象
    public formatEntity(row:any){
        let formatRow = {};
        this.modelMetadata.forEach(({name, metadatas})=>{
            for(let item in row){
                if(item == metadatas.field){
                    formatRow[name] = row[item];
                }
            }
        });
        return formatRow
    }
    //转换对象集合
    public formatEntities(entities:any[]){
        let formatRows = new Array();
        entities.forEach(item=>{
            formatRows.push(this.formatEntity(item));
        });
        return formatRows;
    }
    //从元数据中根据属性名称读取表字段名
    public getFieldWithProperty(property:string){
        let meta = this.modelMetadata.find(item =>item.name == property);
        if(meta){
            return meta.metadatas.field;
        }
        return property;
    }

    //仅对日期型、字符型添加单引号
    public formatValue(value:any, proName:string){
        let meta = this.modelMetadata.find(item =>item.name == proName);
        if(meta){
            switch(meta.metadatas.type.toLocaleLowerCase()){
                case "string":
                case "date":
                    return `'${value}'`;
            }
        }
        return `${value}`;
    }
    //删除最后的特殊字符
    public cutoffLastChar(char:string, str:string){
        if(str && str.endsWith(char)){
            return str.substr(0, str.length - char.length);
        }
        return str;
    }
    public queryWithKey(req:Request, res:Response, handleEntity?:Function){
        if(!this.modelName) throw Error("Query parameters invalida, entity name is required!");
        let pool:mysql.IPool = mysql.createPool(this.dbConf);
        let keyPro = this.getKeyProperty();
        if(!keyPro) throw new Error(`${this.modelName}:has no primary key property define!`);
        let keyValue = req.query.key;
        if(!keyValue) throw new Error(`${this.modelName}:has no parameters ['key'] in request url!`);
        let sql = `select * from ${this.modelName} where ${this.getFieldWithProperty(keyPro)}=${keyValue}`;
        this.logger.logDebug(sql);
        pool.getConnection((err, conn) => {
            this.handlerErr(err);
            conn.query(sql, (dErr, data) => {
                this.handlerErr(dErr);
                if(handleEntity) handleEntity(data);
                let result = new response(data?true:false,
                    data?`Query [${this.modelName}] data for key ${keyValue}`:
                        `No record for [${this.modelName}] with key ${keyValue}`, data);
                this.logger.logDebug(result);
                res.json(result);
                conn.destroy();
            });
        });
    }
    //根据查询条件，查询数据
    public queryList(req:Request, res:Response, handleList?:Function){
        if(!this.modelName) throw "Query parameters invalida, entity name is required!";
        let pool:mysql.IPool = mysql.createPool(this.dbConf);
        let criteria:Array<any> = req.body.criteria;
        let order:Array<any> = req.body.order;
        let pagination:any = req.body.pagination;
        let sql = {dataSql:"", amountSql:""}, sqlSuffix = "";
        let result:response;
        sql.dataSql = `Select * from ${this.modelName}`;
        if(criteria){
            sqlSuffix += " where ";
            criteria.forEach(({property, operator, value})=>{
                sqlSuffix += `${this.getFieldWithProperty(property)}${operator}${value} and `;
            });
            if(sqlSuffix.trim().endsWith("and")) sqlSuffix = sqlSuffix.substr(0, sqlSuffix.length - 4);
        }
        //若有分页需求，对查询SQL + 查询条件进行统计
        if(pagination){
            sql.amountSql = `Select count(*) as amount from ${this.modelName} ${sqlSuffix}`;
        }
        if(order){
            sqlSuffix += " order by ";
            order.forEach(({property, direction}) => {
                sqlSuffix += `${this.getFieldWithProperty(property)}` + (direction?" " + direction:"") + ",";
            });
            if(sqlSuffix.endsWith(",")) sqlSuffix = sqlSuffix.substr(0, sqlSuffix.length - 1);
        }
        if(pagination){
            sqlSuffix += ` limit ${pagination.pSize*(pagination.pIndex-1)}, ${pagination.pSize}`;
        }
        sql.dataSql += sqlSuffix;
        console.log(sql.dataSql);
        pool.getConnection((err, conn) => {
            this.handlerErr(err);
            //若有分页需求，先计算总数，再查询数据
            if(pagination){
                conn.query(sql.amountSql, (aErr, amount) => {
                    this.handlerErr(aErr);
                    conn.query(sql.dataSql, (dErr, data) => {
                        this.handlerErr(dErr);
                        data = this.formatEntities(data);
                        if(handleList) handleList(data);
                        result = new response(true, `Query [${this.modelName}] data ${data.length}`,
                            {total:amount[0].amount, data: data});
                        this.logger.logDebug(result);
                        res.json(result);
                        conn.destroy();
                    });
                })
            } else {
                conn.query(sql.dataSql, (dErr, data) => {
                    this.handlerErr(dErr);
                    data = this.formatEntities(data);
                    if(handleList) handleList(data);
                    let result = new response(true, `Query [${this.modelName}] data ${data.length}`, data);
                    this.logger.logDebug(result);
                    res.json(result);
                    conn.destroy();
                });
            }
        });
    }
    //新增或更新对象
    public saveEntity(req:Request, res:Response, beforeSave?:Function, afterSave?:Function){
        let msg:string;
        let retValue:response;
        let keyProperty = this.getKeyProperty();
        //配置检查
        if(!keyProperty)
            msg = `${this.modelName}:has no primary key property define!`;
        else
            msg = this.validateInput(req.body);
        if(msg){
            this.logger.logError(msg);
            throw new Error(msg);
        }
        if(beforeSave && !beforeSave(req.body, res)) return;
        this.modelInstance = req.body;
        let sql:string = "", fieldSql:string = "", valueSql:string = "";
        //更新对象
        if(this.modelInstance[keyProperty]){
            sql = `update ${this.modelName} set `;
            for(let pro in this.modelInstance){
                if(pro == keyProperty) continue;
                sql += `${this.getFieldWithProperty(pro)}=${this.formatValue(this.modelInstance[pro], pro)},`;
            }
            sql = this.cutoffLastChar(",", sql);
            sql += ` where ${this.getFieldWithProperty(keyProperty)}=${this.modelInstance[keyProperty]}`;
        } else {  //新增对象
            sql = `insert into ${this.modelName} `;
            for(let pro in this.modelInstance){
                if(pro == keyProperty) continue;
                fieldSql += `${this.getFieldWithProperty(pro)},`;
                valueSql += `${this.formatValue(this.modelInstance[pro], pro)},`;
            }
            fieldSql = this.cutoffLastChar(",", fieldSql);
            valueSql = this.cutoffLastChar(",", valueSql);
            sql += `(${fieldSql}) values (${valueSql})`;
        }
        this.logger.logDebug(sql);
        let pool:mysql.IPool = mysql.createPool(this.dbConf);
        pool.getConnection((err, conn)=>{
            this.handlerErr(err);
            msg = null;
            conn.query(sql,(cErr, result)=>{
                this.handlerErr(cErr);
                if(afterSave) msg = afterSave(this.modelInstance);
                if(!this.modelInstance[keyProperty]){
                    retValue = new response(true, msg?msg:`Successful for insert data [${this.modelName}]`,result.insertId);
                } else {
                    retValue = new response(true, msg?msg:`Successful for update data [${this.modelName}]`);
                }
                res.json(retValue);
            });
        });
    }
    //删除一个或多个对象
    public deleteData(req:Request, res:Response, beforeDelete?:Function, afterDelete?:Function){
        let delKey = req.body;
        let msg:string;
        if(!delKey.keys)
            msg = `${this.modelName}:has no prameters [keys] for delete!`;
        let keyProperty = this.getKeyProperty();
        //配置检查
        if(!keyProperty)
            msg = `${this.modelName}:has no primary key property define!`;
        if(msg){
            this.logger.logError(msg);
            throw new Error(msg);
        }
        let delSql:string = `delete from ${this.modelName} where ${this.getFieldWithProperty(keyProperty)} `;
        if(isArray(delKey.keys)){
            delSql += " in ("
            for(let iKey of delKey.keys){
                delSql += `${iKey},`;
            }
            delSql = this.cutoffLastChar(",", delSql);
            delSql += ")";
        } else{
            delSql += `=${delKey.keys}`;
        }
        if(beforeDelete && !beforeDelete(delKey.keys, res)) return;
        this.logger.logDebug(delSql);
        let pool:mysql.IPool = mysql.createPool(this.dbConf);
        pool.getConnection((err, conn)=>{
            this.handlerErr(err);
            msg = null;
            conn.query(delSql,(cErr, result)=>{
                this.handlerErr(cErr);
                if(afterDelete) msg = afterDelete(delKey.keys);
                res.json(new response(true,
                    msg?msg:`Successful for delete [${this.modelName}] ${result.affectedRows} datas`));
            });
        });
    }
    //根据验证配置对输入数据进行验证
    private validateInput(data:any):string{
        let validMsg:string = "";
        this.modelMetadata.forEach(metadata=>{
            let validations = metadata.metadatas.validations;
            let proTitle = metadata.metadatas.label;
            if(validations){
                let proName:string;
                for(let item in data){
                    if(item == metadata.name){
                        proName = item;
                        break;
                    }
                }
                if(proName){
                    if(validations.require && !data[proName])
                        validMsg += `${proTitle} is require property, please input value!\r\n`;
                    if(validations.regex && !(new RegExp(validations.regex)).test(data[proName]))
                        validMsg += `${proTitle}:${data[proName]} is not match ${validations.regex}!\r\n`;
                }
            }
        });
        return validMsg;
    }
}