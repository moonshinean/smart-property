import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RefundApplicationInfoService {

  constructor(private http: HttpClient) { }
  public  queryRefundApplicationInfoPage(pamars): Observable<any> {
      return this.http.post(environment.chargeUrl + `/refund/findApplicationByPage`, pamars);
  }
  public queryRefundStatus(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/setting/findAdminChoose`, pamars);
  }
}
