import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import { ChargemanRoutingModule } from './chargeman-routing.module';
import { ChargemanComponent } from './chargeman/chargeman.component';
import { ChargemanPaymentComponent } from './chargeman-payment/chargeman-payment.component';
import {
  ButtonModule, CalendarModule, CheckboxModule, ConfirmationService,
  ConfirmDialogModule,
  DialogModule, DropdownModule, InputSwitchModule, InputTextareaModule,
  InputTextModule,
  MessageModule, MessageService,
  MessagesModule, RadioButtonModule,
  ScrollPanelModule, SpinnerModule, TreeModule
} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {FormsModule} from '@angular/forms';
import {PagingModule} from '../../common/components/paging/paging.module';
import {LoadingModule} from '../../common/components/loading/loading.module';
import {PublicMethedService} from '../../common/public/public-methed.service';
import {BasicTableModule} from '../../common/components/basic-table/basic-table.module';
import {BasicDialogModule} from '../../common/components/basic-dialog/basic-dialog.module';

@NgModule({
  declarations: [
    ChargemanComponent,
    ChargemanPaymentComponent,
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
    BasicTableModule,
    BasicDialogModule,
    InputSwitchModule,
    TreeModule
  ],
  providers: [MessageService, ConfirmationService, DatePipe, PublicMethedService]
})
export class ChargemanModule { }
