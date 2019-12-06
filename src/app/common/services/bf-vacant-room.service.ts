import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BfVacantRoomService {

  constructor(
    private http: HttpClient
  ) {}
  public  queryVacantRoomPageData(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/vacantRoom/findRoomAllByPage`, pamars);
  }
}
