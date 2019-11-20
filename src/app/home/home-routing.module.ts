import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
  // {path: '', redirectTo: '/home/main', pathMatch: 'full'},
  {
    path: '',
    component: HomeComponent,
    children: [
      {path: 'main', loadChildren: '../business/main/main.module#MainModule'},
      {path: 'baseinfo', loadChildren: '../business/baseinfo/baseinfo.module#BaseinfoModule' , data: {preload: true}},
      {path: 'charge', loadChildren: '../business/chargeman/chargeman.module#ChargemanModule', data: {preload: true}},
      {path: 'system', loadChildren: '../business/systemset/systemset.module#SystemsetModule'},
      {path: 'coupon', loadChildren: '../business/coupon/coupon.module#CouponModule'},
      {path: 'refund', loadChildren: '../business/refund/refund.module#RefundModule'},
      {path: 'latepayment', loadChildren: '../business/latepayment/latepayment.module#LatepaymentModule'},
     ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
