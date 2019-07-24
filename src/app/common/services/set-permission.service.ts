import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SetPermissionService {

  constructor(
    private http: HttpClient
  ) { }
  // 分页查询
  public  queryPermissionData(pamars): Observable<any> {
      return this.http.post(environment.loginUrl + `/permit/config/findRoleAndPermitPage`, pamars);
  }
  // 查询角色名称
  public  queryRoleCodeCodeList(pamars): Observable<any> {
    return this.http.post(environment.loginUrl + `/permit/config/findRoleByOrganizationId`, pamars);

  }
  // 查询所有权限
  public  queryPerimitList(pamars): Observable<any>{
    return this.http.post(environment.loginUrl + `/permit/config/findPermitAll`, pamars);

  }
   // 新增角色权限
  public  addRolePerimit(pamars): Observable<any> {
    return this.http.post(environment.loginUrl + `/permit/config/addRoleAndPermit`, pamars);
  }
  // 删除角色权限
  public  deleteRolePerimit(pamars): Observable<any> {
      return this.http.post(environment.loginUrl + `/permit/config/deleteRoleAndPermitByIds`, pamars);
  }
  public  queryRolePermit(pamars): Observable<any> {
    return this.http.post(environment.loginUrl + `/permit/config/findPermitByRoleCode`, pamars);
  }
}
