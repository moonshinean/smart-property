import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BfCouponService {

  constructor(private http: HttpClient) {
  }
  public  queryCouponPagination(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/coupon/findByPage`, pamars);
  }
  public  queryEffectiveTime(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/coupon/findEffectiveTime`, pamars);
  }
  public  queryCouponType(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/coupon/findCouponType`, pamars);
  }
  public  queryChargeCode(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/coupon/findChargeCode`, pamars);
  }
  public  addCoupon(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/coupon/add`, pamars);
  }
  public  updateCoupon(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/coupon/update`, pamars);
  }
  public  deleteCoupon(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/coupon/deleteByIds`, pamars);
  }
  public  searchCouponByCouponName(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/coupon/findByCouponName`, pamars);
  }
}
