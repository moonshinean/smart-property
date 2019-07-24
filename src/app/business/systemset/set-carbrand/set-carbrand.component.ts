import { Component, OnInit } from '@angular/core';
import {SetCarbrandService} from '../../../common/services/set-carbrand.service';

@Component({
  selector: 'rbi-set-carbrand',
  templateUrl: './set-carbrand.component.html',
  styleUrls: ['./set-carbrand.component.less']
})
export class SetCarbrandComponent implements OnInit {

  constructor(
    private setCarBrandSrv: SetCarbrandService
  ) { }

  ngOnInit() {
  }

}
