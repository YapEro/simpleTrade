"use strict";
/**
 * Created by sean on 2016/12/23.
 */
const mysql = require("mysql");
const logUtils_1 = require("./logUtils");
const commUtils_1 = require("./commUtils");
class daoUtils {
    constructor() {
        this.dbConf = require("../conf/db.json");
        this.loggerOwner = "utils.daoUtils";
        this.logger = new logUtils_1.logUtils(this.loggerOwner);
    }
    queryList(req) {
        let pool = mysql.createPool(this.dbConf);
        let eName = req.body.eName;
        let criteria = req.body.criteria;
        let order = req.body.order;
        let pagination = req.body.pagination;
        let sql = { dataSql: "", amountSql: "" }, sqlSuffix = "";
        if (!eName)
            throw "Query parameters invalida, entity name is required!";
        sql.dataSql = `Select * from ${eName}`;
        if (criteria) {
            sqlSuffix += " where ";
            criteria.forEach(({ field, operator, value }) => {
                sqlSuffix += `${field}${operator}${value} and `;
            });
            if (sqlSuffix.trim().endsWith("and"))
                sqlSuffix = sqlSuffix.substr(0, sqlSuffix.length - 4);
        }
        //若有分页需求，对查询SQL + 查询条件进行统计
        if (pagination) {
            sql.amountSql = `Select count(*) as amount from ${eName} ${sqlSuffix}`;
        }
        if (order) {
            sqlSuffix += " order by ";
            order.forEach(({ field, direction }) => {
                sqlSuffix += `${field}` + (direction ? " " + direction : "") + ",";
            });
            if (sqlSuffix.endsWith(","))
                sqlSuffix = sqlSuffix.substr(0, sqlSuffix.length - 1);
        }
        if (pagination) {
            sqlSuffix += ` limit ${pagination.pSize * (pagination.pIndex - 1)}, ${pagination.pSize}`;
        }
        sql.dataSql += sqlSuffix;
        pool.getConnection((err, conn) => {
            //若有分页需求，先计算总数，再查询数据
            if (pagination) {
                conn.query(sql.amountSql, (aErr, amount) => {
                    commUtils_1.commUtils.handlerErr(this.loggerOwner, aErr);
                    conn.query(sql.dataSql, (dErr, data) => {
                        commUtils_1.commUtils.handlerErr(this.loggerOwner, dErr);
                        let result = { total: amount[0].amount, data: data };
                        this.logger.logDebug(result);
                        return result;
                    });
                });
            }
            else {
                conn.query(sql.dataSql, (dErr, data) => {
                    commUtils_1.commUtils.handlerErr(this.loggerOwner, dErr);
                    this.logger.logDebug(data);
                    return data;
                });
            }
        });
        return null;
    }
}
exports.daoUtils = daoUtils;
//# sourceMappingURL=daoUtils.js.map