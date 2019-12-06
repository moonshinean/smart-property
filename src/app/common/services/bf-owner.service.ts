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
      return this.http.post(environment.sysetUrl + `/owner/findOwnerAllByPage`, pamars);
  }
  // Conditional search unitinfo
  public  queryOwerInfoListByCondition(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/owner/findOwnerByCondition`, pamars);
  }
  // upload owerInfo file
  public  uploadOwerInfoFile(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/owner/import', body);
    // return  this.http.post('/recieveMessage', body);
  }
  // delete owerInfo
  public  deleteRoomInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/roomInfo/deleteRoom', body);
  }
  public  queryOwerInfoDetail(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/owner/findOwnerDetail', body);
  }
  public  addRoomCodeAndOwnerInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/owner/addOwner2', body);
  }
  public  queryUpdateInfoByroomCode(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/owner/findToUpdate', body);
  }

  public  deleteSingleOwnerInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/roomInfo/deleteSingleCustomer', body);
  }
  public  logoutOwnerInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/roomInfo/logout', body);
  }
}
