import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChargeParkspaceRoutingModule } from './charge-parkspace-routing.module';
import {ChargeParkspaceComponent} from './charge-parkspace.component';
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
    ChargeParkspaceComponent
  ],
  imports: [
    CommonModule,
    ChargeParkspaceRoutingModule,
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
    LoadingModule,
    BasicTableModule,
    BasicDialogModule,
    InputSwitchModule
  ]
})
export class ChargeParkspaceModule { }
