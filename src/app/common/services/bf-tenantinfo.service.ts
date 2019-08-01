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
    return this.http.post(environment.sysetUrl + `/roomInfo/findVByPage`, pamars);
  }
  // Conditional search unitinfo
  public  queryTenantInfoList(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/roomInfo/findAllByPage`, pamars);
  }

  // upload owerInfo file
  public  uploadTenantInfoFile(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/excel/readExcel', body);
    // return  this.http.post('/recieveMessage', body);
  }
  public  addTenantInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/roomInfo/addSingleCustomer', body);
  }
  public  queryTenantInfoAllStatus(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/setting/findAdminChoose', body);
  }
  // delete owerInfo
  public  deleteTenantInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/roomInfo/logout', body);
  }
  public  deleteRoomInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/roomInfo/deleteRoom', body);
  }
  public  queryTenantInfoDetail(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/roomInfo/findCustomerDetail', body);
  }
  public  addRoomCodeInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/roomInfo/addRoom', body);
  }
}
