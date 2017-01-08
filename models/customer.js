"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const modelDecorator_1 = require("./modelDecorator");
require("reflect-metadata");
/**
 * Created by 谭宏志 on 2016/12/14.
 */
class customer {
}
__decorate([
    modelDecorator_1.propertyExt({ field: "c_id", isPK: true, label: "主键" }),
    __metadata("design:type", Number)
], customer.prototype, "cId", void 0);
__decorate([
    modelDecorator_1.propertyExt({ field: "c_name", validations: { require: true }, label: "客户名称" }),
    __metadata("design:type", String)
], customer.prototype, "cName", void 0);
__decorate([
    modelDecorator_1.propertyExt({ field: "c_phone_no", validations: { regex: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/ }, label: "联系电话" }),
    __metadata("design:type", String)
], customer.prototype, "cPhoneNo", void 0);
__decorate([
    modelDecorator_1.propertyExt({ field: "c_email", validations: { regex: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/ }, label: "电子邮件" }),
    __metadata("design:type", String)
], customer.prototype, "cEmail", void 0);
__decorate([
    modelDecorator_1.propertyExt({ field: "c_address", label: "地址" }),
    __metadata("design:type", String)
], customer.prototype, "cAddress", void 0);
__decorate([
    modelDecorator_1.propertyExt({ field: "c_status", validations: { require: true }, label: "状态" }),
    __metadata("design:type", String)
], customer.prototype, "cStatus", void 0);
__decorate([
    modelDecorator_1.propertyExt({ field: "c_no", validations: { require: true }, label: "注册名" }),
    __metadata("design:type", String)
], customer.prototype, "cNo", void 0);
__decorate([
    modelDecorator_1.propertyExt({ field: "c_pwd", validations: { require: true }, label: "登录密码" }),
    __metadata("design:type", String)
], customer.prototype, "cPwd", void 0);
exports.customer = customer;
//# sourceMappingURL=customer.js.map