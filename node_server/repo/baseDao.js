"use strict";
const dataHandler_1 = require("./dataHandler");
const logUtils_1 = require("../utils/logUtils");
const mysql = require("mysql");
class baseDao {
    constructor(cort) {
        this.dbConf = require("../conf/db.json");
        this.modelCort = cort;
        this.modelName = cort.name;
        this.modelInstance = new cort();
        this.dbHandler = new dataHandler_1.dataHandler(this.modelName, this.modelInstance);
        this.logger = new logUtils_1.logUtils(`repo.${this.modelName}`);
    }
    handlerErr(err) {
        if (err) {
            this.logger.logError(err);
            throw err;
        }
    }
    sqlExec(sql, callback) {
        let pool = mysql.createPool(this.dbConf);
        pool.getConnection((err, conn) => {
            this.handlerErr(err);
            conn.query(sql, (dErr, data) => {
                this.handlerErr(err);
                callback(data);
                conn.destroy();
            });
        });
    }
    queryList(req, res) {
        this.dbHandler.queryList(req, res, this.handleList);
    }
    queryEntity(req, res) {
        this.dbHandler.queryWithKey(req, res, this.handleEntity);
    }
    deleteData(req, res) {
        this.dbHandler.deleteData(req, res, this.beforeDelete, this.afterDelete);
    }
    saveData(req, res) {
        this.dbHandler.saveEntity(req, res, this.beforeSave, this.afterSave);
    }
    handleList(data) { }
    handleEntity(data) { }
    beforeSave(data, res) { return true; }
    afterSave(data) { return null; }
    beforeDelete(keys, res) { return true; }
    afterDelete(keys) { return null; }
}
exports.baseDao = baseDao;
//# sourceMappingURL=baseDao.js.map