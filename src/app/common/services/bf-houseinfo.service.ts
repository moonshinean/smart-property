import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BfHouseinfoService {

  constructor(
    private http: HttpClient
  ) { }
  // 查询信息
  public  SearchHouseinfo(pamars): Observable<any> {
    return this.http.post('/HouseinfoDta.php', pamars);
  }
}
