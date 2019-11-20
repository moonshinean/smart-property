import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CheckboxModule, InputTextModule, MessageModule, MessageService, MessagesModule} from 'primeng/primeng';
import {LoginComponent} from './login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoadingModule} from '../common/components/loading/loading.module';
import {PublicMethedService} from '../common/public/public-methed.service';

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
    FormsModule,
  ],
  providers: [MessageService, PublicMethedService],
  exports: [
    LoginComponent
  ]
})
export class LoginModule { }
