import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BfStaffComponent} from './bf-staff.component';

const routes: Routes = [
  {path: '', component: BfStaffComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BfStaffRoutingModule { }
