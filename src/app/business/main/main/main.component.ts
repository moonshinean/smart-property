import { Component, OnInit } from '@angular/core';
import {MainService} from '../../../common/services/main.service';

@Component({
  selector: 'rbi-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {

  constructor(
    private mainSrv: MainService
  ) { }

  ngOnInit() {
  }

}
