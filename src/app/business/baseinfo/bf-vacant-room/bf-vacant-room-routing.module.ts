import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BfVacantRoomComponent} from './bf-vacant-room.component';

const routes: Routes = [
  {path: '', component: BfVacantRoomComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BfVacantRoomRoutingModule { }
