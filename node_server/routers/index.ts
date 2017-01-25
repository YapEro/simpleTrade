import {Request, Response, NextFunction} from "express";
import {logUtils} from "../utils/logUtils";
import express = require('express');
let router = express.Router();
let logger = new logUtils("routers.index");
/* GET home page. */
router.get('/', function(req:Request, res:Response, next:NextFunction) {
  logger.logDebug("homepage!")
  res.sendFile("index.html");
});
module.exports = router;
