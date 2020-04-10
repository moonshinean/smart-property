import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BfTollComponent} from './bf-toll.component';
import {BfTollInfoComponent} from './bf-toll-info/bf-toll-info.component';
import {BfTollReviewComponent} from './bf-toll-review/bf-toll-review.component';
import {BfTollAuditComponent} from './bf-toll-audit/bf-toll-audit.component';
import {BfTollAuditedComponent} from './bf-toll-audited/bf-toll-audited.component';
import {BfTollChangeInfoComponent} from './bf-toll-change-info/bf-toll-change-info.component';

const routes: Routes = [
  {path: '', component: BfTollComponent, children: [
      {path: 'info', component: BfTollInfoComponent},
      {path: 'changeinfo', component: BfTollChangeInfoComponent},
      {path: 'audit', component: BfTollAuditComponent},
      {path: 'review', component: BfTollReviewComponent},
      {path: 'audited', component: BfTollAuditedComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BfTollRoutingModule { }
