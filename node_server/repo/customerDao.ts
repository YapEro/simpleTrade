import {customer} from "../../models/customer";
import {baseDao} from "./baseDao";
import {Request, Response} from "express";
export class customerDao extends baseDao<customer>{
    public login(req:Request, res:Response){
        let uName = req.body.uname;
        let pwd = req.body.pwd;
        if(!uName || !pwd) {
            this.handlerErr(new Error("user name and password are require!"));
        }
        this.dataHandle(`select * from customer where c_id=${uName} and c_pwd='${pwd}'`,(data:any)=>{

        });
    }
}