"use strict";
const mysql = require("mysql");
const logUtils_1 = require("../utils/logUtils");
const modelDecorator_1 = require("../../models/modelDecorator");
class dataWriter {
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
    saveEntity(req, res, beforeSave, afterSave) {
        let msg;
        let keyProperty = this.getKeyProperty();
        if (!keyProperty) {
            msg = `${this.modelName}:has no primary key property define!`;
        }
        if (beforeSave) {
            msg = beforeSave(req.body);
        }
        if (msg) {
            this.logger.logError(msg);
            throw new Error(msg);
        }
        this.modelInstance = req.body;
        let sql = "", fieldSql = "", valueSql = "";
        //更新对象
        if (this.modelInstance[keyProperty]) {
            sql = `update ${this.modelName} set `;
            for (let pro in this.modelInstance) {
                if (pro == keyProperty)
                    continue;
                sql += `${this.getFieldWithProperty(pro)}=${this.formatValue(this.modelInstance[pro], pro)},`;
            }
            sql = this.cutoffLastChar(",", sql);
            sql += ` where ${this.getFieldWithProperty(keyProperty)}=${this.modelInstance[keyProperty]}`;
        }
        else {
            sql = `insert into ${this.modelName} `;
            for (let pro in this.modelInstance) {
                if (pro == keyProperty)
                    continue;
                fieldSql += `${this.getFieldWithProperty(pro)},`;
                valueSql += `${this.formatValue(this.modelInstance[pro], pro)},`;
            }
            fieldSql = this.cutoffLastChar(",", fieldSql);
            valueSql = this.cutoffLastChar(",", valueSql);
            sql += `(${fieldSql}) values (${valueSql})`;
        }
        this.logger.logDebug(sql);
        let pool = mysql.createPool(this.dbConf);
        pool.getConnection((err, conn) => {
            this.handlerErr(err);
            conn.query(sql, (cErr, result) => {
                this.handlerErr(cErr);
                if (!this.modelInstance[keyProperty]) {
                    conn.query("select LAST_INSERT_ID() as nKey", (qErr, newKey) => {
                        this.handlerErr(qErr);
                        this.logger.logDebug(`insert new key:${newKey[0].nKey}`);
                        if (afterSave)
                            afterSave(this.modelInstance);
                        res.json({ result: true, content: newKey[0].nKey, message: `Successful for insert data ${this.modelName}` });
                    });
                }
                else {
                    if (afterSave)
                        afterSave(this.modelInstance);
                    res.json({ result: true, message: `Successful for update data ${this.modelInstance}` });
                }
            });
        });
    }
    validateInput(data) {
        this.modelMetadata.forEach(metadata => {
            if (metadata.metadatas.validations) {
                let proName;
                for (let item in data) {
                    if (item == metadata.name) {
                        proName = item;
                        break;
                    }
                }
                if (proName) {
                }
            }
        });
        return null;
    }
    //从元数据中根据属性名称读取表字段名
    getFieldWithProperty(proName) {
        let meta = this.modelMetadata.find(item => item.name == proName);
        if (meta) {
            return meta.metadatas.field;
        }
        return proName;
    }
    //读取对象主键属性名称
    getKeyProperty() {
        let keyMetadata = this.modelMetadata.find(item => item.metadatas.isPK);
        if (keyMetadata)
            return keyMetadata.name;
        return null;
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
exports.dataWriter = dataWriter;
//# sourceMappingURL=dataWriter.js.map