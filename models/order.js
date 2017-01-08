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
class order {
}
__decorate([
    modelDecorator_1.propertyExt({ field: "o_id", isPK: true, label: "主键" }),
    __metadata("design:type", Number)
], order.prototype, "oId", void 0);
__decorate([
    modelDecorator_1.propertyExt({ field: "o_customer", validations: { require: true }, label: "客户" }),
    __metadata("design:type", Number)
], order.prototype, "oCustomer", void 0);
__decorate([
    modelDecorator_1.propertyExt({ field: "o_total", validations: { require: true }, label: "总价" }),
    __metadata("design:type", Number)
], order.prototype, "oTotal", void 0);
__decorate([
    modelDecorator_1.propertyExt({ field: "o_time", validations: { require: true }, label: "下单时间" }),
    __metadata("design:type", Date)
], order.prototype, "oTime", void 0);
__decorate([
    modelDecorator_1.propertyExt({ field: "o_desc", label: "备注" }),
    __metadata("design:type", String)
], order.prototype, "oDesc", void 0);
__decorate([
    modelDecorator_1.propertyExt({ field: "o_status", validations: { require: true }, label: "状态" }),
    __metadata("design:type", String)
], order.prototype, "oStatus", void 0);
exports.order = order;
//# sourceMappingURL=order.js.map