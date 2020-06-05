import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChargeCumulativeVacancyfeeService {

  constructor(
    private http: HttpClient
  ) { }

  // 分页数据
  public  getCumulativeVacancyFeePageData(pamars): Observable<any> {
      return this.http.post(environment.chargeUrl + `/vacancy_fee/query_vacancy_fee_cumulative/page`, pamars);
  }
  // 文件导入
  public  importCumulativeVacancyFeeFile(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/vacancy_fee/import_vacancy_fee_cumulative`, pamars);
  }
}
