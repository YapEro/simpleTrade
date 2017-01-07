"use strict";
const dataReader_1 = require("./dataReader");
const dataWriter_1 = require("./dataWriter");
const logUtils_1 = require("../utils/logUtils");
const mysql = require("mysql");
class baseDao {
    constructor(cort) {
        this.dbConf = require("../conf/db.json");
        this.modelCort = cort;
        this.modelName = cort.name;
        this.modelInstance = new cort();
        this.reader = new dataReader_1.dataReader(this.modelName, this.modelInstance);
        this.writer = new dataWriter_1.dataWriter(this.modelName, this.modelInstance);
        this.logger = new logUtils_1.logUtils(`repo.${this.modelName}`);
    }
    handlerErr(err) {
        if (err) {
            this.logger.logError(err);
            throw err;
        }
    }
    dataHandle(sql, callback) {
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
        this.reader.queryList(req, res, this.handleList);
    }
    queryEntity(req, res) {
        this.reader.queryWithKey(req, res, this.handleEntity);
    }
    deleteData(req, res) {
        this.writer.deleteData(req, res, this.beforeDelete, this.afterDelete);
    }
    saveData(req, res) {
        this.writer.saveEntity(req, res, this.beforeSave, this.afterSave);
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