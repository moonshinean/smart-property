import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginoutService {
  constructor(
    private http: HttpClient,
  ) { }
  public  logout(pamars): Observable<any> {
    return this.http.post( environment.loginUrl + `/logout`, pamars);
  }
}
