import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BfHouseComponent} from './bf-house.component';

const routes: Routes = [
  {path: '', component: BfHouseComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BfHouseRoutingModule { }
