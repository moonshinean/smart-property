import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RefundInfoService {

  constructor(private http: HttpClient) {}
  public  queryRefundInfoPage(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +  `/refund/findByPage`, pamars);
  }
  public  addRefundInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +  `/refund/add`, pamars);
  }
  public updateRefundInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +  `/refund/update`, pamars);
  }
  public deleteRefundInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +  `/refund/delete`, pamars);
  }
  public quertyChargeInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +  `/refund/findChargeItem`, pamars);
  }
  public quertyUserInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +  `/refund/findCustomerByPhone`, pamars);
  }
  public queryRoomCode(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/structure/findByUnitCode `, pamars);
  }
  public queryRefundStatus(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/setting/findAdminChoose`, pamars);
  }

}
