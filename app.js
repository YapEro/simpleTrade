"use strict";
//import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
//import { AppModule }              from './ng_client/app.module';
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const log4js = require("log4js");
let index = require('./node_server/routers/index');
let cusRouter = require('./node_server/routers/customerRouter');
let app = express();
let logger = log4js.getLogger("console");
let viewPath = path.join(__dirname, "ng_client");
app.use(express.static(viewPath));
app.use(log4js.connectLogger(logger, { level: log4js.levels.ALL }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', index);
app.use('/customer', cusRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.send('error:' + err.message);
});
app.listen(3000);
//platformBrowserDynamic().bootstrapModule(AppModule);
module.exports = app;
//# sourceMappingURL=app.js.map