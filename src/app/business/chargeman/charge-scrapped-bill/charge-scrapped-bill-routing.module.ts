import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChargeDetailsComponent} from '../charge-details/charge-details.component';
import {ChargeScrappedBillComponent} from './charge-scrapped-bill.component';

const routes: Routes = [
  {path: '', component: ChargeScrappedBillComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChargeScrappedBillRoutingModule { }
