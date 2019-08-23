import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LatepaymentRoutingModule } from './latepayment-routing.module';
import { LatepaymentComponent } from './latepayment/latepayment.component';
import { LatepaymentTotalComponent } from './latepayment-total/latepayment-total.component';
import {
  ButtonModule, ConfirmationService,
  ConfirmDialogModule,
  DialogModule, FileUploadModule,
  InputTextModule,
  MessageModule, MessageService,
  MessagesModule,
  ScrollPanelModule,
} from 'primeng/primeng';
import {PagingModule} from '../../common/components/paging/paging.module';
import {FormsModule} from '@angular/forms';
import {LoadingModule} from '../../common/components/loading/loading.module';
import {BasicTableModule} from '../../common/components/basic-table/basic-table.module';
import {PublicMethedService} from '../../common/public/public-methed.service';
import {BasicDialogModule} from '../../common/components/basic-dialog/basic-dialog.module';

@NgModule({
  declarations: [LatepaymentComponent, LatepaymentTotalComponent],
  imports: [
    CommonModule,
    LatepaymentRoutingModule,
    InputTextModule,
    ScrollPanelModule,
    DialogModule,
    ButtonModule,
    MessageModule,
    MessagesModule,
    ConfirmDialogModule,
    PagingModule,
    FormsModule,
    LoadingModule,
    BasicTableModule,
    FileUploadModule,
    BasicDialogModule
  ],
  providers: [MessageService, ConfirmationService, PublicMethedService]
})
export class LatepaymentModule { }
