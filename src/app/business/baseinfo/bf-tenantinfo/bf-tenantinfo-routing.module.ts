import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BfTenantinfoComponent} from './bf-tenantinfo.component';

const routes: Routes = [
  {path: '', component: BfTenantinfoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BfTenantinfoRoutingModule { }
