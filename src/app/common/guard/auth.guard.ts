import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, Router, RouterStateSnapshot} from '@angular/router';
import {GlobalService} from '../services/global.service';
// @ts-ignore
@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private globalSrv: GlobalService,
    private router: Router
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const stateUrlFirst = state.url.split('/')[2];
    const stateUrlSecond = stateUrlFirst.split(';');
   /* if (this.localSessionStorage.getObject('authentication').accessToken) {
      if (this.localSessionStorage.getObject('urlClass').indexOf(stateUrlSecond[0]) !== -1) {
        return true;
      } else {
        window.alert('很抱歉,您没有权限访问！！！');
        this.router.navigate([this.localSessionStorage.getObject('homePageRoute'), {id: 1, name: '久长服务区'}]);
        return false;
      }
    }
    this.router.navigate(['/error']);*/
    return false;
  }
  // 控制子路由
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    /*if (!this.authService.isLogdedin()) {
      alert('You need to login!');
      this.router.navigate(['/home']);
      return false;
    }
    if (this.authService.hasRole('CUSTOMER')) {
      return true;
    }*/
    return false;
  }
}
