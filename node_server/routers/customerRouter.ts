import {Request, Response, NextFunction} from "express";
import express = require('express');
import {customerDao} from "../repo/customerDao";
import {customer} from "../../models/customer";
import {logUtils} from "../utils/logUtils";
let router = express.Router();
let cusLogger = new logUtils("router.customerRouter");
router.post('/getCustomers', function(req:Request, res:Response, next:NextFunction) {
  action4Customer(req, res, next, "query");
});
router.post('/saveCustomer', function(req:Request, res:Response, next:NextFunction) {
  action4Customer(req, res, next, "save");
});
function action4Customer(req:Request, res:Response, next:NextFunction, action:string){
  try{
    let cusDao = new customerDao(customer);
    if(action == "save")
      cusDao.saveData(req, res);
    else if(action == "query")
      cusDao.queryList(req, res);
  } catch (ex){
    cusLogger.logError(ex);
    res.json({result:false, message:`${ex.message}`});
  }
}
module.exports = router;