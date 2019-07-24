import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RefundNoService {

  constructor(private http: HttpClient) { }
  public  queryRefundNoInfoPage(pamars): Observable<any> {
      return this.http.post(environment.chargeUrl + `/refund/findNotByPage`, pamars);
  }
  public applicationRefund(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl  + `/refund/application`, pamars);
  }
  public queryRefundStatus(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/setting/findAdminChoose`, pamars);
  }
}
