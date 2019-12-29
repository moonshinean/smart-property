import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor(private http: HttpClient) { }
  public  getUserInfo(): Observable<any> {
    return this.http.post(environment.loginUrl + `/user/findByUserId`, {});
  }
}
