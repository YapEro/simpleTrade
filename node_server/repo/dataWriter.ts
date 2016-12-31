import * as mysql from "mysql"
import {Request, Response} from "express"
import {logUtils} from "../utils/logUtils";
import {getMetas} from "../../models/modelDecorator";
export class dataWriter{
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
    public saveEntity(req:Request, res:Response, beforeSave?:Function, afterSave?:Function){
        let msg:string;
        let keyProperty = this.getKeyProperty();
        //配置检查
        if(!keyProperty)
            msg = `${this.modelName}:has no primary key property define!`;
        else
            msg = this.validateInput(req.body);
        //自定义检查
        if(!msg && beforeSave) {
            msg = beforeSave(req.body);
        }
        if(msg){
            this.logger.logError(msg);
            throw new Error(msg);
        }
        this.modelInstance = req.body;
        let sql:string = "", fieldSql:string = "", valueSql:string = "";
        //更新对象
        if(this.modelInstance[keyProperty]){
            sql = `update ${this.modelName} set `;
            for(let pro in this.modelInstance){
                if(pro == keyProperty) continue;
                sql += `${this.getFieldWithProperty(pro)}=${this.formatValue(this.modelInstance[pro], pro)},`;
            }
            sql = this.cutoffLastChar(",", sql);
            sql += ` where ${this.getFieldWithProperty(keyProperty)}=${this.modelInstance[keyProperty]}`;
        } else {  //新增对象
            sql = `insert into ${this.modelName} `;
            for(let pro in this.modelInstance){
                if(pro == keyProperty) continue;
                fieldSql += `${this.getFieldWithProperty(pro)},`;
                valueSql += `${this.formatValue(this.modelInstance[pro], pro)},`;
            }
            fieldSql = this.cutoffLastChar(",", fieldSql);
            valueSql = this.cutoffLastChar(",", valueSql);
            sql += `(${fieldSql}) values (${valueSql})`;
        }
        this.logger.logDebug(sql);
        let pool:mysql.IPool = mysql.createPool(this.dbConf);
        pool.getConnection((err, conn)=>{
            this.handlerErr(err);
            conn.query(sql,(cErr, result)=>{
                this.handlerErr(cErr);
                if(!this.modelInstance[keyProperty]){
                    conn.query("select LAST_INSERT_ID() as nKey", (qErr, newKey)=>{
                        this.handlerErr(qErr);
                        this.logger.logDebug(`insert new key:${newKey[0].nKey}`);
                        if(afterSave) afterSave(this.modelInstance);
                        res.json({result:true, content:newKey[0].nKey, message: `Successful for insert data ${this.modelName}`});
                    });
                } else {
                    if(afterSave) afterSave(this.modelInstance);
                    res.json({result:true, message:`Successful for update data ${this.modelName}`});
                }
            });
        });
    }
    public deleteCollection(keys:Array<number>){

    }
    public deleteData(key:number){

    }
    //根据验证配置对输入数据进行验证
    private validateInput(data:any):string{
        let validMsg:string = "";
        this.modelMetadata.forEach(metadata=>{
            let validations = metadata.metadatas.validations;
            let proTitle = metadata.metadatas.label;
            if(validations){
                let proName:string;
                for(let item in data){
                    if(item == metadata.name){
                        proName = item;
                        break;
                    }
                }
                if(proName){
                    if(validations.require && !data[proName])
                        validMsg += `${proTitle} is require property, please input value!\r\n`;
                    if(validations.regex && !(new RegExp(validations.regex)).test(data[proName]))
                        validMsg += `${proTitle}:${data[proName]} is not match ${validations.regex}!\r\n`;
                }
            }
        });
        return validMsg;
    }
    //从元数据中根据属性名称读取表字段名
    private getFieldWithProperty(proName:string){
        let meta = this.modelMetadata.find(item =>item.name == proName);
        if(meta){
            return meta.metadatas.field;
        }
        return proName;
    }
    //读取对象主键属性名称
    private getKeyProperty():string{
        let keyMetadata = this.modelMetadata.find(item=>item.metadatas.isPK);
        if(keyMetadata) return keyMetadata.name;
        return null;
    }
    //仅对日期型、字符型添加单引号
    private formatValue(value:any, proName:string){
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
    private cutoffLastChar(char:string, str:string){
        if(str && str.endsWith(char)){
            return str.substr(0, str.length - char.length);
        }
        return str;
    }
}