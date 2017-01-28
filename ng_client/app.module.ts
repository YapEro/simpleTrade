import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { HttpModule, JsonpModule } from '@angular/http';
import {ProductService} from "./product/product.service";

@NgModule({
    imports:      [ BrowserModule,GridModule,ButtonsModule,HttpModule,JsonpModule ],
    declarations: [ AppComponent ],
    bootstrap:    [ AppComponent ],
    providers: [ProductService]
})
export class AppModule { }