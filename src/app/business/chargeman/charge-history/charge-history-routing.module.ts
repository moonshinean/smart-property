import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChargeHistoryComponent} from './charge-history.component';

const routes: Routes = [
  {path: '', component: ChargeHistoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChargeHistoryRoutingModule { }
