import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersionalService {

  constructor(private http: HttpClient) {
  }
  public  getUserInfo(): Observable<any> {
    return this.http.post(environment.loginUrl + `/user/findByUserId`, {});
  }
  public  updateUserInfo(pamars): Observable<any> {
    return this.http.post(environment.loginUrl + `/user/update`, pamars);
  }
  public  updatePasswordInfo(pamars): Observable<any> {
    return this.http.post(environment.loginUrl + `/user/updatePassword`, pamars);
  }
  public queryStaffStatus(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/setting/findAdminChoose`, pamars);
  }
}
