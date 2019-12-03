import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChargemanComponent} from './chargeman/chargeman.component';
import {ChargemanPaymentComponent} from './chargeman-payment/chargeman-payment.component';

const routes: Routes = [
  {
    path: '',
    component: ChargemanComponent,
    children: [
      {path: 'details', loadChildren: './charge-details/charge-details.module#ChargeDetailsModule'},
      // {path: 'record', component: ChargeRecordComponent},
      {path: 'export', loadChildren: './charge-export/charge-export.module#ChargeExportModule'},
      // {path: 'margin', component: ChargeMarginComponent},
      {path: 'payment', component: ChargemanPaymentComponent,  data: {preload: true}},
      // {path: 'arrears', component: ChargeArrearsComponent},
      {path: 'prepayment', loadChildren: './charge-prepayment/charge-prepayment.module#ChargePrepaymentModule'},
      {path: 'historicalreport', loadChildren: './charge-historicalreport/charge-historicalreport.module#ChargeHistoricalreportModule'},
      // {path: 'parkspace', loadChildren: './charge-parkspace/charge-parkspace.module#ChargeParkspaceModule'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChargemanRoutingModule { }
