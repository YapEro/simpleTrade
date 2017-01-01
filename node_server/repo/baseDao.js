"use strict";
const dataReader_1 = require("./dataReader");
const dataWriter_1 = require("./dataWriter");
const logUtils_1 = require("../utils/logUtils");
class baseDao {
    constructor(cort) {
        this.modelCort = cort;
        this.modelName = cort.name;
        this.modelInstance = new cort();
        this.reader = new dataReader_1.dataReader(this.modelName, this.modelInstance);
        this.writer = new dataWriter_1.dataWriter(this.modelName, this.modelInstance);
        this.logger = new logUtils_1.logUtils(`repo.${this.modelName}`);
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