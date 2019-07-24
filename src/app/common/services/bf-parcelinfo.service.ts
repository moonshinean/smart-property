import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BfParcelinfoService {

  constructor(
    private http: HttpClient
  ) { }
  // 查询
  public  SearchParcelInfo(pamars): Observable<any> {
    console.log(123);
    return this.http.post(`/parcelData.php`, pamars);
  }
}
