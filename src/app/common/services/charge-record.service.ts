import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChargeRecordService {

  constructor(private http: HttpClient) { }
  public queryRecordPage(pamars): Observable<any> {
      return this.http.post(environment.chargeUrl +  `/prePayment/findPrePaymentByPageAndUserIdDesc`, pamars)
  }
}
