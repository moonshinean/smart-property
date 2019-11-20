import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChargePrepaymentRoutingModule } from './charge-prepayment-routing.module';
import {ChargePrepaymentComponent} from './charge-prepayment.component';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import {
  ButtonModule, CalendarModule, CheckboxModule,
  ConfirmDialogModule,
  DialogModule, DropdownModule,
  MessageModule,
  MessagesModule,
  RadioButtonModule,
  ScrollPanelModule, SpinnerModule
} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';
import {PagingModule} from '../../../common/components/paging/paging.module';
import {BasicTableModule} from '../../../common/components/basic-table/basic-table.module';
import {BasicDialogModule} from '../../../common/components/basic-dialog/basic-dialog.module';

@NgModule({
  declarations: [
    ChargePrepaymentComponent
  ],
  imports: [
    CommonModule,
    ChargePrepaymentRoutingModule,
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
    BasicTableModule,
    BasicDialogModule,
  ]
})
export class ChargePrepaymentModule { }
