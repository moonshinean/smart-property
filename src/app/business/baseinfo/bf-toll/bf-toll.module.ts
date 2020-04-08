import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BfTollRoutingModule } from './bf-toll-routing.module';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import {
  ButtonModule, CalendarModule,
  ConfirmDialogModule,
  DialogModule, DropdownModule, FileUploadModule, InputTextareaModule,
  MessageModule,
  MessagesModule,
  RadioButtonModule,
  ScrollPanelModule, TabMenuModule, TreeModule
} from 'primeng/primeng';
import {DataViewModule} from 'primeng/dataview';
import {PagingModule} from '../../../common/components/paging/paging.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoadingModule} from '../../../common/components/loading/loading.module';
import {BasicTableModule} from '../../../common/components/basic-table/basic-table.module';
import {BasicDialogModule} from '../../../common/components/basic-dialog/basic-dialog.module';
import {BfTollComponent} from './bf-toll.component';
import { BfTollInfoComponent } from './bf-toll-info/bf-toll-info.component';
import { BfTollReviewComponent } from './bf-toll-review/bf-toll-review.component';
import { BfTollAuditComponent } from './bf-toll-audit/bf-toll-audit.component';
import { BfTollAuditedComponent } from './bf-toll-audited/bf-toll-audited.component';

@NgModule({
  declarations: [
    BfTollComponent,
    BfTollInfoComponent,
    BfTollReviewComponent,
    BfTollAuditComponent,
    BfTollAuditedComponent
  ],
  imports: [
    CommonModule,
    BfTollRoutingModule,
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
    TabMenuModule,
    InputTextareaModule
  ]
})
export class BfTollModule { }
