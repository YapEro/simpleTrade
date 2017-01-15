"use strict";
const logUtils_1 = require("../utils/logUtils");
const express = require("express");
let router = express.Router();
let logger = new logUtils_1.logUtils("routers.index");
/* GET home page. */
router.get('/', function (req, res, next) {
    logger.logDebug("homepage!");
    res.sendFile("index.html");
});
module.exports = router;
//# sourceMappingURL=index.js.map