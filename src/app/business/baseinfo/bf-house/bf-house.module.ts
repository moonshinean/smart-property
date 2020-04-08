import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BfHouseRoutingModule } from './bf-house-routing.module';
import {BfHouseComponent} from './bf-house.component';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import {
  ButtonModule, CalendarModule,
  ConfirmDialogModule,
  DialogModule, DropdownModule, FileUploadModule,
  MessageModule,
  MessagesModule,
  RadioButtonModule,
  ScrollPanelModule, TreeModule
} from 'primeng/primeng';
import {DataViewModule} from 'primeng/dataview';
import {PagingModule} from '../../../common/components/paging/paging.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoadingModule} from '../../../common/components/loading/loading.module';
import {BasicTableModule} from '../../../common/components/basic-table/basic-table.module';
import {BasicDialogModule} from '../../../common/components/basic-dialog/basic-dialog.module';
import {EchartsPieModule} from '../../../common/components/echarts-pie/echarts-pie.module';

@NgModule({
  declarations: [
    BfHouseComponent
  ],
  imports: [
    CommonModule,
    BfHouseRoutingModule,
    InputTextModule,
    TableModule,
    ScrollPanelModule,
    DialogModule,
    ButtonModule,
    MessageModule,
    MessagesModule,
    ConfirmDialogModule,
    RadioButtonModule,
    DataViewModule,
    PagingModule,
    FormsModule,
    DropdownModule,
    FileUploadModule,
    CalendarModule,
    LoadingModule,
    TreeModule,
    ReactiveFormsModule,
    BasicTableModule,
    BasicDialogModule,
    EchartsPieModule
  ]
})
export class BfHouseModule { }
