/**
 * Created by sean on 2016/12/23.
 */
import * as mysql from "mysql"
import {Request, Response} from "express"
import {logUtils} from "../utils/logUtils";
import {getMetas} from "../../models/modelDecorator";
export class dataReader{
    private dbConf:JSON = require("../conf/db.json");
    private logger = new logUtils("repo.dataReader");
    private modelMetadata:any[];
    private modelName:string;
    private modelInstance:Object;
    public constructor(modelName:string, modelInstance:Object){
        this.modelName = modelName;
        this.modelInstance = modelInstance;
        this.modelMetadata = getMetas(this.modelName, this.modelInstance);
    }
    private handlerErr(err:Error){
        if(err){
            this.logger.logError(err);
            throw err;
        }
    }
    public queryList(req:Request, res:Response){
        let pool:mysql.IPool = mysql.createPool(this.dbConf);
        let criteria:Array<any> = req.body.criteria;
        let order:Array<any> = req.body.order;
        let pagination:any = req.body.pagination;
        let sql = {dataSql:"", amountSql:""}, sqlSuffix = "";
        if(!this.modelName) throw "Query parameters invalida, entity name is required!";
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
                console.log("abcde1");
                conn.query(sql.amountSql, (aErr, amount) => {
                    this.handlerErr(aErr);
                    conn.query(sql.dataSql, (dErr, data) => {
                        this.handlerErr(dErr);
                        let result = {total:amount[0].amount,
                            data: this.formatEntities(data)};
                        this.logger.logDebug(result);
                        res.json(result);
                        conn.destroy();
                    });
                })
            } else {
                conn.query(sql.dataSql, (dErr, data) => {
                    this.handlerErr(dErr);
                    data = this.formatEntities(data);
                    res.json(data);
                    conn.destroy();
                });
            }
        });
    }
    //转换对象
    private formatEntity(row:any){
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
    private formatEntities(entities:any[]){
        let formatRows = new Array();
        entities.forEach(item=>{
            formatRows.push(this.formatEntity(item));
        });
        return formatRows;
    }
    //从元数据中根据属性名称读取表字段名
    private getFieldWithProperty(property:string){
        let meta = this.modelMetadata.find(item =>item.name == property);
        if(meta){
            return meta.metadatas.field;
        }
        return property;
    }
}