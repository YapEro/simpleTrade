"use strict";
const util_1 = require("util");
/**
 * Created by sean on 2016/12/14.
 * 日志记录辅助类
 * info/debug:控制台输出
 * warn/error:控制台 + 文件输出
 */
class logUtils {
    constructor(owner = "logUtils") {
        this.log4js = require("log4js");
        this.owner = owner;
        let conf = require("../conf/log4js.json");
        this.log4js.configure(conf);
        this.consoleLogger = this.log4js.getLogger("console");
        this.fileLogger = this.log4js.getLogger("log_date");
    }
    logInfo(msg) {
        this.consoleLogger.info(this.getMsgString(msg));
    }
    logDebug(msg) {
        this.consoleLogger.debug(this.getMsgString(msg));
    }
    logWarn(msg) {
        let msgStr = this.getMsgString(msg);
        this.consoleLogger.warn(msgStr);
        this.fileLogger.warn(msgStr);
    }
    logError(msg) {
        let msgStr = this.getMsgString(msg);
        this.consoleLogger.error(msgStr);
        this.fileLogger.error(msgStr);
    }
    //格式化日志内容，如果是对象，将其转换JSON字符串，并添加纪录类的名称
    getMsgString(msg) {
        let msgStr;
        if (util_1.isObject(msg)) {
            msgStr = JSON.stringify(msg);
        }
        else {
            msgStr = msg;
        }
        return `Owner:[${this.owner}] - ${msgStr}`;
    }
}
exports.logUtils = logUtils;
//# sourceMappingURL=logUtils.js.map