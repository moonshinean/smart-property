import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RefundService {

  constructor(private http: HttpClient) { }
  /**
   *  退款信息模块
   * @param pamars
   */
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

  /**
   *  未退款模块
   * @param pamars
   */
  public  queryRefundNoInfoPage(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/refund/findNotByPage`, pamars);
  }
  public applicationRefund(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl  + `/refund/application`, pamars);
  }

  /**
   *  已退款模块
   * @param pamars
   */
  public queryRefundAlreadyPageInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +  `/refund/findAlreadyByPage`, pamars);
  }
  /**
   * 退款申请模块
   * @param pamars
   */
  public  queryRefundApplicationInfoPage(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/refund/findApplicationByPage`, pamars);
  }

  /**
   * 退款初审模块
   * @param pamars
   */
  public queryRefundAuditedPageInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +  `/refund/findApplicationByWaitAuditPage`, pamars);
  }
  public passRefundAudited(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +  `/refund/preliminaryExaminationPass`, pamars);
  }
  public  RefundNoPassStatus(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/refund/examineNoPass`, pamars);
  }


  /**
   * 退款复审
   * @param pamars
   */
  public queryRefundPendPageInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +  `/refund/findApplicationByWaitReviewPage`, pamars);
  }
  public paasRefundAuditedInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +  `/refund/reviewPass`, pamars);
  }
  public RefundNoPaasAudited(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +  `/refund/examineNoPass`, pamars);
  }
}