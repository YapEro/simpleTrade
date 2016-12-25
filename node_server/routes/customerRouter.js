"use strict";
const express = require("express");
const customerDao_1 = require("../repo/customerDao");
const customer_1 = require("../../models/customer");
let router = express.Router();
router.post('/getCustomers', function (req, res, next) {
    let cusDao = new customerDao_1.customerDao(customer_1.customer);
    cusDao.queryList(req, res);
});
module.exports = router;
//# sourceMappingURL=customerRouter.js.map