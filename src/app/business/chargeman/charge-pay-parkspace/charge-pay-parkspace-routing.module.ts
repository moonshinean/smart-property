import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChargePayParkspaceComponent} from './charge-pay-parkspace.component';

const routes: Routes = [
  {path: '', component: ChargePayParkspaceComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChargePayParkspaceRoutingModule { }
