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
  public  updateLatePayment(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + '/liquidated/damages/update', pamars);
  }

  /**
   * 待审核模块
   */
  public  queryLatePaymentReviewPageData(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + '/liquidated/damages/findByWaitAuditPage', pamars);
  }


  /**
   * 待复审模块
   */
  public  queryLatePaymentPendReviewPageData(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + '/liquidated/damages/findByWaitReviewPage', pamars);
  }
  public  reviewLatePaymentAgainPass(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + '/liquidated/damages/reviewPass', pamars);
  }

  /**
   * 审核拒绝模块
   */
  public  queryLatePaymentNoPassPageData(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + '/liquidated/damages/findByNotPassPage', pamars);
  }

  /**
   * 审核通过模块
   */
  public  queryLatePaymentAlreadyPageData(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + '/liquidated/damages/findByAlreadyAuditPage', pamars);
  }
  public  reviewLatePaymentPass(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + '/liquidated/damages/auditPass', pamars);
  }
  /**
   * 公共模块
   */
  public  reviewLatePaymentNoPass(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + '/liquidated/damages/noPass', pamars);
  }

}
