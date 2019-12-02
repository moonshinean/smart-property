import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BfTenantinfoService {

  constructor(private http: HttpClient) { }
  public  queryTenantDataList(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/customer/findCustomerAllByPage`, pamars);
  }

  // upload owerInfo file
  public  uploadTenantInfoFile(body): Observable<any> {
    return  this.http.post(environment.chargeUrl + '/owner/import', body);
    // return  this.http.post('/recieveMessage', body);
  }
  // 业主添加
  public  addTenantInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/customer/addCustomer', body);
  }

  public  deleteSingleTeanantrInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/roomInfo/deleteSingleCustomer', body);
  }
  //
  public  findTenantDetail(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/customer/findCustomerDetail', body);
  }
  public  queryTenantfoListByCondition(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/customer/findCustomerByCondition', body);
  }
  public  logoutOwnerInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/roomInfo/logout', body);
  }
}
