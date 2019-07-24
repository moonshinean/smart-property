import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor(private http: HttpClient) { }
  public  getUserInfo(): Observable<any> {
    return this.http.post(environment.loginUrl + `/user/findByUserId`, {});
  }
}
