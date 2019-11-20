import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChargeHistoricalreportComponent} from './charge-historicalreport.component';

const routes: Routes = [
  {path: '', component: ChargeHistoricalreportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChargeHistoricalreportRoutingModule { }
