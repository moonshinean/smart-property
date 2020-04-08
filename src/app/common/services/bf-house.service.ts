import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BfHouseService {

  constructor(
    private http: HttpClient
  ) { }
  // 获取分页信息
  public  getHousePageData(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/useRoom/findUseRoomAllByPage`, pamars);
  }
  // 获取详细信息
  public  getHouseDetailInfo(pamars): Observable<any> {
      return this.http.post(environment.sysetUrl + `/useRoom/findDetailByRoomCode`, pamars);
  }
  // 获取图像信息
  public  getNowChartInfo(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/chart/nowChart`, pamars);
  }
}
