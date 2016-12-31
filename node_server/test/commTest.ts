import * as chai from 'chai';

let expect = chai.expect;
describe("常规测试内容", function(){
    it("常规测试", function(){
        let regex = new RegExp(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/);
        let r1 = regex.test("test.awe");
        let r2 = regex.test("testuser@163.com");
        var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
        expect(reg.test("testuser@163.com")).to.eq(true);
        expect(r1).to.eq(false);
        expect(r2).to.eq(true);
    });
});
