import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private http: HttpClient) {
  }
  public  getEvent(body): Observable<any> {
      return this.http.post(environment.chargeUrl + '/event/findByPage', body);
  }

  public  getVillageInfo(body): Observable<any> {
    return this.http.post(environment.chargeUrl + '/statistics/village_info', body);
  }
  public  getChargeTypeDataInfo(body): Observable<any> {
    return this.http.post(environment.chargeUrl + '/statistics/total_revenue/charge_type', body);
  }
}
