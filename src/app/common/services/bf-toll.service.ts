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
  public queryTollForChargeName(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/charge/findByChargeName`, pamars);
  }
  // 下面列表的删除
  public  deleteTollList(pamars): Observable<any> {
      return this.http.post(environment.sysetUrl + `/charge/deleteChargeDetail`, pamars);
  }
  public updateTollInfo(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/charge/addCache`, pamars);
  }
  public getTolldetail(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/charge/findChargeDetail`, pamars);
  }

  public getAuditTolldetail(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/charge/findApplyByCode`, pamars);
  }

  public updateTollChangeInfo(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/charge/updateCache`, pamars);
  }

  // 修改申请查询
  public getChangeTollApplicationPageData(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/charge/findApplication`, pamars);
  }

  // 待复审——查询
  public getTollReviewPageData(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/charge/findSecondApplication`, pamars);
  }
  // 待初审——查询
  public getTollAuditPageData(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/charge/findFirstApplication`, pamars);
  }
  // 审核通过——查询
  public getTollAuditedPageData(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/charge/findFinishApplication`, pamars);
  }

  // 待初审——审核
  public auditTollToUpdate(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/charge/firstAuditApplication`, pamars);
  }
  // 待初审——审核
  public reviewTollToUpdate(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/charge/secondAuditApplication`, pamars);
  }
}
