import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BfVehicleComponent} from './bf-vehicle.component';

const routes: Routes = [
  {path: '' , component: BfVehicleComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BfVehicleRoutingModule { }
