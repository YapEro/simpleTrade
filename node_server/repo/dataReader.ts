import * as mysql from "mysql"
import {Request, Response} from "express"
import {dataHandler} from "./dataHandler";
export class dataReader extends dataHandler{
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
                super.handlerErr(dErr);
                if(handleEntity) handleEntity(data);
                let result = {result:true, content:data,
                    message:`Query [${this.modelName}] data for key ${keyValue}`};
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
                        let result = {result:true, content:{total:amount[0].amount,
                            data: data}, message:`Query [${this.modelName}] data ${data.length}`};
                        this.logger.logDebug(result);
                        res.json(result);
                        conn.destroy();
                    });
                })
            } else {
                conn.query(sql.dataSql, (dErr, data) => {
                    super.handlerErr(dErr);
                    data = this.formatEntities(data);
                    if(handleList) handleList(data);
                    let result = {result:true, content:data,
                        message:`Query [${this.modelName}] data ${data.length}`};
                    this.logger.logDebug(result);
                    res.json(result);
                    conn.destroy();
                });
            }
        });
    }
}