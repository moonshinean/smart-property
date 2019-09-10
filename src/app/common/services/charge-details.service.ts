import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChargeDetailsService {

  constructor(
    private http: HttpClient
  ) { }
  public  queryChargeDataPage(pamars): Observable<any> {
      return this.http.post(environment.chargeUrl + `/bills/findBillPage`, pamars);
  }
  public  getPayDocument(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/cash/register/printBilles`, pamars);
  }
  public  importPayDocument(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/cash/register/importOldBills`, pamars);
  }
}
