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
class product {
}
__decorate([
    modelDecorator_1.propertyExt({ field: "p_no", isPK: true, label: "主键" }),
    __metadata("design:type", Number)
], product.prototype, "pNo", void 0);
__decorate([
    modelDecorator_1.propertyExt({ field: "p_name", validations: { require: true }, label: "产品名称" }),
    __metadata("design:type", String)
], product.prototype, "pName", void 0);
__decorate([
    modelDecorator_1.propertyExt({ field: "p_amount", validations: { require: true }, label: "数量" }),
    __metadata("design:type", Number)
], product.prototype, "pAmount", void 0);
__decorate([
    modelDecorator_1.propertyExt({ field: "p_desc", label: "描述" }),
    __metadata("design:type", String)
], product.prototype, "pDesc", void 0);
__decorate([
    modelDecorator_1.propertyExt({ field: "p_img", label: "图片" }),
    __metadata("design:type", String)
], product.prototype, "pImg", void 0);
__decorate([
    modelDecorator_1.propertyExt({ field: "p_default_price", label: "默认价格" }),
    __metadata("design:type", Number)
], product.prototype, "pDefaultPrice", void 0);
__decorate([
    modelDecorator_1.propertyExt({ field: "p_default_price", validations: { require: true }, label: "状态" }),
    __metadata("design:type", String)
], product.prototype, "pStatus", void 0);
exports.product = product;
//# sourceMappingURL=product.js.map