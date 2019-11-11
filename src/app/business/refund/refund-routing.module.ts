import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MonitorComponent} from '../monitor/monitor/monitor.component';
import {MonitorLogComponent} from '../monitor/monitor-log/monitor-log.component';
import {MonitorDeviantComponent} from '../monitor/monitor-deviant/monitor-deviant.component';
import {MonitorComplaintComponent} from '../monitor/monitor-complaint/monitor-complaint.component';
import {MonitorCheckingComponent} from '../monitor/monitor-checking/monitor-checking.component';
import {RefundComponent} from './refund/refund.component';
import {RefundInfoComponent} from './refund-info/refund-info.component';
import {RefundNoComponent} from './refund-no/refund-no.component';
import {RefundAlreadyComponent} from './refund-already/refund-already.component';
import {RefundAuditedComponent} from './refund-audited/refund-audited.component';
import {RefundReviewComponent} from './refund-review/refund-review.component';
import {RefundPendReviewComponent} from './refund-pend-review/refund-pend-review.component';
import {RefundApplicationInfoComponent} from './refund-application-info/refund-application-info.component';

const routes: Routes = [
  {
    path: '',
    component: RefundComponent,
    children: [
      {path: 'info', component: RefundInfoComponent},
      {path: 'no', component: RefundNoComponent},
      {path: 'already', component: RefundAlreadyComponent},
      // {path: 'audited', component: RefundAuditedComponent},
      {path: 'review', component: RefundReviewComponent},
      {path: 'pendreview', component: RefundPendReviewComponent},
      {path: 'applicationInfo', component: RefundApplicationInfoComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefundRoutingModule { }
