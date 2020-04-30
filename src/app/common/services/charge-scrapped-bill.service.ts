import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChargeScrappedBillService {

  constructor(
    private http: HttpClient
  ) { }
  public  queryChargeDataPage(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/bills/findScrapBillPage`, pamars);
  }
}
