import * as chai from 'chai';
import * as decorator from "../../models/modelDecorator";
import {customer} from "../../models/customer";
import * as superTest from "supertest";

let expect = chai.expect;
describe("测试自定义装饰器", function(){
    it("装饰器读取属性集合",()=>{
        let metadatas = decorator.getMetas("customer", customer.prototype);
        console.log(JSON.stringify(metadatas));
        expect(metadatas).to.contain({"name":"cNo",
            "metadatas":{"field":"c_no","isPK":true,
                "validations":{"require":true},"label":"主键","type":"Number"}});
    });
});

describe("测试baseDao的方法",()=>{
    let app = require("../../app");
    let request = superTest(app);
    it("读取主页信息", (done)=>{
        request.
        get("/").
        end((err:Error, res:any)=>{
            console.log(res.text);
            expect(res.text).to.contain("test");
            done();
        });
    });
    it("查询客户数据", (done)=>{
        request.post("/customer/getCustomers").
        send({
            pIndex:1,
            pSize:2
        }).
        end((err:Error, res:any)=>{
            console.log(res);
        });
        done();
    });
});