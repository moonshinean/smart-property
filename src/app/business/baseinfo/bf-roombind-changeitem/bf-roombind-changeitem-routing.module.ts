import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BfRoombindChangeitemComponent} from './bf-roombind-changeitem.component';

const routes: Routes = [
  {path: '', component: BfRoombindChangeitemComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BfRoombindChangeitemRoutingModule { }
