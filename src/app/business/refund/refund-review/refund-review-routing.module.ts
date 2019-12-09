import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RefundReviewComponent} from './refund-review.component';

const routes: Routes = [
  {path: '', component: RefundReviewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefundReviewRoutingModule { }
