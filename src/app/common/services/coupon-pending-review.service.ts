import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CouponPendingReviewService {

  constructor(private http: HttpClient) { }
  public  queryCouponPendingReviewPageData(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/coupon/findWaitAgainAuditPage`, pamars);
  }
  public  queryCouponType(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/coupon/findCouponType`, pamars);
  }
  public  couponPendingReviewPassById(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/coupon/againAudit`, pamars);
  }
  public  couponPendingReviewNoPassById(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/coupon/auditNoPass`, pamars);
  }
}
