import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RefundAlreadyComponent} from './refund-already.component';

const routes: Routes = [
  {path: '', component: RefundAlreadyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefundAlreadyRoutingModule { }
