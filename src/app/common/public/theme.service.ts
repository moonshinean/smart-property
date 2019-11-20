import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public setTheme: any;
  constructor() {
    this.changeEmitted$.subscribe(value => {
      this.setTheme = value;
      console.log(this.setTheme);
    });
  }
  // Observable string sources
  emitChangeSource = new Subject<any>();
  // Observable string streams
  changeEmitted$ = this.emitChangeSource.asObservable();
  // Service message commands
  public emitChangeTheme(change: any): void {
    this.emitChangeSource.next(change);
  }
  public setThemeData(data): void {
    // this.emitChangeSource.next(change);
    this.setTheme = data;
    console.log(this.setTheme);
  }
}
