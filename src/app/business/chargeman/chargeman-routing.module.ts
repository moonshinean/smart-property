import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChargemanComponent} from './chargeman/chargeman.component';
import {ChargemanPaymentComponent} from './chargeman-payment/chargeman-payment.component';
import {ChargeCumulativeVacancyfeeService} from '../../common/services/charge-cumulative-vacancyfee.service';

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
      {path: 'vacancyfee', loadChildren: './charge-cumulative-vacancyfee/charge-cumulative-vacancyfee.module#ChargeCumulativeVacancyfeeModule'},
      // {path: 'arrears', component: ChargeArrearsComponent},
      {path: 'prepayment', loadChildren: './charge-prepayment/charge-prepayment.module#ChargePrepaymentModule'},
      {path: 'history', loadChildren: './charge-history/charge-history.module#ChargeHistoryModule'},
      {path: 'payparkspace', loadChildren: './charge-pay-parkspace/charge-pay-parkspace.module#ChargePayParkspaceModule'},
      {path: 'parkhistory', loadChildren: './charge-car-history/charge-car-history.module#ChargeCarHistoryModule'},
      {path: 'emptycost', loadChildren: './charge-empty-cost/charge-empty-cost.module#ChargeEmptyCostModule'},
      {path: 'scrappedbill', loadChildren: './charge-scrapped-bill/charge-scrapped-bill.module#ChargeScrappedBillModule'},
      // {path: 'parkspace', loadChildren: './charge-parkspace/charge-parkspace.module#ChargeParkspaceModule'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChargemanRoutingModule { }
