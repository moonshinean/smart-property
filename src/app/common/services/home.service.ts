import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(
    private http: HttpClient
  ) { }
  public  getChildrenRouter(pamars): Observable<any> {
      return this.http.post(environment.loginUrl + '/permission/findByParentCode', pamars);
  }
}
