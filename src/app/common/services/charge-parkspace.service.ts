import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChargeParkspaceService {

  constructor(private http: HttpClient) { }
  public queryChargeParkSpacePageInfo(pamars): Observable<any> {
      return this.http.post(environment.chargeUrl + `/parkingSpaceManager/findByPage`, pamars);
  }
  public addChargeParkSpaceTolList(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/parkingSpaceManager/add`, pamars);
  }
  public queryParkSpaceExpireDate(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/parkingSpaceManager/findParkingSpaceDueTime`, pamars);
  }
  public calculateCost(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/parkingSpaceManager/calculationCost`, pamars);
  }
  public queryParkSpaceCodeByRegionCode(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/parkingSpaceManager/findParkingSpaceCodeByRegionCode`, pamars);
  }
  public queryCarInfoByRoomCode(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/parkingSpaceManager/findLicensePlateNumberByRoomCode`, pamars);
  }
  public queryChargeItem(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/parkingSpaceManager/findChargeItem`, pamars);
  }
  public quertyUserInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +  `/refund/findCustomerByPhone`, pamars);
  }
  public quertyChargeInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +  `/parkingSpaceManager/findChargeItem`, pamars);
  }
  public queryRefundStatus(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/setting/findAdminChoose`, pamars);
  }
  public  queryVehicleAllType(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/setting/findNativeChoose', body);
  }
}
