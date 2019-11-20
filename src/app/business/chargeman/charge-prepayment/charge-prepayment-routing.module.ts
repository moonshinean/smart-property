import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChargePrepaymentComponent} from './charge-prepayment.component';

const routes: Routes = [
  {path: '', component: ChargePrepaymentComponent}
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChargePrepaymentRoutingModule { }
