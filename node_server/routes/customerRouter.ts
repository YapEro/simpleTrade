import {Request, Response, NextFunction} from "express";
import express = require('express');
import {customerDao} from "../repo/customerDao";
import {customer} from "../../models/customer";
let router = express.Router();

router.post('/getCustomers', function(req:Request, res:Response, next:NextFunction) {
  let cusDao = new customerDao(customer);
  cusDao.queryList(req, res);
});

module.exports = router;