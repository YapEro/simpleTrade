/**
 * Created by Sean on 2017/1/28.
 */
import express = require('express');
import {logUtils} from "../utils/logUtils";
import {getMetas} from "../../models/modelDecorator";
import {Request,Response, NextFunction} from "express";
import {response} from "../../models/response";
import {product} from "../../models/product";
import {customer} from "../../models/customer";
import {order_detail} from "../../models/order_detail";
import {order} from "../../models/order";
let router = express.Router();
let logger = new logUtils("router.metadataRouter");
router.get('/getMetadata', function(req:Request, res:Response, next:NextFunction) {
    let modelName = req.query.name;
    let result:response = new response(false, "", null);
    if(!modelName) {
        result.message = "need mode name parameter!";
    } else {
        let metadata = getMetas(modelName, getInstance(modelName))
        if(metadata) {
            result.result = true;
            result.message = `metadatas for ${modelName} is ok`;
            result.content = metadata;
            logger.logDebug(metadata);
        } else {
            result.message = `metadatas for ${modelName} is empty!`;
        }
    }
    res.json(result);
});

function getInstance(modelName:string):Object{
    switch(modelName.toLocaleLowerCase()){
        case "product": return new product();
        case "customer": return new customer();
        case "order": return new order();
        case "order_detail": return new order_detail();
        default: return null;
    }
}
module.exports = router;