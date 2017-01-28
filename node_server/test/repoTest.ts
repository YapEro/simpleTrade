import * as chai from "chai";
import * as decorator from "../../models/modelDecorator";
import {customer} from "../../models/customer";
import * as superTest from "supertest";

let expect = chai.expect;
describe("测试自定义装饰器", function(){
    it("装饰器读取属性集合",(done)=>{
        let metadatas = decorator.getMetas("customer", customer.prototype);
        console.log(JSON.stringify(metadatas));
        expect(metadatas).to.contain({"name":"cId",
            "metadatas":{"field":"c_id","isPK":true,"label":"主键","type":"Number"}});
        done();
    });
});

describe("测试baseDao的方法(使用customer数据)",()=>{
    let app = require("../../app");
    let request = superTest(app);
    describe("查询所有客户数据",()=>{
        let queryUrl = "/customer/getCustomers";
        it("查询所有客户数据", (done)=>{
            request.post(queryUrl).
            end((err:Error, result:any)=>{
                console.log(result.text);
                expect(result.text).to.contain("{\"result\":true");
                done();
            });
        });
        it("查询分页客户数据", (done)=>{
            request.post(queryUrl).
            send({
                pagination:{
                    pIndex:1,
                    pSize:2
                }
            }).
            end((err:Error, result:any)=>{
                console.log(result.text);
                expect(result.text).to.contain("{\"result\":true");
                done();
            });
        });
        it("查询过滤分页客户数据", (done)=>{
            request.post(queryUrl).
            send({
                pagination:{
                    pIndex:1,
                    pSize:3
                },
                criteria:[{property:"cNo", operator:">", value:2}],
                order:[{property:"cNo", direction:"desc"}]
            }).
            end((err:Error, result:any)=>{
                console.log(result.text);
                expect(result.text).to.contain("{\"result\":true");
                done();
            });
        });
        it("根据主键查询客户数据", (done)=>{
            request.get("/customer/getCustomer?key=1").
            end((err:Error, result:any)=>{
                console.log(result.text);
                expect(result.text).to.contain("{\"result\":true");
                done();
            });
        });
    });
    describe("写客户数据",()=>{
        let saveUrl = "/customer/saveCustomer";
        it("新增客户数据", (done)=>{
            request.post(saveUrl).
            send({
                cId:null,
                cName:`username${Math.random()*1000}`,
                cPhoneNo:"18511222211",
                cEmail:"email@163.com",
                cNo:"userId",
                cPwd:"wewewefwe",
                cAddress:"changsha hunan"
            }).
            end((err:Error, result:any)=>{
                console.log(result.text);
                done();
            });
        });
        it("更新客户数据", (done)=>{
            request.post(saveUrl).
            send({
                cId:1,
                cName:`username${Math.random()*1000}`,
                cPhoneNo:"18511222211",
                cEmail:"email@163.com",
                cNo:"userId",
                cPwd:"wewewefwe",
                cAddress:"changsha hunan",
                cStatus:"enable"
            }).
            end((err:Error, result:any)=>{
                console.log(result.text);
                done();
            });
        });
        it("更新客户数据验证测试", (done)=>{
            request.post(saveUrl).
            send({
                cId:1,
                cName: '',   //不符合规范的名称（必输）
                cPhoneNo:"18511222211",
                cEmail:"awef",   //不符合规范的邮件地址
                cAddress:"changsha hunan",
                cNo:"userId",
                cPwd:"wewewefwe",
                cStatus:"enable"
            }).
            end((err:Error, result:any)=>{
                console.log(result.text);
                expect(result.text).to.contain("{\"result\":false");
                done();
            });
        });
        it("删除单一客户数据验证测试",(done)=>{
            request.post("/customer/deleteCustomer").
            send({keys:2}).
            end((err:Error, result:any)=>{
                console.log(result.text);
                expect(result.text).to.contain("{\"result\":true");
                done();
            });
        });
        it("删除多条客户数据验证测试",(done)=>{
            request.post("/customer/deleteCustomer").
            send({keys:[2,3,4,5]}).
            end((err:Error, result:any)=>{
                console.log(result.text);
                expect(result.text).to.contain("{\"result\":true");
                done();
            });
        });
    });
});