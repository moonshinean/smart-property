import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import { RefundRoutingModule } from './refund-routing.module';
import { RefundComponent } from './refund/refund.component';
import { RefundInfoComponent } from './refund-info/refund-info.component';
import { RefundAlreadyComponent } from './refund-already/refund-already.component';
import { RefundNoComponent } from './refund-no/refund-no.component';
import {
  ButtonModule, CalendarModule, ConfirmationService,
  ConfirmDialogModule,
  DialogModule, DropdownModule, FileUploadModule,
  InputTextModule,
  MessageModule, MessageService,
  MessagesModule, RadioButtonModule,
  ScrollPanelModule, TreeModule
} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {DataViewModule} from 'primeng/dataview';
import {PagingModule} from '../../common/components/paging/paging.module';
import {FormsModule} from '@angular/forms';
import {LoadingModule} from '../../common/components/loading/loading.module';
import {PublicMethedService} from '../../common/public/public-methed.service';
import {BasicTableModule} from '../../common/components/basic-table/basic-table.module';
import {BasicDialogModule} from '../../common/components/basic-dialog/basic-dialog.module';
import {RefundAuditedComponent} from './refund-audited/refund-audited.component';

@NgModule({
  declarations: [
    RefundComponent,
    RefundInfoComponent,
    RefundAuditedComponent
  ],
  imports: [
    CommonModule,
    RefundRoutingModule,
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
    BasicTableModule,
    BasicDialogModule
  ],
  providers: [MessageService, ConfirmationService, DatePipe, PublicMethedService]
})
export class RefundModule { }
