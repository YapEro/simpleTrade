import {Request, Response} from "express";
import {dataReader} from "./dataReader";
import {dataWriter} from "./dataWriter";
import {logUtils} from "../utils/logUtils";
export abstract class baseDao<T>{
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

    public saveData(req:Request, res:Response){
        this.writer.saveEntity(req, res, this.beforeSave, this.afterSave);
    }
    protected abstract handleList(data:any[]):void;
    protected abstract beforeSave(data:any):string;
    protected abstract afterSave(data:any):void;
}