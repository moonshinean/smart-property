import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChargeScrappedBillRoutingModule } from './charge-scrapped-bill-routing.module';
import { ChargeScrappedBillComponent } from './charge-scrapped-bill.component';
import {ChargeDetailsRoutingModule} from '../charge-details/charge-details-routing.module';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import {
  ButtonModule, CalendarModule,
  ConfirmDialogModule,
  DialogModule, DropdownModule,
  MessageModule,
  MessagesModule,
  RadioButtonModule,
  ScrollPanelModule, TreeModule
} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';
import {PagingModule} from '../../../common/components/paging/paging.module';
import {BasicTableModule} from '../../../common/components/basic-table/basic-table.module';
import {BasicDialogModule} from '../../../common/components/basic-dialog/basic-dialog.module';

@NgModule({
  declarations: [ChargeScrappedBillComponent],
  imports: [
    CommonModule,
    ChargeScrappedBillRoutingModule,
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
export class ChargeScrappedBillModule { }
