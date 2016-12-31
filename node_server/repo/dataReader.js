"use strict";
const mysql = require("mysql");
const logUtils_1 = require("../utils/logUtils");
const modelDecorator_1 = require("../../models/modelDecorator");
class dataReader {
    constructor(modelName, modelInstance) {
        this.dbConf = require("../conf/db.json");
        this.logger = new logUtils_1.logUtils("repo.dataReader");
        this.modelName = modelName;
        this.modelInstance = modelInstance;
        this.modelMetadata = modelDecorator_1.getMetas(this.modelName, this.modelInstance);
    }
    handlerErr(err) {
        if (err) {
            this.logger.logError(err);
            throw err;
        }
    }
    queryList(req, res, handleList) {
        let pool = mysql.createPool(this.dbConf);
        let criteria = req.body.criteria;
        let order = req.body.order;
        let pagination = req.body.pagination;
        let sql = { dataSql: "", amountSql: "" }, sqlSuffix = "";
        if (!this.modelName)
            throw "Query parameters invalida, entity name is required!";
        sql.dataSql = `Select * from ${this.modelName}`;
        if (criteria) {
            sqlSuffix += " where ";
            criteria.forEach(({ property, operator, value }) => {
                sqlSuffix += `${this.getFieldWithProperty(property)}${operator}${value} and `;
            });
            if (sqlSuffix.trim().endsWith("and"))
                sqlSuffix = sqlSuffix.substr(0, sqlSuffix.length - 4);
        }
        //若有分页需求，对查询SQL + 查询条件进行统计
        if (pagination) {
            sql.amountSql = `Select count(*) as amount from ${this.modelName} ${sqlSuffix}`;
        }
        if (order) {
            sqlSuffix += " order by ";
            order.forEach(({ property, direction }) => {
                sqlSuffix += `${this.getFieldWithProperty(property)}` + (direction ? " " + direction : "") + ",";
            });
            if (sqlSuffix.endsWith(","))
                sqlSuffix = sqlSuffix.substr(0, sqlSuffix.length - 1);
        }
        if (pagination) {
            sqlSuffix += ` limit ${pagination.pSize * (pagination.pIndex - 1)}, ${pagination.pSize}`;
        }
        sql.dataSql += sqlSuffix;
        console.log(sql.dataSql);
        pool.getConnection((err, conn) => {
            this.handlerErr(err);
            //若有分页需求，先计算总数，再查询数据
            if (pagination) {
                conn.query(sql.amountSql, (aErr, amount) => {
                    this.handlerErr(aErr);
                    conn.query(sql.dataSql, (dErr, data) => {
                        this.handlerErr(dErr);
                        data = this.formatEntities(data);
                        if (handleList)
                            handleList(data);
                        let result = { total: amount[0].amount,
                            data: data };
                        this.logger.logDebug(result);
                        res.json(result);
                        conn.destroy();
                    });
                });
            }
            else {
                conn.query(sql.dataSql, (dErr, data) => {
                    this.handlerErr(dErr);
                    data = this.formatEntities(data);
                    if (handleList)
                        handleList(data);
                    res.json(data);
                    conn.destroy();
                });
            }
        });
    }
    //转换对象
    formatEntity(row) {
        let formatRow = {};
        this.modelMetadata.forEach(({ name, metadatas }) => {
            for (let item in row) {
                if (item == metadatas.field) {
                    formatRow[name] = row[item];
                }
            }
        });
        return formatRow;
    }
    //转换对象集合
    formatEntities(entities) {
        let formatRows = new Array();
        entities.forEach(item => {
            formatRows.push(this.formatEntity(item));
        });
        return formatRows;
    }
    //从元数据中根据属性名称读取表字段名
    getFieldWithProperty(property) {
        let meta = this.modelMetadata.find(item => item.name == property);
        if (meta) {
            return meta.metadatas.field;
        }
        return property;
    }
}
exports.dataReader = dataReader;
//# sourceMappingURL=dataReader.js.map