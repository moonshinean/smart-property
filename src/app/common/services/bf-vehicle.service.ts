import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BfVehicleService {

  constructor(private http: HttpClient) {}
  public  queryVehicleInfoPage(pamars): Observable<any> {
      return this.http.post(environment.chargeUrl + `/vehicle/findByPage`, pamars);
  }
  public  addVehicleInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/vehicle/add`, pamars);
  }
  public  updateVehicleInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/vehicle/update`, pamars);
  }
  public  deleteVehicleInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/vehicle/deleteByIds`, pamars);
  }
  public queryRoomCode(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/structure/findByUnitCode `, pamars);
  }
  public  queryVehicleAllType(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/setting/findNativeChoose', body);
  }
}
