import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChargeCarHistoryRoutingModule } from './charge-car-history-routing.module';
import { ChargeCarHistoryComponent } from './charge-car-history.component';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import {
  ButtonModule,
  ConfirmDialogModule,
  DialogModule,
  MessageModule,
  MessagesModule,
  ScrollPanelModule
} from 'primeng/primeng';
import {PagingModule} from '../../../common/components/paging/paging.module';
import {BasicTableModule} from '../../../common/components/basic-table/basic-table.module';
import {BasicDialogModule} from '../../../common/components/basic-dialog/basic-dialog.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [ChargeCarHistoryComponent],
  imports: [
    CommonModule,
    ChargeCarHistoryRoutingModule,
    InputTextModule,
    FormsModule,
    TableModule,
    ScrollPanelModule,
    DialogModule,
    ButtonModule,
    MessageModule,
    MessagesModule,
    ConfirmDialogModule,
    PagingModule,
    BasicTableModule,
    BasicDialogModule,
  ]
})
export class ChargeCarHistoryModule { }
