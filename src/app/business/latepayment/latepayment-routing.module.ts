import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LatepaymentComponent} from './latepayment/latepayment.component';
import {LatepaymentTotalComponent} from './latepayment-total/latepayment-total.component';

const routes: Routes = [
  {
    path: '',
    component: LatepaymentComponent,
    children: [
      {path: 'latepaytotle', component: LatepaymentTotalComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LatepaymentRoutingModule { }
