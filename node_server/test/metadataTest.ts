/**
 * Created by Sean on 2017/1/28.
 */
import * as chai from "chai";
import * as superTest from "supertest";
let expect = chai.expect;
describe("测试元数码处理类", function(){
    let app = require("../../app");
    let request = superTest(app);
    it("元数据读取",(done)=>{
        let queryUrl = "/metadatas/getMetadata?name=product";
        it("查询当前对象的元数据", (done)=>{
            request.get(queryUrl).
            end((err:Error, result:any)=>{
                console.log(result.text);
                expect(result.text).to.contain("{\"result\":true");
                done();
            });
        });
    });
});