import {Request, Response} from "express";
import {dataHandler} from "./dataHandler";
import {logUtils} from "../utils/logUtils";
import * as mysql from "mysql";
export class baseDao<T>{
    protected dbConf:JSON = require("../conf/db.json");
    private dbHandler:dataHandler;
    private modelCort:{new():T};
    private modelName:string;
    private modelInstance:Object;
    private logger:logUtils;
    public constructor(cort:{new():T}){
        this.modelCort = cort;
        this.modelName = cort.name;
        this.modelInstance = new cort();
        this.dbHandler = new dataHandler(this.modelName, this.modelInstance);
        this.logger = new logUtils(`repo.${this.modelName}`);
    }
    protected handlerErr(err:Error){
        if(err){
            this.logger.logError(err);
            throw err;
        }
    }
    protected sqlExec(sql:string, callback:Function){
        let pool:mysql.IPool = mysql.createPool(this.dbConf);
        pool.getConnection((err, conn) => {
            this.handlerErr(err);
            conn.query(sql, (dErr, data) => {
                this.handlerErr(err);
                callback(data);
                conn.destroy();
            });
        });
    }
    public queryList(req:Request, res:Response){
        this.dbHandler.queryList(req, res, this.handleList);
    }
    public queryEntity(req:Request, res:Response){
        this.dbHandler.queryWithKey(req, res, this.handleEntity);
    }
    public deleteData(req:Request, res:Response){
        this.dbHandler.deleteData(req, res, this.beforeDelete, this.afterDelete);
    }
    public saveData(req:Request, res:Response){
        this.dbHandler.saveEntity(req, res, this.beforeSave, this.afterSave);
    }
    protected handleList(data:any[]):void{}
    protected handleEntity(data:any):void{}
    protected beforeSave(data:any, res:Response):boolean{return true;}
    protected afterSave(data:any):string{return null;}
    protected beforeDelete(keys:any, res:Response):boolean{return true;}
    protected afterDelete(keys:any):string{return null;}
}