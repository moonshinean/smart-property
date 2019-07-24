import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChargeExportService {

  constructor(
    private http: HttpClient
  ) { }
  public  queryChargeReportPage(pamars): Observable<any> {
      return this.http.post(environment.chargeUrl + `/report/findDataByPage`, pamars);
  }
  public  querySetChargeReportInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/report/findCriteriaByReportCode`, pamars);
  }
  public  queryChargeReportTypeInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/report/findReport`, pamars);
  }
  public  queryGetReportInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/report/generatingReport`, pamars);
  }
}
