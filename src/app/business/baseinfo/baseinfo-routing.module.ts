import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BaseinfoComponent} from './baseinfo/baseinfo.component';
import {BfOwnerComponent} from './bf-owner/bf-owner.component';
const routes: Routes = [
  {
    path: '',
    component: BaseinfoComponent,
    children: [
      {path: 'toll', loadChildren: './bf-toll/bf-toll.module#BfTollModule'},
      // {path: 'owner', loadChildren: './bf-owner/bf-owner.module#BfOwnerModule'},
      {path: 'owner', component: BfOwnerComponent, data: {preload: true}},
      {path: 'vacant', loadChildren: './bf-vacant-room/bf-vacant-room.module#BfVacantRoomModule'},
      {path: 'staff', loadChildren: './bf-staff/bf-staff.module#BfStaffModule'},
      {path: 'tenantinfo', loadChildren: './bf-tenantinfo/bf-tenantinfo.module#BfTenantinfoModule'},
      {path: 'parkingspace', loadChildren: './bf-parkingspace/bf-parkingspace.module#BfParkingspaceModule'},
      {path: 'coupon', loadChildren: './bf-coupon/bf-coupon.module#BfCouponModule'},
      {path: 'roomCharge', loadChildren: './bf-roombind-changeitem/bf-roombind-changeitem.module#BfRoombindChangeitemModule'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class BaseinfoRoutingModule { }
