"use strict";
const express = require("express");
const customerDao_1 = require("../repo/customerDao");
const customer_1 = require("../../models/customer");
const logUtils_1 = require("../utils/logUtils");
const response_1 = require("../../models/response");
let router = express.Router();
let cusLogger = new logUtils_1.logUtils("router.customerRouter");
router.post('/getCustomers', function (req, res, next) {
    action4Customer(req, res, next, "querylist");
});
router.get('/getCustomer', function (req, res, next) {
    action4Customer(req, res, next, "queryentity");
});
router.post('/saveCustomer', function (req, res, next) {
    action4Customer(req, res, next, "save");
});
router.post('/deleteCustomer', function (req, res, next) {
    action4Customer(req, res, next, "delete");
});
function action4Customer(req, res, next, action) {
    try {
        let cusDao = new customerDao_1.customerDao(customer_1.customer);
        if (action == "save")
            cusDao.saveData(req, res);
        else if (action == "querylist")
            cusDao.queryList(req, res);
        else if (action == "queryentity")
            cusDao.queryEntity(req, res);
        else if (action == "delete")
            cusDao.deleteData(req, res);
    }
    catch (ex) {
        cusLogger.logError(ex);
        res.json(new response_1.response(false, `${ex.message}`));
    }
}
module.exports = router;
//# sourceMappingURL=customerRouter.js.map