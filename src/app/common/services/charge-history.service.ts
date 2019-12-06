import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChargeHistoryService {

  constructor(
    private http: HttpClient
  ) { }
  public queryChargeHistoryPageInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/history_data/findByPage`, pamars);
  }
  public imporChargeHistoryData(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/history_data/import`, pamars);
  }
}
