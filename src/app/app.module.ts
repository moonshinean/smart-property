import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from './common/services/auth.interceptor';
import {ErrorComponent} from './error/error.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {LoginModule} from './login/login.module';
import {PersionalModule} from './persional/persional.module';
import { counterReducer } from './store/loadstatus.reducers';
import {StoreModule} from '@ngrx/store';
import {LoadingModule} from './common/components/loading/loading.module';
@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PersionalModule,
    LoginModule,
    LoadingModule,
    // 加入状态管理器
    StoreModule.forRoot({loadhidden: counterReducer})
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}, // 拦截器进入
    {provide: LocationStrategy, useClass: HashLocationStrategy},
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
