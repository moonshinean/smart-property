import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChargemanComponent} from './chargeman/chargeman.component';
import {ChargeDetailsComponent} from './charge-details/charge-details.component';
import {ChargeExportComponent} from './charge-export/charge-export.component';
import {ChargePrepaymentComponent} from './charge-prepayment/charge-prepayment.component';
import {ChargeHistoricalreportComponent} from './charge-historicalreport/charge-historicalreport.component';
import {ChargemanPaymentComponent} from './chargeman-payment/chargeman-payment.component';
import {ChargeParkspaceComponent} from './charge-parkspace/charge-parkspace.component';

const routes: Routes = [
  {
    path: '',
    component: ChargemanComponent,
    children: [
      {path: 'details', component: ChargeDetailsComponent},
      // {path: 'record', component: ChargeRecordComponent},
      {path: 'export', component: ChargeExportComponent},
      // {path: 'margin', component: ChargeMarginComponent},
      {path: 'payment', component: ChargemanPaymentComponent},
      // {path: 'arrears', component: ChargeArrearsComponent},
      {path: 'prepayment', component: ChargePrepaymentComponent},
      {path: 'historicalreport', component: ChargeHistoricalreportComponent},
      {path: 'parkspace', component: ChargeParkspaceComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChargemanRoutingModule { }
