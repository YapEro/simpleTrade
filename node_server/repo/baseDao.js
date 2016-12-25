"use strict";
const daoUtils_1 = require("../utils/daoUtils");
const modelDecorator_1 = require("../../models/modelDecorator");
const logUtils_1 = require("../utils/logUtils");
class baseDao {
    constructor(cort) {
        this.utils = new daoUtils_1.daoUtils();
        this.modelCort = cort;
        this.modelName = cort.name;
        this.modelInstance = new cort();
        this.logger = new logUtils_1.logUtils(`repo.${this.modelName}`);
    }
    get getModelMetadatas() {
        if (!this.modelMetadatas)
            this.modelMetadatas = modelDecorator_1.getMetas(this.modelName, this.modelInstance);
        return this.modelMetadatas;
    }
    queryList(req, res) {
        console.log("router?");
        let result = this.utils.queryList(req);
        this.logger.logDebug({ data: result });
        let formatList = [];
        result.forEach((row) => {
            let formatRow = {};
            this.modelMetadatas.forEach(({ name, metadatas }) => {
                for (let item in row) {
                    if (item == metadatas.field) {
                        formatRow[name] = row[item];
                    }
                }
            });
            formatList.push(formatRow);
        });
        res.json(formatList);
    }
    update(req, res) {
    }
}
exports.baseDao = baseDao;
//# sourceMappingURL=baseDao.js.map