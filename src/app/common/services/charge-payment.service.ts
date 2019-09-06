import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChargePaymentService {

  constructor(
    private http: HttpClient
  ) { }
  // 分页查询，初始化数据
  public  searchPaymentData(pamars): Observable<any> {
      return this.http.post(environment.chargeUrl + `/cash/register/findHousePage`, pamars);
  }
  // 查询收费项目
  public  searchChargeItem(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/cash/register/findChargeItem`, pamars);
  }
  // 查询收费项目详情列表
  public searchChargeItemDetail(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/cash/register/findCost`, pamars);
  }
  public  addPayOrder(pamars): Observable<any> {
      return this.http.post(environment.chargeUrl + `/cash/register/addBill`, pamars);
  }
  // 打印单据
  public  getPayDocument(pamars): Observable<any> {
     return this.http.post(environment.chargeUrl + `/cash/register/printBilles`, pamars);
  }

  // 导入旧账单
  public importOldBills(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/cash/register/importOldBills`, pamars);
  }
}
