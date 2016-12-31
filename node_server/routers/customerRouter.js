"use strict";
const express = require("express");
const customerDao_1 = require("../repo/customerDao");
const customer_1 = require("../../models/customer");
const logUtils_1 = require("../utils/logUtils");
let router = express.Router();
let cusLogger = new logUtils_1.logUtils("router.customerRouter");
router.post('/getCustomers', function (req, res, next) {
    try {
        cusLogger.logDebug("Accept request...");
        let cusDao = new customerDao_1.customerDao(customer_1.customer);
        cusDao.queryList(req, res);
    }
    catch (ex) {
        cusLogger.logError(ex);
    }
});
module.exports = router;
//# sourceMappingURL=customerRouter.js.map