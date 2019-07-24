import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CouponReviewService {

  constructor(
    private http: HttpClient
  ) { }
  public  queryCouponReviewPageData(pamars): Observable<any> {
      return this.http.post(environment.chargeUrl + `/coupon/findWaitAuditPage`, pamars);
  }
  public  queryCouponType(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/coupon/findCouponType`, pamars);
  }
  public  couponReviewPassById(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/coupon/audit`, pamars);
  }
  public  couponReviewNoPassById(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/coupon/auditNoPass`, pamars);
  }
}
