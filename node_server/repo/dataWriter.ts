import * as mysql from "mysql"
import {Request, Response} from "express"
import {isArray} from "util";
import {dataHandler} from "./dataHandler";
export class dataWriter extends dataHandler{
    //新增或更新对象
    public saveEntity(req:Request, res:Response, beforeSave?:Function, afterSave?:Function){
        let msg:string;
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
                    res.json({result:true, content:result.insertId,
                        message:msg?msg:`Successful for insert data [${this.modelName}]`});
                } else {
                    res.json({result:true,
                        message:msg?msg:`Successful for update data [${this.modelName}]`});
                }
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
                res.json({result:true,
                    message:msg?msg:`Successful for delete [${this.modelName}] ${result.affectedRows} datas`});
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