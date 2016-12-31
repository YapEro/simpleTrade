/**
 * Created by sean on 2016/12/23.
 */
import * as mysql from "mysql"
import {Request, Response} from "express"
import {logUtils} from "../utils/logUtils";
import {getMetas} from "../../models/modelDecorator";
export class daoUtils{
    private dbConf:JSON = require("../conf/db.json");
    private logger = new logUtils("repo.dataWriter");
    private modelMetadata:any[];
    private modelName:string;
    private modelInstance:Object;
    public constructor(modelName:string, modelInstance:Object){
        this.modelName = modelName;
        this.modelInstance = modelInstance;
        this.modelMetadata = getMetas(this.modelName, this.modelInstance);
    }
    private handlerErr(err:Error){
        if(err){
            this.logger.logError(err);
            throw err;
        }
    }
    public saveEntity(req:Request, res:Response){
        let msg:string;
        if(!req.body) {
            msg = `${this.modelName}:has no data for save!`;
        }
        if(!(req.body instanceof this.modelInstance.constructor)){
            msg = `${this.modelName}:data is invalid!`;
        }
        let keyProperty = this.getKeyProperty();
        if(!keyProperty) {
            msg = `${this.modelName}:has no primary key property define!`;
        }
        if(msg){
            this.logger.logError(msg);
            throw new Error(msg);
        }
        this.modelInstance = req.body;
        //更新对象
        if(this.modelInstance[keyProperty]){

        } else {  //新增对象

        }
    }
    private getKeyProperty():string{
        let keyMetadata = this.modelMetadata.find(item=>item.metadatas.isPK);
        if(keyMetadata) return keyMetadata.name;
        return null;
    }
}