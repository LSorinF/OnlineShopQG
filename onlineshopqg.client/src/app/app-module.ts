import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app';
import { AppRoutingModule } from './app-routing-module';
import { CheckoutComponent } from './components/checkout/checkout';
import { FormsModule } from '@angular/forms';
import { ProductListComponent } from './components/product-list/product-list';
import { ProductDetailComponent } from './components/product-detail/product-detail';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    AppComponent,
    FormsModule,
    CheckoutComponent,
    ProductListComponent,
    ProductDetailComponent
    
  ],
  providers: [],
  bootstrap: [],
  declarations: [
  ] 
})
export class AppModule { }
