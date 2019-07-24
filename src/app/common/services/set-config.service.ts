import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SetConfigService {

  constructor(
    private http: HttpClient
  ) { }
  public  querySetPage(pamars): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/setting/findByPage', pamars);
  }
  public  addSet(pamars): Observable<any> {
      return this.http.post(environment.sysetUrl + '/setting/add', pamars);
  }
  public delectSet(pamars): Observable<any> {
      return this.http.post(environment.sysetUrl + '/setting/deleteById', pamars);
  }
  public  deletemoreSet(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + '/setting/deleteByIds', pamars);

  }
  public  querySetById(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + '/setting/findById', pamars);
  }
  public  updateSet(pamars): Observable<any> {
      return this.http.post(environment.sysetUrl + '/setting/update', pamars);
  }
  public  getSetType(pamars): Observable<any> {
      return this.http.post(environment.sysetUrl + '/setting/findSettingType', pamars);
  }
}
