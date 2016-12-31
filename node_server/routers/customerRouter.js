"use strict";
const express = require("express");
const customerDao_1 = require("../repo/customerDao");
const customer_1 = require("../../models/customer");
const logUtils_1 = require("../utils/logUtils");
let router = express.Router();
let cusLogger = new logUtils_1.logUtils("router.customerRouter");
router.post('/getCustomers', function (req, res, next) {
    action4Customer(req, res, next, "query");
});
router.post('/saveCustomer', function (req, res, next) {
    action4Customer(req, res, next, "save");
});
function action4Customer(req, res, next, action) {
    try {
        let cusDao = new customerDao_1.customerDao(customer_1.customer);
        if (action == "save")
            cusDao.saveData(req, res);
        else if (action == "query")
            cusDao.queryList(req, res);
    }
    catch (ex) {
        cusLogger.logError(ex);
        res.json({ result: false, message: `${ex.message}` });
    }
}
module.exports = router;
//# sourceMappingURL=customerRouter.js.map