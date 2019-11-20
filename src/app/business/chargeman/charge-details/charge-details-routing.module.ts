import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChargeDetailsComponent} from './charge-details.component';

const routes: Routes = [
  {path: '', component: ChargeDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChargeDetailsRoutingModule { }
