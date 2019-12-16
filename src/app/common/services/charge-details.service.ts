import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChargeDetailsService {

  constructor(
    private http: HttpClient
  ) { }
  public  queryChargeDataPage(pamars): Observable<any> {
      return this.http.post(environment.chargeUrl + `/bills/findBillPage`, pamars);
  }
  public  getPayDocument(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/cash/register/printBilles`, pamars);
  }
  public  importPayDocument(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/cash/register/importOldBills`, pamars);
  }
  public  queryBillDetail(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/bills/find_bill_detail`, pamars);
  }

  public  deleteBillDetail(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/bills/delete`, pamars);
  }

 // 更新车位
  public  updateParkspaceInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/bills/update_parking_space_bill_detail`, pamars);
  }

  // 项目明细
  public  updateChargeItemInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/bills/update_bill_detail`, pamars);
  }

  // 更新单据详情信息
  public  updateChargeBasicInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/bills/update_bill`, pamars);
  }
}
