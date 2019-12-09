import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RefundApplicationInfoComponent} from './refund-application-info.component';

const routes: Routes = [
  {path: '', component: RefundApplicationInfoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefundApplicationInfoRoutingModule { }
