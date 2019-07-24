import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RefundAlreadyService {

  constructor(private http: HttpClient) { }
  public queryRefundAlreadyPageInfo(pamars): Observable<any> {
      return this.http.post(environment.chargeUrl +  `/refund/findAlreadyByPage`, pamars);
  }
  public queryRefundAlreadyStatus(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl +  `/setting/findAdminChoose`, pamars);
  }
}
