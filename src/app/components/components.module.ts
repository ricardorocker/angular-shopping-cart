import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { CartItemControlComponent } from "./cart-item/cart-item-control.component";
import { CartWidgetComponent } from "./cart-widget/cart-widget.component";
import { ProductsListComponent } from "./product-list/products-list.component";
import { CoreModule } from "../core/core.module";
import { NavbarComponent } from "./navbar/navbar.component";

@NgModule({
  declarations: [
    ProductsListComponent,
    CartWidgetComponent,
    CartItemControlComponent,
    NavbarComponent,
  ],
  imports: [BrowserModule, CoreModule],
  exports: [
    ProductsListComponent,
    CartWidgetComponent,
    CartItemControlComponent,
    NavbarComponent
  ]
})
export class ComponentsModule {}
