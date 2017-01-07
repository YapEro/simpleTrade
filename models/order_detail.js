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
class order_detail {
}
__decorate([
    modelDecorator_1.propertyExt({ field: "od_id", isPK: true, label: "主键" }),
    __metadata("design:type", Number)
], order_detail.prototype, "odId", void 0);
__decorate([
    modelDecorator_1.propertyExt({ field: "od_order", validations: { require: true }, label: "订单" }),
    __metadata("design:type", Number)
], order_detail.prototype, "odOrder", void 0);
__decorate([
    modelDecorator_1.propertyExt({ field: "od_product", validations: { require: true }, label: "产品" }),
    __metadata("design:type", Number)
], order_detail.prototype, "odProduct", void 0);
__decorate([
    modelDecorator_1.propertyExt({ field: "od_price", validations: { require: true }, label: "单价" }),
    __metadata("design:type", Number)
], order_detail.prototype, "odPrice", void 0);
__decorate([
    modelDecorator_1.propertyExt({ field: "od_amount", validations: { require: true }, label: "数量" }),
    __metadata("design:type", Number)
], order_detail.prototype, "odAmount", void 0);
__decorate([
    modelDecorator_1.propertyExt({ field: "od_summary", validations: { require: true }, label: "总价" }),
    __metadata("design:type", Number)
], order_detail.prototype, "odSummary", void 0);
exports.order_detail = order_detail;
//# sourceMappingURL=order_detail.js.map