import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChargeExportComponent} from './charge-export.component';

const routes: Routes = [
  {path: '', component: ChargeExportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChargeExportRoutingModule { }
