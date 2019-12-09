import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RefundPendReviewComponent} from './refund-pend-review.component';

const routes: Routes = [
  {path: '', component: RefundPendReviewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefundPendReviewRoutingModule { }
