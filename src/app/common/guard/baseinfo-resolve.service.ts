import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {EMPTY, Observable, of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BaseinfoResolveService implements Resolve<any> {

  constructor(
    private router: Router
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    // console.log(route);
    /*return this.baseinfoSrv.baseInfoTollData().pipe(
      mergeMap((val) => {
        if (val) {
          return of(val);
        } else {
          this.router.navigate(['/error', ], {queryParams: {error: '没有拿到数据'}});
          return EMPTY;
        }
      })
    );*/
    return EMPTY;
  }
}
