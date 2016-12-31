import {Request, Response, NextFunction} from "express";
import express = require('express');
import {customerDao} from "../repo/customerDao";
import {customer} from "../../models/customer";
import {logUtils} from "../utils/logUtils";
let router = express.Router();
let cusLogger = new logUtils("router.customerRouter");
router.post('/getCustomers', function(req:Request, res:Response, next:NextFunction) {
  try{
    cusLogger.logDebug("Accept request...");
    let cusDao = new customerDao(customer);
    cusDao.queryList(req, res);
  } catch (ex){
    cusLogger.logError(ex);
  }
});

module.exports = router;