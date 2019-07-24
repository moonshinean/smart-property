import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RefundReviewService {

  constructor(private http: HttpClient) { }
  public queryRefundAuditedPageInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +  `/refund/findApplicationByWaitAuditPage`, pamars);
  }
  public passRefundAudited(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +  `/refund/preliminaryExaminationPass`, pamars);
  }
  public queryRefundStatus(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/setting/findAdminChoose`, pamars);
  }
  public  RefundNoPassStatus(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/refund/examineNoPass`, pamars);
  }
}
