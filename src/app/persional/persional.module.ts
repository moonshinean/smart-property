import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoadingModule} from '../common/components/loading/loading.module';
import {
  CalendarModule,
  ConfirmationService,
  ConfirmDialogModule,
  DropdownModule, InputTextModule,
  MessageModule, MessageService,
  MessagesModule,
  RadioButtonModule
} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';
import {PersionalComponent} from './persional.component';

@NgModule({
  declarations: [
    PersionalComponent
  ],
  imports: [
    CommonModule,
    LoadingModule,
    ConfirmDialogModule,
    MessageModule,
    MessagesModule,
    FormsModule,
    RadioButtonModule,
    CalendarModule,
    DropdownModule,
    InputTextModule,
  ],
  exports: [
    PersionalComponent
  ],
  providers: [ ConfirmationService, MessageService]
})
export class PersionalModule { }
