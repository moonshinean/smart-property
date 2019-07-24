import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitorRoutingModule } from './monitor-routing.module';
import { MonitorComponent } from './monitor/monitor.component';
import { MonitorLogComponent } from './monitor-log/monitor-log.component';
import { MonitorDeviantComponent } from './monitor-deviant/monitor-deviant.component';
import { MonitorComplaintComponent } from './monitor-complaint/monitor-complaint.component';
import { MonitorCheckingComponent } from './monitor-checking/monitor-checking.component';

@NgModule({
  declarations: [
    MonitorComponent,
    MonitorLogComponent,
    MonitorDeviantComponent,
    MonitorComplaintComponent,
    MonitorCheckingComponent
  ],
  imports: [
    CommonModule,
    MonitorRoutingModule
  ]
})
export class MonitorModule { }
