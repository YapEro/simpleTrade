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
    saveData(req, res) {
        this.writer.saveEntity(req, res, this.beforeSave, this.afterSave);
    }
}
exports.baseDao = baseDao;
//# sourceMappingURL=baseDao.js.map