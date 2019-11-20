import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChargeExportRoutingModule } from './charge-export-routing.module';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import {
  ButtonModule, CalendarModule, CheckboxModule,
  ConfirmDialogModule,
  DialogModule, DropdownModule, InputTextareaModule,
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
import {ChargeExportComponent} from './charge-export.component';

@NgModule({
  declarations: [
    ChargeExportComponent
  ],
  imports: [
    CommonModule,
    ChargeExportRoutingModule,
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
export class ChargeExportModule { }
