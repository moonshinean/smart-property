import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import { ChargemanRoutingModule } from './chargeman-routing.module';
import { ChargemanComponent } from './chargeman/chargeman.component';
import { ChargeDetailsComponent } from './charge-details/charge-details.component';
import { ChargeRecordComponent } from './charge-record/charge-record.component';
import { ChargeExportComponent } from './charge-export/charge-export.component';
import { ChargeMarginComponent } from './charge-margin/charge-margin.component';
import { ChargemanPaymentComponent } from './chargeman-payment/chargeman-payment.component';
import {
  ButtonModule, CalendarModule, CheckboxModule, ConfirmationService,
  ConfirmDialogModule,
  DialogModule, DropdownModule, InputTextareaModule,
  InputTextModule, KeyFilterModule,
  MessageModule, MessageService,
  MessagesModule, RadioButtonModule,
  ScrollPanelModule, SpinnerModule
} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {FormsModule} from '@angular/forms';
import { ChargeArrearsComponent } from './charge-arrears/charge-arrears.component';
import { ChargePrepaymentComponent } from './charge-prepayment/charge-prepayment.component';
import { ChargeHistoricalreportComponent } from './charge-historicalreport/charge-historicalreport.component';
import {PagingModule} from '../../common/components/paging/paging.module';
import { ChargeCouponComponent } from './charge-coupon/charge-coupon.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {LoadingModule} from '../../common/components/loading/loading.module';
import { ChargeParkspaceComponent } from './charge-parkspace/charge-parkspace.component';

@NgModule({
  declarations: [
    ChargemanComponent,
    ChargeDetailsComponent,
    ChargeRecordComponent,
    ChargeExportComponent,
    ChargeMarginComponent,
    ChargemanPaymentComponent,
    ChargeArrearsComponent,
    ChargePrepaymentComponent,
    ChargeHistoricalreportComponent,
    ChargeCouponComponent,
    ChargeParkspaceComponent
  ],
  imports: [
    CommonModule,
    ChargemanRoutingModule,
    InputTextModule,
    TableModule,
    ScrollPanelModule,
    DialogModule,
    ButtonModule,
    MessageModule,
    MessagesModule,
    ConfirmDialogModule,
    RadioButtonModule,
    CheckboxModule,
    SpinnerModule,
    FormsModule,
    DropdownModule,
    CalendarModule,
    PagingModule,
    InputTextareaModule,
    LoadingModule
  ],
  providers: [MessageService, ConfirmationService, DatePipe]
})
export class ChargemanModule { }
