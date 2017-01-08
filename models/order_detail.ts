import {propertyExt} from "./modelDecorator";
export class order_detail{
    @propertyExt({field:"od_id", isPK:true, label:"主键"})
    odId:number;
    @propertyExt({field:"od_order", validations:{require : true}, label:"订单"})
    odOrder:number;
    @propertyExt({field:"od_product", validations:{require : true}, label:"产品"})
    odProduct:number;
    @propertyExt({field:"od_price", validations:{require : true}, label:"单价"})
    odPrice:number;
    @propertyExt({field:"od_amount", validations:{require : true}, label:"数量"})
    odAmount:number;
    @propertyExt({field:"od_summary", validations:{require : true}, label:"总价"})
    odSummary:number;
}