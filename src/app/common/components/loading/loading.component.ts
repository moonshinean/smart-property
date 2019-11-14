import {Component, Input, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {AppState} from '../../../store/loadstatus.state';

@Component({
  selector: 'rbi-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.less']
})
export class LoadingComponent implements OnInit {

  // @Input() loadHidden = false;
  public data: any;

  count$: Observable<boolean>;

  constructor(private store: Store<AppState>) {
    this.count$ = store.pipe(select('loadhidden'));
  }
  ngOnInit(): void {
    this.count$.subscribe(value => {
      console.log(value);
    });
  }

}
