import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BfParkingspaceComponent} from './bf-parkingspace.component';

const routes: Routes = [
  {
    path: '', component: BfParkingspaceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BfParkingspaceRoutingModule { }
