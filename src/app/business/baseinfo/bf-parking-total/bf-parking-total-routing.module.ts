import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BfVehicleComponent} from '../bf-vehicle/bf-vehicle.component';
import {BfParkingTotalComponent} from './bf-parking-total.component';

const routes: Routes = [
  {path: '' , component: BfParkingTotalComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BfParkingTotalRoutingModule { }
