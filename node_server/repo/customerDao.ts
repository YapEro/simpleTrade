import {customer} from "../../models/customer";
import {baseDao} from "./baseDao";
import {Request, Response} from "express";
import {response} from "../../models/response";
import * as session from "express-session";
export class customerDao extends baseDao<customer>{
    public login(req:Request, res:Response){
        let uName = req.body.uname;
        let pwd = req.body.pwd;
        if(!uName || !pwd) {
            this.handlerErr(new Error("user name and password are require!"));
        }
        this.sqlExec(`select * from customer where c_no=${uName} and c_pwd='${pwd}'`,
            (data:any)=>{
            if(data) {
                req.session["user_no"] = data["c_no"];
                res.json(new response(true, "Successful for login!", data));
            } else {
                res.json(new response(false, `Failed for login, has no [${uName}] or password error!`));
            }
        });
    }
}