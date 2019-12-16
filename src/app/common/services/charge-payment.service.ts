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
  // 费用拆分
  public  getCostSplitBill(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/cash/register/cost_split`, pamars);
  }

  // 根据房间查看所有的客户信息
  public  getUserInfoByRoomCode(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/owner/findCustomerByRoomCode`, pamars);
  }
  // 根据房间查看所有的客户信息
  public  getTotalBalace(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/cash/register/expense_deduction_re_sum`, pamars);
  }
  // 导入旧账单
  public importOldBills(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/cash/register/importOldBills`, pamars);
  }
  // 查树结构
  public getRoomTree(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/parkingSpaceManagement/findParkingCode`, pamars);
  }

  // 车位办理
  public setRoomCodeBindParkSpace(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/parkingSpaceManagement/add`, pamars);
  }

//  计算租赁车位费用
  public calculateRentalPackSpaceFree(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/cash/register/calculate_parking_space_rental_fee`, pamars);
  }

  // 车位办理信息文件导入
  public importFilesWithParkSpaceInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/parkingSpaceManagement/excelImport`, pamars);
  }


}
