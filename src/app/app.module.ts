import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from './common/services/auth.interceptor';
import {ErrorComponent} from './error/error.component';
import {LoginComponent} from './login/login.component';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';

import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {
  CalendarModule,
  ConfirmationService,
  ConfirmDialogModule, DropdownModule,
  InputTextModule,
  MessageModule,
  MessageService,
  MessagesModule,
  RadioButtonModule
} from 'primeng/primeng';
import {LoadingModule} from './common/components/loading/loading.module';
import { PersionalComponent } from './persional/persional.component';
import {FormsModule} from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    LoginComponent,
    PersionalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    InputTextModule,
    LoadingModule,
    MessageModule,
    MessagesModule,
    ConfirmDialogModule,
    FormsModule,
    RadioButtonModule,
    CalendarModule,
    DropdownModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, // 拦截器进入
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    MessageService, ConfirmationService
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
