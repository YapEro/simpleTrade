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
const core_1 = require("@angular/core");
const product_service_1 = require("./product/product.service");
let AppComponent = class AppComponent {
    constructor(productSrv) {
        this.productSrv = productSrv;
    }
    ngOnInit() {
        this.productSrv.getProducts().subscribe((data) => {
            if (data.result)
                this.sampleData = data.content;
            else
                this.errMsg = data.message;
        });
    }
};
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        styleUrls: [
            '../node_modules/@progress/kendo-theme-default/dist/all.css'
        ],
        templateUrl: './product/productList.html'
    }),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map