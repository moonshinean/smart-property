import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BfStaffService {

  constructor(private http: HttpClient) { }
  public queryStaffInfoPage(pamars): Observable<any> {
      return this.http.post(environment.sysetUrl + `/user/findByPage`, pamars);
  }
  public addStaffInfo(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/user/add`, pamars);
  }
  public updateStaffInfo(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/user/update`, pamars);
  }
  public deleteStaffInfo(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/user/deleteByIds`, pamars);
  }
  public queryDepartTree(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/department/choosePid2`, pamars);
  }
  public queryStaffStatus(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/setting/findAdminChoose`, pamars);
  }
  public queryStaffInfoByRealName(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/user/findByName`, pamars);
  }
  public staffResetPassword(pamars): Observable<any>  {
      return this.http.post(environment.sysetUrl + `/user/resetPassword`, pamars);
  }
}
