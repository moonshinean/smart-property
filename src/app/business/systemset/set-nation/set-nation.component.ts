import { Component, OnInit } from '@angular/core';
import {SetNationService} from '../../../common/services/set-nation.service';

@Component({
  selector: 'rbi-set-nation',
  templateUrl: './set-nation.component.html',
  styleUrls: ['./set-nation.component.less']
})
export class SetNationComponent implements OnInit {

  constructor(
    private setNationSrv: SetNationService
  ) { }

  ngOnInit() {
  }

}
