import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SetRoleService {

  constructor(
    private http: HttpClient
  ) {
  }
  public queryRoleList(parmas): Observable<any> {
    return this.http.post(environment.loginUrl + `/permit/config/findUserAndRolePage`, parmas);
  }
  public  queryUserInfo(parmas): Observable<any> {
    return this.http.post(environment.loginUrl + '/permit/config/findUserInfoByOrganizationId', parmas);
  }
  public  queryRoleInfo(parmas): Observable<any> {
    return this.http.post(environment.loginUrl + '/permit/config/findRoleByOrganizationId', parmas);
  }
  public  addUserRole(pamars): Observable<any> {
      return this.http.post(environment.loginUrl + `/permit/config/addUserInfoAndRole`, pamars);
  }
  public  deleteUserInfo(pamars): Observable<any> {
      return this.http.post(environment.loginUrl + `/permit/config/deleteUserAndRoleByIds`, pamars);
  }
 public  queryUserRole(pamars): Observable<any> {
     return this.http.post(environment.loginUrl + `/permit/config/findRoleByUserId`, pamars);
 }
//  登录日志
  public  queryLoginLog(pamars): Observable<any> {
    return this.http.post(environment.loginUrl + `/findLoginLogByOrganizationId`, pamars);
  }
}
