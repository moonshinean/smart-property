import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChargeCumulativeVacancyfeeRoutingModule } from './charge-cumulative-vacancyfee-routing.module';
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
import {ChargeCumulativeVacancyfeeComponent} from './charge-cumulative-vacancyfee.component';

@NgModule({
  declarations: [
    ChargeCumulativeVacancyfeeComponent
  ],
  imports: [
    CommonModule,
    ChargeCumulativeVacancyfeeRoutingModule,
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
export class ChargeCumulativeVacancyfeeModule { }
