import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import { LatepaymentRoutingModule } from './latepayment-routing.module';
import { LatepaymentComponent } from './latepayment/latepayment.component';
import { LatepaymentTotalComponent } from './latepayment-total/latepayment-total.component';
import {
  ButtonModule, ConfirmationService,
  ConfirmDialogModule,
  DialogModule, DropdownModule, FileUploadModule,
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
import { LatepaymentReviewComponent } from './latepayment-review/latepayment-review.component';
import { LatepaymentPendingReviewComponent } from './latepayment-pending-review/latepayment-pending-review.component';
import { LatepaymentAuditedComponent } from './latepayment-audited/latepayment-audited.component';
import { LatepaymentNoPassComponent } from './latepayment-no-pass/latepayment-no-pass.component';
import {HeaderBtnModule} from '../../common/components/header-btn/header-btn.module';
import { LatepaymentOwnerComponent } from './latepayment-owner/latepayment-owner.component';

@NgModule({
  declarations: [
    LatepaymentComponent,
    LatepaymentTotalComponent,
    LatepaymentReviewComponent,
    LatepaymentPendingReviewComponent,
    LatepaymentAuditedComponent,
    LatepaymentNoPassComponent,
    LatepaymentOwnerComponent
  ],
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
    BasicDialogModule,
    HeaderBtnModule,
    DropdownModule,
  ],
  providers: [MessageService, ConfirmationService, PublicMethedService, DatePipe]
})
export class LatepaymentModule { }
