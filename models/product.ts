import {propertyExt} from "./modelDecorator";

export class product{
    @propertyExt({field:"p_no", isPK:true, label:"主键"})
    pNo:number;
    @propertyExt({field:"p_name", validations:{require : true}, label:"产品名称"})
    pName:string;
    @propertyExt({field:"p_amount", validations:{require : true}, label:"数量"})
    pAmount:number;
    @propertyExt({field:"p_desc", label:"描述"})
    pDesc:string;
    @propertyExt({field:"p_img", label:"图片"})
    pImg:string;
    @propertyExt({field:"p_default_price", label:"默认价格"})
    pDefaultPrice:number;
    @propertyExt({field:"p_default_price",validations:{require : true},  label:"状态"})
    pStatus:string;
}