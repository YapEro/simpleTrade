/**
 * Created by Sean on 2017/1/28.
 */
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {product} from "../../models/product";
import {Http,Response} from "@angular/http";
import {response} from "../../models/response";

@Injectable()
export class ProductService{
    constructor(private http:Http){ }
    getProducts():Observable<response>{
        return this.http.post("/customer/getCustomers", {}).map((res:Response)=>{return res.json()});
    }
}