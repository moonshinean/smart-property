import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChargeHistoricalreportRoutingModule } from './charge-historicalreport-routing.module';
import {ChargeHistoricalreportComponent} from './charge-historicalreport.component';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import {
  ButtonModule, CalendarModule, CheckboxModule,
  ConfirmDialogModule,
  DialogModule, DropdownModule, InputSwitchModule, InputTextareaModule,
  MessageModule,
  MessagesModule,
  RadioButtonModule,
  ScrollPanelModule, SpinnerModule
} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';
import {PagingModule} from '../../../common/components/paging/paging.module';
import {LoadingModule} from '../../../common/components/loading/loading.module';
import {BasicTableModule} from '../../../common/components/basic-table/basic-table.module';
import {BasicDialogModule} from '../../../common/components/basic-dialog/basic-dialog.module';

@NgModule({
  declarations: [
    ChargeHistoricalreportComponent
  ],
  imports: [
    CommonModule,
    ChargeHistoricalreportRoutingModule,
    TableModule,
    ScrollPanelModule,
    ButtonModule,
    MessageModule,
    MessagesModule,
    ConfirmDialogModule,
    FormsModule,
    PagingModule,
    BasicTableModule,
  ]
})
export class ChargeHistoricalreportModule { }
