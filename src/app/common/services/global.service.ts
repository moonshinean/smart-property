import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  constructor(
    private http: HttpClient
  ) { }
  // search villageInfo
  public  queryVillageInfo(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/structure/findByOrganizationId`, pamars);
  }
  // search regioninfo
  public queryRegionInfo(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/structure/findByVillageCode`, pamars);
  }
  // search Builinginfo
  public  queryBuilingInfo(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/structure/findByRegionCode`, pamars);
  }
  //  search unitinfo
  public  queryunitInfo(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/structure/findByBuildingCode`, pamars);
  }
  // search roomCode
  public queryRoomCode(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/structure/findByUnitCode `, pamars);
  }
}
