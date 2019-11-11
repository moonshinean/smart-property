import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { FooterComponent } from './footer/footer.component';
import {HomeRoutingModule} from './home-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import {PanelMenuModule} from 'primeng/panelmenu';
import {
  ConfirmationService,
  ConfirmDialogModule,
  DialogModule,
  MessageModule,
  MessageService,
  MessagesModule, ScrollPanelModule,
  TreeModule
} from 'primeng/primeng';
import {LoadingModule} from '../common/components/loading/loading.module';
import {PublicMethedService} from '../common/public/public-methed.service';
import {SharedServiceService} from '../common/public/shared-service.service';

@NgModule({
  declarations: [
    HeaderComponent,
    HomeComponent,
    BreadcrumbComponent,
    FooterComponent,
    SidebarComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    PanelMenuModule,
    ConfirmDialogModule,
    LoadingModule,
    MessageModule,
    MessagesModule,
    DialogModule,
    TreeModule,
    ScrollPanelModule,
  ],
  providers: [ConfirmationService, MessageService, PublicMethedService, SharedServiceService]
})
export class HomeModule { }
