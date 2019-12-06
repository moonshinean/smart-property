import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BfVacantRoomRoutingModule } from './bf-vacant-room-routing.module';
import {BfVacantRoomComponent} from './bf-vacant-room.component';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import {
  ButtonModule, CalendarModule,
  ConfirmDialogModule,
  DialogModule, DropdownModule, FileUploadModule, KeyFilterModule,
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

@NgModule({
  declarations: [
    BfVacantRoomComponent
  ],
  imports: [
    CommonModule,
    BfVacantRoomRoutingModule,
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
    KeyFilterModule
  ]
})
export class BfVacantRoomModule { }
