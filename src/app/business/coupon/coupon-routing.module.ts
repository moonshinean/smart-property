import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SystemsetComponent} from '../systemset/systemset/systemset.component';
import {SetCarkindComponent} from '../systemset/set-carkind/set-carkind.component';
import {SetCarbrandComponent} from '../systemset/set-carbrand/set-carbrand.component';
import {SetNationComponent} from '../systemset/set-nation/set-nation.component';
import {SetConfigComponent} from '../systemset/set-config/set-config.component';
import {SetPermissionComponent} from '../systemset/set-permission/set-permission.component';
import {SetRoleComponent} from '../systemset/set-role/set-role.component';
import {SetPartComponent} from '../systemset/set-part/set-part.component';
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
