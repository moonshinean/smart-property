import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from './main/main.component';
const tabRoutes: Routes = [
  {path: '', component: MainComponent},
];
@NgModule({
  imports: [RouterModule.forChild(tabRoutes)],
  exports: [RouterModule]
})
export class MainRoutingModule {}
