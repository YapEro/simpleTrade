import {isObject, isError} from "util";
import {Logger} from "log4js";
/**
 * Created by sean on 2016/12/14.
 * 日志记录辅助类
 * info/debug:控制台输出
 * warn/error:控制台 + 文件输出
 */
export class logUtils{
    private owner:string;
    private log4js = require("log4js");
    private consoleLogger:Logger;
    private fileLogger:Logger;

    constructor(owner:string="logUtils"){
        this.owner = owner;
        let conf = require("../conf/log4js.json");
        this.log4js.configure(conf);
        this.consoleLogger = this.log4js.getLogger("console");
        this.fileLogger = this.log4js.getLogger("log_date");
    }

    public logInfo(msg:any){
        this.consoleLogger.info(this.getMsgString(msg));
    }

    public logDebug(msg:any){
        this.consoleLogger.debug(this.getMsgString(msg));
    }

    public logWarn(msg:any){
        let msgStr = this.getMsgString(msg);
        this.consoleLogger.warn(msgStr);
        this.fileLogger.warn(msgStr);
    }

    public logError(msg:any){
        let msgStr = this.getMsgString(msg);
        this.consoleLogger.error(msgStr);
        this.fileLogger.error(msgStr);
    }
    //格式化日志内容，如果是对象，将其转换JSON字符串，并添加纪录类的名称
    private getMsgString(msg:any):string{
        let msgStr:string;
        if(isError(msg)){
            let err:Error = msg;
            msgStr = `error \t name: ${err.name};\r\n\t message:${err.message};\r\n\t stack:${err.stack}`;
        }
        if(isObject(msg)){
            msgStr = JSON.stringify(msg);
        } else {
            msgStr = msg;
        }
        return `Owner:[${this.owner}] - ${msgStr}`;
    }
}