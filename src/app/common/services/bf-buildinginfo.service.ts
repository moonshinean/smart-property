import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GlobalService} from './global.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BfBuildinginfoService {

  constructor(
    private http: HttpClient,
  ) { }
  // 查询
  public  SearchBuildinfo(params): Observable<any> {
    return this.http.post(`/BuildingData.php`, params);
  }
  // 增加
  public addItem(params): Observable<any> {
    console.log(params);
    return this.http.post('', params);
    // return ;
  }
}
