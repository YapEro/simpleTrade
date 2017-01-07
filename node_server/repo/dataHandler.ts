import {logUtils} from "../utils/logUtils";
import {getMetas} from "../../models/modelDecorator";

export class dataHandler{
    protected dbConf:JSON = require("../conf/db.json");
    protected logger = new logUtils("repo.dataHandler");
    protected modelMetadata:any[];
    protected modelName:string;
    protected modelInstance:Object;
    public constructor(modelName:string, modelInstance:Object){
        this.modelName = modelName;
        this.modelInstance = modelInstance;
        this.modelMetadata = getMetas(this.modelName, this.modelInstance);
    }
    public handlerErr(err:Error){
        if(err){
            this.logger.logError(err);
            throw err;
        }
    }

    //读取对象主键属性名称
    public getKeyProperty():string{
        let keyMetadata = this.modelMetadata.find(item=>item.metadatas.isPK);
        if(keyMetadata) return keyMetadata.name;
        return null;
    }
    //转换对象
    public formatEntity(row:any){
        let formatRow = {};
        this.modelMetadata.forEach(({name, metadatas})=>{
            for(let item in row){
                if(item == metadatas.field){
                    formatRow[name] = row[item];
                }
            }
        });
        return formatRow
    }
    //转换对象集合
    public formatEntities(entities:any[]){
        let formatRows = new Array();
        entities.forEach(item=>{
            formatRows.push(this.formatEntity(item));
        });
        return formatRows;
    }
    //从元数据中根据属性名称读取表字段名
    public getFieldWithProperty(property:string){
        let meta = this.modelMetadata.find(item =>item.name == property);
        if(meta){
            return meta.metadatas.field;
        }
        return property;
    }

    //仅对日期型、字符型添加单引号
    public formatValue(value:any, proName:string){
        let meta = this.modelMetadata.find(item =>item.name == proName);
        if(meta){
            switch(meta.metadatas.type.toLocaleLowerCase()){
                case "string":
                case "date":
                    return `'${value}'`;
            }
        }
        return `${value}`;
    }
    //删除最后的特殊字符
    public cutoffLastChar(char:string, str:string){
        if(str && str.endsWith(char)){
            return str.substr(0, str.length - char.length);
        }
        return str;
    }
}