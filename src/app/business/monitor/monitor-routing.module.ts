import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MonitorComponent} from './monitor/monitor.component';
import {MonitorLogComponent} from './monitor-log/monitor-log.component';
import {MonitorDeviantComponent} from './monitor-deviant/monitor-deviant.component';
import {MonitorComplaintComponent} from './monitor-complaint/monitor-complaint.component';
import {MonitorCheckingComponent} from './monitor-checking/monitor-checking.component';

const routes: Routes = [
  {
    path: '',
    component: MonitorComponent,
    children: [
      {path: 'log', component: MonitorLogComponent},
      {path: 'deviant', component: MonitorDeviantComponent},
      {path: 'complaint', component: MonitorComplaintComponent},
      {path: 'check', component: MonitorCheckingComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitorRoutingModule { }
