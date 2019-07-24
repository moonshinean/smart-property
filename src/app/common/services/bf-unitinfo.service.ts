import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BfUnitinfoService {

  constructor(
    private http: HttpClient
  ) { }
  // 查询
  public  SearchUnitinfo(pamars): Observable<any> {
      return this.http.post('/UnitinfoData.php', pamars);
  }
}
