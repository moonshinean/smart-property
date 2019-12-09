import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RefundNoComponent} from './refund-no.component';

const routes: Routes = [
  {path: '', component: RefundNoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefundNoRoutingModule { }
