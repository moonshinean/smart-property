import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class LatePaymentService {

  constructor(
    private http: HttpClient
  ) { }

  public  uploadFile(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + '/liquidated/damages/batch/processing', pamars);
  }
  public  queryLatePaymentPageData(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + '/liquidated/damages/findByPage', pamars);
  }
}
