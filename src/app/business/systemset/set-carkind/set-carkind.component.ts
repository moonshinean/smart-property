import { Component, OnInit } from '@angular/core';
import {SetCarbrandService} from '../../../common/services/set-carbrand.service';
import {SetCarkindService} from '../../../common/services/set-carkind.service';

@Component({
  selector: 'rbi-set-carkind',
  templateUrl: './set-carkind.component.html',
  styleUrls: ['./set-carkind.component.less']
})
export class SetCarkindComponent implements OnInit {

  constructor(
    private setCarKindSrv: SetCarkindService
  ) { }

  ngOnInit() {
  }

}
