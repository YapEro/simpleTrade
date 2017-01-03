import {propertyExt} from "./modelDecorator";
export class order{
    @propertyExt({field:"o_no", isPK:true, label:"主键"})
    oNo:number;
    @propertyExt({field:"o_customer", validations:{require : true}, label:"客户"})
    oCustomer:number;
    @propertyExt({field:"o_total", validations:{require : true}, label:"总价"})
    oTotal:number;
    @propertyExt({field:"o_time", validations:{require : true}, label:"下单时间"})
    oTime:Date;
    @propertyExt({field:"o_desc", label:"备注"})
    oDesc:string;
    @propertyExt({field:"o_status", validations:{require : true}, label:"状态"})
    oStatus:string;
}