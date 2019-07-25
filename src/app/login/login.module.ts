import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CheckboxModule, InputTextModule, MessageModule, MessageService, MessagesModule} from 'primeng/primeng';
import {LoginComponent} from './login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoadingModule} from '../common/components/loading/loading.module';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    CheckboxModule,
    InputTextModule,
    ReactiveFormsModule,
    MessageModule,
    MessagesModule,
    LoadingModule,
    FormsModule
  ],
  providers: [MessageService],
  exports: [
    LoginComponent
  ]
})
export class LoginModule { }
