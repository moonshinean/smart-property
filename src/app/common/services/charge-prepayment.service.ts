import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChargePrepaymentService {

  constructor(private http: HttpClient) { }
  // 分页查询，初始化数据
  public  queryPrepaymentPage(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/prePayment/findPrePaymentByPageAndUserIdDesc`, pamars);
  }
}
