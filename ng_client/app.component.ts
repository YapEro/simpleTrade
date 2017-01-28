import { Component } from '@angular/core';
import {ProductService} from "./product/product.service";
import {product} from "../models/product";
import {response} from "../models/response";

@Component({
    selector: 'my-app',
    styleUrls: [
        '../node_modules/@progress/kendo-theme-default/dist/all.css'
    ],
    templateUrl: './product/productList.html'
})
export class AppComponent {
    constructor(private productSrv:ProductService){ }
    sampleData : product[];
    errMsg : string;
    public ngOnInit(): void {
        this.productSrv.getProducts().subscribe((data:response)=>{
            if(data.result)
                this.sampleData = <Array<product>>data.content;
            else
                this.errMsg = data.message;
        });
    }
}