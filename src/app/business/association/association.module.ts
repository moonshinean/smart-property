import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssociationRoutingModule } from './association-routing.module';
import { AssocStaffComponent } from './assoc-staff/assoc-staff.component';
import { AssociationComponent } from './association/association.component';

@NgModule({
  declarations: [
    AssocStaffComponent,
    AssociationComponent
  ],
  imports: [
    CommonModule,
    AssociationRoutingModule
  ]
})
export class AssociationModule { }
