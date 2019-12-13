import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChargeDetailsRoutingModule } from './charge-details-routing.module';
import {ChargeDetailsComponent} from './charge-details.component';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import {
  ButtonModule, CalendarModule, CheckboxModule,
  ConfirmDialogModule,
  DialogModule, DropdownModule, InputTextareaModule,
  MessageModule,
  MessagesModule,
  RadioButtonModule,
  ScrollPanelModule, SpinnerModule, TreeModule
} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';
import {PagingModule} from '../../../common/components/paging/paging.module';
import {LoadingModule} from '../../../common/components/loading/loading.module';
import {BasicTableModule} from '../../../common/components/basic-table/basic-table.module';
import {BasicDialogModule} from '../../../common/components/basic-dialog/basic-dialog.module';

@NgModule({
  declarations: [
    ChargeDetailsComponent
  ],
  imports: [
    CommonModule,
    ChargeDetailsRoutingModule,
    InputTextModule,
    TableModule,
    ScrollPanelModule,
    DialogModule,
    ButtonModule,
    MessageModule,
    MessagesModule,
    ConfirmDialogModule,
    RadioButtonModule,
    FormsModule,
    DropdownModule,
    PagingModule,
    BasicTableModule,
    BasicDialogModule,
    TreeModule,
    CalendarModule
  ]
})
export class ChargeDetailsModule { }
