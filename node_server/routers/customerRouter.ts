import {Request, Response, NextFunction} from "express";
import express = require('express');
import {customerDao} from "../repo/customerDao";
import {customer} from "../../models/customer";
import {logUtils} from "../utils/logUtils";
import {response} from "../../models/response";
let router = express.Router();
let cusLogger = new logUtils("router.customerRouter");
router.post('/getCustomers', function(req:Request, res:Response, next:NextFunction) {
  action4Customer(req, res, next, "querylist");
});
router.get('/getCustomer', function(req:Request, res:Response, next:NextFunction) {
  action4Customer(req, res, next, "queryentity");
});
router.post('/saveCustomer', function(req:Request, res:Response, next:NextFunction) {
  action4Customer(req, res, next, "save");
});
router.post('/deleteCustomer', function(req:Request, res:Response, next:NextFunction) {
  action4Customer(req, res, next, "delete");
});
function action4Customer(req:Request, res:Response, next:NextFunction, action:string){
  try{
    let cusDao = new customerDao(customer);
    if(action == "save")
      cusDao.saveData(req, res);
    else if(action == "querylist")
      cusDao.queryList(req, res);
    else if(action == "queryentity")
      cusDao.queryEntity(req, res);
    else if(action == "delete")
      cusDao.deleteData(req, res);
  } catch (ex){
    cusLogger.logError(ex);
    res.json(new response(false, `${ex.message}`));
  }
}
module.exports = router;