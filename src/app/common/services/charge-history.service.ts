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
 // 专有车位历史数据数据导入
  public imporParkingHistoryData(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/history_data/importExclusiveParkingSpace
`, pamars);
  }
//  专有车位历史数据分页查询
  public queryParkingHistoryPageInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/history_data/findExclusiveParkingSpaceHistoryDataByPage
`, pamars);
  }
}
