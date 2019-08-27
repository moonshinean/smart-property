import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LatepaymentComponent} from './latepayment/latepayment.component';
import {LatepaymentTotalComponent} from './latepayment-total/latepayment-total.component';
import {LatepaymentReviewComponent} from './latepayment-review/latepayment-review.component';
import {LatepaymentPendingReviewComponent} from './latepayment-pending-review/latepayment-pending-review.component';
import {LatepaymentNoPassComponent} from './latepayment-no-pass/latepayment-no-pass.component';
import {LatepaymentAuditedComponent} from './latepayment-audited/latepayment-audited.component';

const routes: Routes = [
  {
    path: '',
    component: LatepaymentComponent,
    children: [
      {path: 'latepaytotle', component: LatepaymentTotalComponent},
      {path: 'review', component: LatepaymentReviewComponent},
      {path: 'pendreview', component: LatepaymentPendingReviewComponent},
      {path: 'nopass', component: LatepaymentNoPassComponent},
      {path: 'audited', component: LatepaymentAuditedComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LatepaymentRoutingModule { }
