import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChargeRecordComponent} from './charge-record.component';

const routes: Routes = [
  {path: '', component: ChargeRecordComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChargeRecordRoutingModule { }
