import {propertyExt} from "./modelDecorator";
import "reflect-metadata";
/**
 * Created by 谭宏志 on 2016/12/14.
 */
export class customer{
    @propertyExt({field:"c_id", isPK:true, label:"主键"})
    cId:number;
    @propertyExt({field:"c_name", validations:{require : true}, label:"客户名称"})
    cName:string;
    @propertyExt({field:"c_phone_no", validations:{regex:/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/}, label:"联系电话"})
    cPhoneNo:string;
    @propertyExt({field:"c_email", validations:{regex: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/}, label:"电子邮件"})
    cEmail:string;
    @propertyExt({field:"c_address", label:"地址"})
    cAddress:string;
    @propertyExt({field:"c_status",validations:{require : true},  label:"状态"})
    cStatus:string;
    @propertyExt({field:"c_no",validations:{require : true},  label:"注册名"})
    cNo:string;
    @propertyExt({field:"c_pwd",validations:{require : true},  label:"登录密码"})
    cPwd:string;
}