import * as chai from 'chai';
import * as decorator from "../../models/modelDecorator";
import {customer} from "../../models/customer";
import * as superTest from "supertest";

let expect = chai.expect;
describe("测试自定义装饰器", function(){
    it("装饰器读取属性集合",(done)=>{
        let metadatas = decorator.getMetas("customer", customer.prototype);
        console.log(JSON.stringify(metadatas));
        expect(metadatas).to.contain({"name":"cNo",
            "metadatas":{"field":"c_no","isPK":true,
                "validations":{"require":true},"label":"主键","type":"Number"}});
        done();
    });
});

describe("测试baseDao的方法",()=>{
    let app = require("../../app");
    let request = superTest(app);
    describe("查询所有客户数据",()=>{
        let queryUrl = "/customer/getCustomers";
        it("查询所有客户数据", (done)=>{
            request.post(queryUrl).
            end((err:Error, result:any)=>{
                console.log(result.text);
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
                done();
            });
        });
    });
    describe("保存客户数据",()=>{
        let saveUrl = "/customer/saveCustomer";
        it("新增客户数据", (done)=>{
            request.post(saveUrl).
            send({
                cNo:null,
                cName:`username${Math.random()*1000}`,
                cPhoneNo:"123131224",
                cEmail:"email@163.com",
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
                cNo:1,
                cName:`username${Math.random()*1000}`,
                cPhoneNo:"123131224",
                cEmail:"email@163.com",
                cAddress:"changsha hunan"
            }).
            end((err:Error, result:any)=>{
                console.log(result.text);
                done();
            });
        });
    });
});