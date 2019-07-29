import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {CouponTotalComponent} from './coupon-total/coupon-total.component';
import {CouponReviewComponent} from './coupon-review/coupon-review.component';
import {CouponPendingReviewComponent} from './coupon-pending-review/coupon-pending-review.component';
import {CouponAuditedComponent} from './coupon-audited/coupon-audited.component';
import {CouponComponent} from './coupon/coupon.component';
const routes: Routes = [
  {
    path: '',
    component: CouponComponent,
    children: [
      {path: 'total', component: CouponTotalComponent},
      {path: 'review', component: CouponReviewComponent},
      {path: 'pandingreview', component: CouponPendingReviewComponent},
      {path: 'audited', component: CouponAuditedComponent},
    ]
  }
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponRoutingModule { }
