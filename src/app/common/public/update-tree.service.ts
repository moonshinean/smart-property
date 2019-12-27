import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateTreeService {
  constructor() {
  }
  // Observable string sources
  emitChangeSource = new Subject<any>();
  // Observable string streams
  changeEmitted$ = this.emitChangeSource.asObservable();
  // Service message commands
  public emitChangeTheme(change: any): void {
    this.emitChangeSource.next(change);
  }
}
