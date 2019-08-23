import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  constructor(
    private http: HttpClient
  ) { }

  /**
   * 优惠券信息子模块
   * @param pamars
   */
  public queryCouponPageData(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/coupon/findCouponPage`, pamars);
  }
  public queryCouponUserInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/customer/findByMobilePhone`, pamars);
  }
  public queryCouponList(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/coupon/findByOrganizationId`, pamars);
  }
  public queryCouponInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/coupon/findByCouponCode`, pamars);
  }
  public addCouponInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/coupon/add`, pamars);
  }
  public deleteCouponInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/coupon/delete`, pamars);
  }
  public queryRoomCode(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/structure/findByUnitCode `, pamars);
  }


  /**
   * 优惠券初审子模块
   * @param pamars
   */
  public  queryCouponReviewPageData(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/coupon/findWaitAuditPage`, pamars);
  }
  public  couponReviewPassById(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/coupon/audit`, pamars);
  }
  public  couponReviewNoPassById(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/coupon/auditNoPass`, pamars);
  }


  /**
   * 优惠券复审子模块
   * @param pamars
   */
  public  queryCouponPendingReviewPageData(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/coupon/findWaitAgainAuditPage`, pamars);
  }
  public  couponPendingReviewPassById(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/coupon/againAudit`, pamars);
  }
  public  couponPendingReviewNoPassById(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/coupon/auditNoPass`, pamars);
  }


  /**
   * 优惠券已审核子模块
   * @param pamars
   */
  public  queryCouponAuditedPageData(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/coupon/findAlreadyAuditPage`, pamars);
  }
  /**
   * 公共请求
   * @param pamars
   */
  public  queryCouponType(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/coupon/findCouponType`, pamars);
  }
}
