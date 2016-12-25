import {Request, Response} from "express";
import {daoUtils} from "../utils/daoUtils";
import {getMetas} from "../../models/modelDecorator";
import {logUtils} from "../utils/logUtils";
export class baseDao<T>{
    private utils:daoUtils;
    private modelCort:{new():T};
    private modelName:string;
    private modelInstance:Object;
    private modelMetadatas:any[];
    private logger:logUtils;
    get getModelMetadatas(){
        if(!this.modelMetadatas)
            this.modelMetadatas = getMetas(this.modelName, this.modelInstance);
        return this.modelMetadatas;
    }
    public constructor(cort:{new():T}){
        this.utils = new daoUtils();
        this.modelCort = cort;
        this.modelName = cort.name;
        this.modelInstance = new cort();
        this.logger = new logUtils(`repo.${this.modelName}`);
    }
    public queryList(req:Request, res:Response){
        let result = this.utils.queryList(req);
        this.logger.logDebug({data:result});
        let formatList:any[] = [];
        result.forEach((row)=>{
            let formatRow = {};
            this.modelMetadatas.forEach(({name, metadatas})=>{
                for(let item in row){
                    if(item == metadatas.field){
                        formatRow[name] = row[item];
                    }
                }
            });
            formatList.push(formatRow);
        });
        res.json(formatList);
    }

    public update(req:Request, res:Response){

    }
}