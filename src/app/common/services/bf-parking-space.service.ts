import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BfParkingSpaceService {

  constructor(
    private http: HttpClient
  ) { }
  public  queryParkingSpace(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +  `/parkingSpace/findParkingAllByPage`, pamars);
  }
  public  addParkingSpace(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +  `/parkingSpace/add`, pamars);
  }
  public  updateParkingSpace(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +  `/parkingSpace/update`, pamars);
  }
  public  daleteParkingSpace(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +  `/parkingSpace/deleteByIds`, pamars);
  }
  // 上传文件
  public  importFileWithParkSpace(body): Observable<any> {
    return  this.http.post(environment.chargeUrl + '/parkingSpace/import', body);
  }
 // 条件查询
  public  queryParkingSpaceByCode(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl +  `/parkingSpace/findByParkingSpaceCodePage`, pamars);
  }

}
