import {Request, Response} from "express";
import {dataReader} from "./dataReader";
import {dataWriter} from "./dataWriter";
import {logUtils} from "../utils/logUtils";
export class baseDao<T>{
    private reader:dataReader;
    private writer:dataWriter;
    private modelCort:{new():T};
    private modelName:string;
    private modelInstance:Object;
    private logger:logUtils;
    public constructor(cort:{new():T}){
        this.modelCort = cort;
        this.modelName = cort.name;
        this.modelInstance = new cort();
        this.reader = new dataReader(this.modelName, this.modelInstance);
        this.writer = new dataWriter(this.modelName, this.modelInstance);
        this.logger = new logUtils(`repo.${this.modelName}`);
    }
    public queryList(req:Request, res:Response){
        this.reader.queryList(req, res, this.handleList);
    }
    public queryEntity(req:Request, res:Response){
        this.reader.queryWithKey(req, res, this.handleEntity);
    }
    public deleteData(req:Request, res:Response){
        this.writer.deleteData(req, res, this.beforeDelete, this.afterDelete);
    }
    public saveData(req:Request, res:Response){
        this.writer.saveEntity(req, res, this.beforeSave, this.afterSave);
    }
    protected handleList(data:any[]):void{}
    protected handleEntity(data:any):void{}
    protected beforeSave(data:any, res:Response):boolean{return true;}
    protected afterSave(data:any):string{return null;}
    protected beforeDelete(keys:any, res:Response):boolean{return true;}
    protected afterDelete(keys:any):string{return null;}
}