import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BfParkingTotalService {

  constructor(
    private http: HttpClient
  ) { }
  // 分页查询信息
  public  queryParkingTotalPageData(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/parkingSpace/findStatisticsByPage`, pamars);
  }
  // 根据地块查询信息
  public  queryParkingInfoByRegionName(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/parkingSpace/findStatisticsByRegionName`, pamars);
  }
  // 更新统计
  public  updateParkingTotal(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/parkingSpace/updateParkingSpaceStatistics`, pamars);
  }
}
