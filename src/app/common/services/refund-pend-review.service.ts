import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RefundPendReviewService {
  constructor(private http: HttpClient) { }
  public queryRefundAuditedPageInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +  `/refund/findApplicationByWaitReviewPage`, pamars);
  }
  public paasRefundAuditedInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +  `/refund/reviewPass`, pamars);
  }
  public RefundNoPaasAudited(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +  `/refund/examineNoPass`, pamars);
  }
  public queryRefundStatus(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/setting/findAdminChoose`, pamars);
  }
}
