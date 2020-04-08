import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import { BaseinfoRoutingModule } from './baseinfo-routing.module';
import { BaseinfoComponent } from './baseinfo/baseinfo.component';
import { BfTollComponent } from './bf-toll/bf-toll.component';
import { BfOwnerComponent } from './bf-owner/bf-owner.component';
import { BfVehicleComponent } from './bf-vehicle/bf-vehicle.component';
import { BfStaffComponent } from './bf-staff/bf-staff.component';
import {
  ButtonModule, CalendarModule, ConfirmationService, ConfirmDialogModule,
  DialogModule, DropdownModule, FileUploadModule,
  InputTextModule, KeyFilterModule,
  MessageModule,
  MessageService,
  MessagesModule, RadioButtonModule,
  ScrollPanelModule, TreeModule
} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {DataViewModule} from 'primeng/dataview';
import {PagingModule} from '../../common/components/paging/paging.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoadingModule} from '../../common/components/loading/loading.module';
import {PublicMethedService} from '../../common/public/public-methed.service';
import {BasicTableModule} from '../../common/components/basic-table/basic-table.module';
import {BasicDialogModule} from '../../common/components/basic-dialog/basic-dialog.module';
import {EchartsPieModule} from '../../common/components/echarts-pie/echarts-pie.module';

@NgModule({
  declarations: [
    BaseinfoComponent,
    BfOwnerComponent,
  ],
  imports: [
    CommonModule,
    BaseinfoRoutingModule,
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
    KeyFilterModule,
    EchartsPieModule
  ],
  providers: [MessageService, ConfirmationService, DatePipe, PublicMethedService]
})
export class BaseinfoModule { }
