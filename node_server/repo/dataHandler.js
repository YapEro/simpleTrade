"use strict";
const logUtils_1 = require("../utils/logUtils");
const modelDecorator_1 = require("../../models/modelDecorator");
class dataHandler {
    constructor(modelName, modelInstance) {
        this.dbConf = require("../conf/db.json");
        this.logger = new logUtils_1.logUtils("repo.dataHandler");
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
    //读取对象主键属性名称
    getKeyProperty() {
        let keyMetadata = this.modelMetadata.find(item => item.metadatas.isPK);
        if (keyMetadata)
            return keyMetadata.name;
        return null;
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
    //仅对日期型、字符型添加单引号
    formatValue(value, proName) {
        let meta = this.modelMetadata.find(item => item.name == proName);
        if (meta) {
            switch (meta.metadatas.type.toLocaleLowerCase()) {
                case "string":
                case "date":
                    return `'${value}'`;
            }
        }
        return `${value}`;
    }
    //删除最后的特殊字符
    cutoffLastChar(char, str) {
        if (str && str.endsWith(char)) {
            return str.substr(0, str.length - char.length);
        }
        return str;
    }
}
exports.dataHandler = dataHandler;
//# sourceMappingURL=dataHandler.js.map