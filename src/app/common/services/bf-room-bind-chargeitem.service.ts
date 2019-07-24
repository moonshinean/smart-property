import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BfRoomBindChargeitemService {

  constructor(private http: HttpClient) { }
  public  queryRoomChangeInfoPage(pamars): Observable<any> {
      return this.http.post(environment.chargeUrl +   `/base/config/findRoomAndChargeItemByPage`, pamars);
  }
  public  addRoomChangeInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +   `/base/config/addChargeItemAndRoom`, pamars);
  }
  public  deleteRoomChangeInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +   `/base/config/deleteRoomAndChargeItem`, pamars);
  }
  public updateRoomChangeInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +   `/base/config/updateRoomAndChargeItem`, pamars);
  }
  public queryRoomChangeInfoById(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +   `/base/config/findChargeItemByOrganizationId`, pamars);
  }
}
