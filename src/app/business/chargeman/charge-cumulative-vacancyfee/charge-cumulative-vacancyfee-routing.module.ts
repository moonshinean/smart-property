import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChargeCumulativeVacancyfeeComponent} from './charge-cumulative-vacancyfee.component';

const routes: Routes = [
  {path: '', component: ChargeCumulativeVacancyfeeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChargeCumulativeVacancyfeeRoutingModule { }
