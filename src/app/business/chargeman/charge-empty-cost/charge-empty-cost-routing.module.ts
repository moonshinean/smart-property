import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChargeEmptyCostComponent} from './charge-empty-cost.component';

const routes: Routes = [
  {path: '', component: ChargeEmptyCostComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChargeEmptyCostRoutingModule { }
