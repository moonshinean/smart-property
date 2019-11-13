import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BfCouponComponent} from './bf-coupon.component';

const routes: Routes = [
  {
    path: '',
    component: BfCouponComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BfCouponRoutingModule { }
