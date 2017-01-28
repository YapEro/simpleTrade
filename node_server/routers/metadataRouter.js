"use strict";
/**
 * Created by Sean on 2017/1/28.
 */
const express = require("express");
const logUtils_1 = require("../utils/logUtils");
const modelDecorator_1 = require("../../models/modelDecorator");
const response_1 = require("../../models/response");
const product_1 = require("../../models/product");
const customer_1 = require("../../models/customer");
const order_detail_1 = require("../../models/order_detail");
const order_1 = require("../../models/order");
let router = express.Router();
let logger = new logUtils_1.logUtils("router.metadataRouter");
router.get('/getMetadata', function (req, res, next) {
    let modelName = req.query.name;
    let result = new response_1.response(false, "", null);
    if (!modelName) {
        result.message = "need mode name parameter!";
    }
    else {
        let metadata = modelDecorator_1.getMetas(modelName, getInstance(modelName));
        if (metadata) {
            result.result = true;
            result.message = `metadatas for ${modelName} is ok`;
            result.content = metadata;
            logger.logDebug(metadata);
        }
        else {
            result.message = `metadatas for ${modelName} is empty!`;
        }
    }
    res.json(result);
});
function getInstance(modelName) {
    switch (modelName.toLocaleLowerCase()) {
        case "product": return new product_1.product();
        case "customer": return new customer_1.customer();
        case "order": return new order_1.order();
        case "order_detail": return new order_detail_1.order_detail();
        default: return null;
    }
}
module.exports = router;
//# sourceMappingURL=metadataRouter.js.map