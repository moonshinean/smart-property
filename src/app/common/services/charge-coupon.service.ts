import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChargeCouponService {

  constructor(
    private http: HttpClient
  ) { }
  public queryCouponPageData(pamars): Observable<any> {
      return this.http.post(environment.chargeUrl + `/coupon/findCouponPage`, pamars);
  }
  // public  queryConditionalCoupon(pamars): Observable<any> {
  //   return this.http.post(environment.chargeUrl + `/customer/findByMobilePhone`, pamars);
  // }
}
