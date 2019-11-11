import {EventEmitter, Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {
  constructor() {
  }
  // Observable string sources
  private emitChangeSource = new Subject<any>();
  // Observable string streams
   changeEmitted$ = this.emitChangeSource.asObservable();
  // Service message commands
  public emitChange(change: any): void {
    this.emitChangeSource.next(change);
  }
}
