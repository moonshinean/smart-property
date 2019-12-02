import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BfTollService {

  constructor(private http: HttpClient) { }
  public  queryBfTollPageInfo(pamars): Observable<any> {
      return this.http.post(environment.sysetUrl + `/charge/findByPage`, pamars);
  }
  public  addBfTollInfo(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/charge/add`, pamars);
  }
  public deleteTollinfo(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/charge/deleteByIds`, pamars);
  }
  public queryTollinfoDetail(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/charge/findChargeDetail`, pamars);
  }
  public updateTollListinfo(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/charge/update`, pamars);
  }
  // 下面列表为空的添加
  public queryTollAdd(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/charge/add`, pamars);
  }
  // 下面列表为空的修改
  public queryTollModify(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/charge/updateChargeItem`, pamars);
  }
  // 下面列表的删除
  public  deleteTollList(pamars): Observable<any> {
      return this.http.post(environment.sysetUrl + `/charge/deleteChargeDetail`, pamars);
  }
  public updateTollInfo(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/charge/update`, pamars);
  }
  public getTolldetail(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/charge/findChargeDetail`, pamars);
  }

}
