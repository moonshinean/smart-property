import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SetPartService {

  constructor(
    private http: HttpClient
  ) { }
  public  queryPartPageData(pamars): Observable<any> {
      return this.http.post(environment.loginUrl + `/role/findByOrganizationIdAndPage`, pamars);
  }
  public  addPart(pamars): Observable<any> {
    return this.http.post(environment.loginUrl + `/role/add`, pamars);
  }
  public  updatePart(pamars): Observable<any> {
    return this.http.post(environment.loginUrl + `/role/update`, pamars);
  }
  public deletePart(pamars): Observable<any> {
    return this.http.post(environment.loginUrl + `/role/deleteByIds`, pamars);
  }
}
