import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AssociationComponent} from './association/association.component';
import {AssocStaffComponent} from './assoc-staff/assoc-staff.component';

const routes: Routes = [
  {
    path: '',
    component: AssociationComponent,
    children: [
      {path: 'assocstaff', component: AssocStaffComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssociationRoutingModule { }
