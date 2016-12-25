import {propertyExt} from "./modelDecorator";
import "reflect-metadata";
/**
 * Created by 谭宏志 on 2016/12/14.
 */
export class customer{
    @propertyExt({field:"c_no", isPK:true, validations:{require : true}, label:"主键"})
    cNo:number;
    @propertyExt({field:"c_name", validations:{require : true}, label:"客户名称"})
    cName:string;
    @propertyExt({field:"c_phone_no", validations:{regex:"(^(\d{3,4}-)?\d{7,8})$|(13[0-9]{9})"}, label:"联系电话"})
    cPhoneNo:string;
    @propertyExt({field:"c_email", validations:{regex: "\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*"}, label:"电子邮件"})
    cEmail:string;
    @propertyExt({field:"c_no", validations:{require : true}, label:"主键"})
    cAddress:string;
}