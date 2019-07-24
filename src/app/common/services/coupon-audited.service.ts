import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CouponAuditedService {

  constructor(
    private http: HttpClient
  ) { }
  public  queryCouponAuditedPageData(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/coupon/findAlreadyAuditPage`, pamars);
  }
  public  queryCouponType(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/coupon/findCouponType`, pamars);
  }
  public  queryCouponStatus(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/setting/findAdminChoose`, pamars);
  }
}
