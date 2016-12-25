"use strict";
const chai = require("chai");
const decorator = require("../../models/modelDecorator");
const customer_1 = require("../../models/customer");
const superTest = require("supertest");
let expect = chai.expect;
describe("测试自定义装饰器", function () {
    it("装饰器读取属性集合", () => {
        let metadatas = decorator.getMetas("customer", customer_1.customer.prototype);
        console.log(JSON.stringify(metadatas));
        expect(metadatas).to.contain({ "name": "cNo",
            "metadatas": { "field": "c_no", "isPK": true,
                "validations": { "require": true }, "label": "主键", "type": "Number" } });
    });
});
describe("测试baseDao的方法", () => {
    let app = require("../../app");
    let request = superTest(app);
    it("读取主页信息", (done) => {
        request.
            get("/").
            end((err, res) => {
            console.log(res.text);
            expect(res.text).to.contain("test");
            done();
        });
    });
    it("查询客户数据", (done) => {
        request.post("/customer/getCustomers").
            send({
            pIndex: 1,
            pSize: 2
        }).
            end((err, res) => {
            console.log(res);
        });
        done();
    });
});
//# sourceMappingURL=repoTest.js.map