import {Injectable} from '@angular/core';
import {HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {EMPTY, Observable, of} from 'rxjs';
import {catchError, mergeMap, tap, timeout} from 'rxjs/operators';
import {GlobalService} from './global.service';
import {Router} from '@angular/router';
import {LocalStorageService} from './local-storage.service';
import { Store } from '@ngrx/store';
import {AppState} from '../../store/loadstatus.state';
const DEFAULTTIMEOUT = 3000000;
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  public clonedRequest: any;
  constructor(
    private globalService: GlobalService,
    private router: Router,
    private localSessionStorage: LocalStorageService,
    private store: Store<AppState>
  ) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // return this.prod_http(req, next);
    if (environment.production) {
      return this.prod_http(req, next);
    } else {
      return this.debug_http(req, next);
    }
  }
  public debug_http(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 修改请求状态
    this.store.dispatch({type: 'false'});
    if (req.url === environment.loginUrl + '/login') {
      this.clonedRequest = req.clone({
        url: req.url,
        headers: req.headers
        .set('Content-type', 'application/json; charset=UTF-8')
        // .set('Content-type', 'application/x-www-form-urlencoded')
    });
    } else if (req.url === environment.sysetUrl + '/owner/import'
      || req.url === environment.chargeUrl + '/liquidated/damages/batch/processing' ||
      environment.chargeUrl + '/cash/register/importOldBills') {
      this.clonedRequest = req.clone({
        url: req.url,
        headers: req.headers
          .set('appkey', this.localSessionStorage.get('appkey'))
      });
    } else {
      this.clonedRequest = req.clone({
        url: req.url,
        headers: req.headers
        .set('Content-type', 'application/json; charset=UTF-8')
        // .set('Content-type', 'application/x-www-form-urlencoded')
        .set('appkey', this.localSessionStorage.get('appkey'))
      });
    }
    return next.handle(this.clonedRequest).pipe(
      timeout(DEFAULTTIMEOUT),
      tap((event: any) => {
        if (event.status === 200) {
          this.store.dispatch({type: 'true'});
          return of(event);
        }
        return EMPTY;
      },
        (err) => {
            this.router.navigate(['/error'], {
                queryParams: {
                  msg: '连接服务器失败，请检查网络！',
                  status: err.status,
                  btn: '请重试'
                }
              });
            return EMPTY;
          })
      );
  }
   public prod_http(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     // 修改请求状态
     this.store.dispatch({type: 'false'});
     if (req.url === environment.loginUrl + '/login') {
       this.clonedRequest = req.clone({
         url: req.url,
         headers: req.headers
           .set('Content-type', 'application/json; charset=UTF-8')
         // .set('Content-type', 'application/x-www-form-urlencoded')
       });
     } else if (req.url === environment.sysetUrl + '/owner/import'
       || req.url === environment.chargeUrl + '/liquidated/damages/batch/processing' ||
       environment.chargeUrl + '/cash/register/importOldBills') {
       this.clonedRequest = req.clone({
         url: req.url,
         headers: req.headers
           .set('appkey', this.localSessionStorage.get('appkey'))
       });
     } else {
       this.clonedRequest = req.clone({
         url: req.url,
         headers: req.headers
           .set('Content-type', 'application/json; charset=UTF-8')
           // .set('Content-type', 'application/x-www-form-urlencoded')
           .set('appkey', this.localSessionStorage.get('appkey'))
       });
     }
     return next.handle(this.clonedRequest).pipe(
       timeout(DEFAULTTIMEOUT),
       tap((event: any) => {
           if (event.status === 200) {
             // 修改请求状态
             this.store.dispatch({type: 'true'});
             return of(event);
           }
           return EMPTY;
         },
         (err) => {
           if (err.status === 0) {
             this.router.navigate(['/error'], {
               queryParams: {
                 msg: '连接服务器失败，请检查网络！',
                 url: null,
                 btn: '请重试',
               }});
           }
           if (err.status === 403) {
             this.router.navigate(['/error'], {
               queryParams: {
                 msg: '连接服务器失败，请检查网络！',
                 url: null,
                 btn: '请重试',
               }});
           }
           if (err.status === 400) {
             return of(err);
           }
           if (err.status === 500) {
             this.router.navigate(['/error'], {
               queryParams: {
                 msg: '服务器处理失败！请联系管理员',
                 url: null,
                 btn: '请重试',
               }});
           }
         })
     );
  }
}
