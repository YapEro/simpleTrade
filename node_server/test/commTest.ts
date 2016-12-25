import * as chai from 'chai';

let expect = chai.expect;
describe("常规测试内容", function(){
    it("常规测试", function(){
        expect([123,1234,12434]).to.contains(123);
        let data = [{a:"a1", b:"b1"}, {a:"a2", b:"b2"}, {a:"a3", b:"b3"}];
        data.forEach(({a, b}) => {
            console.log(`a:${a} - b:${b}`);
        });
        let tIndex = 3;
        let prefix = "prefix,";
        prefix += `next${tIndex}`;
        console.log(prefix);
        let data2 = {a:"a1", b:"b1", c:"c1"};
        for(let i in data2){
            console.log(i);
        }
    });
});
