import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import { SystemsetRoutingModule } from './systemset-routing.module';
import { SystemsetComponent } from './systemset/systemset.component';
import { SetCarkindComponent } from './set-carkind/set-carkind.component';
import { SetCarbrandComponent } from './set-carbrand/set-carbrand.component';
import { SetNationComponent } from './set-nation/set-nation.component';
import { SetConfigComponent } from './set-config/set-config.component';
import {ConfirmationService, MessageService, TreeNode} from 'primeng/api';
import {MessageModule} from 'primeng/message';
import {
  ButtonModule,
  CalendarModule, CheckboxModule,
  ConfirmDialogModule,
  DialogModule,
  DropdownModule,
  FileUploadModule,
  InputTextModule,
  MessagesModule,
  RadioButtonModule,
  ScrollPanelModule, TreeModule
} from 'primeng/primeng';
import {DataViewModule} from 'primeng/dataview';
import {PagingModule} from '../../common/components/paging/paging.module';
import {FormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {SetPermissionComponent} from './set-permission/set-permission.component';
import {LoadingModule} from '../../common/components/loading/loading.module';
import { SetRoleComponent } from './set-role/set-role.component';
import { SetPartComponent } from './set-part/set-part.component';

@NgModule({
  declarations: [
    SystemsetComponent,
    SetCarkindComponent,
    SetCarbrandComponent,
    SetNationComponent,
    SetConfigComponent,
    SetPermissionComponent,
    SetRoleComponent,
    SetPartComponent
  ],
  imports: [
    CommonModule,
    SystemsetRoutingModule,
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
    CheckboxModule,
    TreeModule,
  ],
  providers: [MessageService, ConfirmationService, DatePipe]
})
export class SystemsetModule { }
