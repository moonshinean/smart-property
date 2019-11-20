import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChargeParkspaceComponent} from './charge-parkspace.component';

const routes: Routes = [
  {path: '', component: ChargeParkspaceComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChargeParkspaceRoutingModule { }
