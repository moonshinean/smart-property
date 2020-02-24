import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChargeCarHistoryComponent} from './charge-car-history.component';

const routes: Routes = [
  {path: '', component: ChargeCarHistoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChargeCarHistoryRoutingModule { }
