import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BfOwnerService {

  constructor(
    private http: HttpClient
  ) { }

  public  queryOwerDataList(pamars): Observable<any> {
      return this.http.post(environment.sysetUrl + `/roomInfo/findVByPage`, pamars);
  }
  // Conditional search unitinfo
  public  queryowerInfoList(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/roomInfo/findAllByPage`, pamars);
  }
  // upload owerInfo file
  public  uploadOwerInfoFile(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/excel/readExcel', body);
    // return  this.http.post('/recieveMessage', body);
  }
  public  addOwerInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/roomInfo/addOwner', body);
  }
  public  addSingleOwerInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/roomInfo/addSingleOwner', body);
  }
  public  queryOwerInfoAllStatus(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/setting/findAdminChoose', body);
  }
  public  updateOwerInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/roomInfo/updateOwner', body);
  }
  // delete owerInfo
  public  deleteRoomInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/roomInfo/deleteRoom', body);
  }
  public  deleteOwerInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/roomInfo/logout', body);
  }
  public  queryOwerInfoDetail(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/roomInfo/findOwnerDetail', body);
  }
  public  addRoomCodeInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/roomInfo/addRoom', body);
  }
  public  queryUploadDetail(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/excel/findLog', body);
  }
  public  queryByMobileNumber(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/roomInfo/findByPhone', body);
  }
}
