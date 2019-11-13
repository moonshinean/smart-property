import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BfTollComponent} from './bf-toll.component';

const routes: Routes = [
  {path: '', component: BfTollComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BfTollRoutingModule { }
