"use strict";
const logUtils_1 = require("../utils/logUtils");
const modelDecorator_1 = require("../../models/modelDecorator");
class daoUtils {
    constructor(modelName, modelInstance) {
        this.dbConf = require("../conf/db.json");
        this.logger = new logUtils_1.logUtils("repo.dataWriter");
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
    saveEntity(req, res) {
        let msg;
        if (!req.body) {
            msg = `${this.modelName}:has no data for save!`;
        }
        if (!(req.body instanceof this.modelInstance.constructor)) {
            msg = `${this.modelName}:data is invalid!`;
        }
        let keyProperty = this.getKeyProperty();
        if (!keyProperty) {
            msg = `${this.modelName}:has no primary key property define!`;
        }
        if (msg) {
            this.logger.logError(msg);
            throw new Error(msg);
        }
        this.modelInstance = req.body;
        //更新对象
        if (this.modelInstance[keyProperty]) {
        }
        else {
        }
    }
    getKeyProperty() {
        let keyMetadata = this.modelMetadata.find(item => item.metadatas.isPK);
        if (keyMetadata)
            return keyMetadata.name;
        return null;
    }
}
exports.daoUtils = daoUtils;
//# sourceMappingURL=dataWriter.js.map