import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChargePayParkspaceRoutingModule } from './charge-pay-parkspace-routing.module';
import {ChargemanRoutingModule} from '../chargeman-routing.module';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import {
  ButtonModule, CalendarModule, CheckboxModule,
  ConfirmDialogModule,
  DialogModule, DropdownModule, InputSwitchModule, InputTextareaModule,
  MessageModule,
  MessagesModule,
  RadioButtonModule,
  ScrollPanelModule, SpinnerModule, TreeModule
} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';
import {PagingModule} from '../../../common/components/paging/paging.module';
import {BasicTableModule} from '../../../common/components/basic-table/basic-table.module';
import {BasicDialogModule} from '../../../common/components/basic-dialog/basic-dialog.module';
import {ChargePayParkspaceComponent} from './charge-pay-parkspace.component';

@NgModule({
  declarations: [
    ChargePayParkspaceComponent
  ],
  imports: [
    CommonModule,
    ChargePayParkspaceRoutingModule,
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
    TreeModule,
  ]
})
export class ChargePayParkspaceModule { }
