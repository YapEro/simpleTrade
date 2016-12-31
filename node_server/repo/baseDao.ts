import {Request, Response} from "express";
import {dataReader} from "./dataReader";
import {logUtils} from "../utils/logUtils";
export class baseDao<T>{
    private reader:dataReader;
    private modelCort:{new():T};
    private modelName:string;
    private modelInstance:Object;
    private logger:logUtils;
    public constructor(cort:{new():T}){
        this.modelCort = cort;
        this.modelName = cort.name;
        this.modelInstance = new cort();
        this.reader = new dataReader(this.modelName, this.modelInstance);
        this.logger = new logUtils(`repo.${this.modelName}`);
    }
    public queryList(req:Request, res:Response){
        this.reader.queryList(req, res);
    }

    public update(req:Request, res:Response){

    }
}