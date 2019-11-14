import { NgModule } from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {ErrorComponent} from './error/error.component';
import {LoginGuard} from './common/guard/login.guard';
import {PersionalComponent} from './persional/persional.component';
import {PreloadSelectedModules} from './preload/preload.module';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'home', loadChildren: './home/home.module#HomeModule', canActivate: [LoginGuard], data: {preload: true}},
  {path: 'error', component: ErrorComponent},
  {path: 'persion', component: PersionalComponent},
  {path: '**', component: ErrorComponent},  // fallback router must in the last
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadSelectedModules})],
  exports: [RouterModule],
  providers: [PreloadSelectedModules]
})
export class AppRoutingModule {}
