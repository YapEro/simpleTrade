/**
 * Created by 谭宏志 on 2016/12/24.
 */
import "reflect-metadata";

const propertiesKey = Symbol("properties");
const propertyExtKey = Symbol("propertyExt");
const metaDict:any[] = [];

//属性扩展描述，value格式propertyExt({field:”name”, isPK:true/false validations:{required:true/false, regex:””}, label:”” })
export function propertyExt(value: Object){
    //return Reflect.metadata(propertiesKey, value);
    return (target:Object, propertyKey:string) =>{
        let designType = Reflect.getMetadata("design:type", target, propertyKey);
        value["type"] = designType.name;
        //定义属性元数据字典，如果已存在，继续添加，否则新增一个
        let propertyMeta = {name:propertyKey, metadatas: value};
        if(!Reflect.hasMetadata(propertiesKey, target))
            Reflect.defineMetadata(propertiesKey, [propertyMeta], target);
        else {
            let properties = Reflect.getMetadata(propertiesKey, target);
            properties.push(propertyMeta);
            Reflect.metadata(propertiesKey, properties);
        }
        //加上此句内容，才会生成design:type装饰器
        Reflect.metadata(propertyExtKey, value);
    };
}

//从缓存中读取对象元数据，若无，从装饰器元数据中读取，并添加至缓存
export function  getMetas(modelName:string, modelCort:Object){
    let metadatas = metaDict.find(({key, data})=> key == modelName);
    if(!metadatas){
        console.log("cache handler");
        metadatas = Reflect.getMetadata(propertiesKey, modelCort);
        if(metadatas)
            metaDict.push({key:modelName, data:metadatas});
        return metadatas;
    }
    return metadatas.data;
}