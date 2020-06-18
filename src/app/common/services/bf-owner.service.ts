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
  // 空置房添加
  public  addVacantRoomCodeAndOwnerInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/vacantRoom/addOwner2', body);
  }
  // 空置房修改
  public  updateVacantRoomCodeAndOwnerInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/vacantRoom/updateOwner2', body);
  }
  // 业主添加
  public  addRoomCodeAndOwnerInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/owner/addOwner', body);
  }
  // 业主修改
  public  updateRoomCodeAndOwnerInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/owner/updateOwner', body);
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
  // 业主信息导出
  public  downloadOwnerInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/excel/owner', body);
  }
  // 新系统缴费记录
  public  getNewSystemChargeItemToatal(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/chart/nowChart', body);
  }
  // 当年缴费记录
  public  getYearChargeItemToatal(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/chart/yearChart', body);
  }
  // 总的缴费记录
  public  getTotalChargeItemToatal(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/chart/totalChart', body);
  }

 // 空置房导出
  public  importFileOfVacantRoom(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/excel/vacantRoom', body);
  }
}
