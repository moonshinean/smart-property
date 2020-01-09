import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SystemsetComponent} from './systemset/systemset.component';
import {SetConfigComponent} from './set-config/set-config.component';
import {SetPermissionComponent} from './set-permission/set-permission.component';
import {SetRoleComponent} from './set-role/set-role.component';
import {SetPartComponent} from './set-part/set-part.component';
import {LoginLogComponent} from './login-log/login-log.component';

const routes: Routes = [
  {
    path: '',
    component: SystemsetComponent,
    children: [
      // {path: 'carkind', component: SetCarkindComponent},
      // {path: 'carbrand', component: SetCarbrandComponent},
      // {path: 'nation', component: SetNationComponent},
      {path: 'config', component: SetConfigComponent},
      {path: 'permission', component: SetPermissionComponent},
      {path: 'role', component: SetRoleComponent},
      {path: 'part', component: SetPartComponent},
      {path: 'log', component: LoginLogComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemsetRoutingModule { }
