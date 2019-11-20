import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChargeArrearsComponent} from './charge-arrears.component';

const routes: Routes = [
  {path: '', component: ChargeArrearsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChargeArrearsRoutingModule { }
