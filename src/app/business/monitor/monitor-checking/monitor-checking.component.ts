import { Component, OnInit } from '@angular/core';
import {MonitorCheckingService} from '../../../common/services/monitor-checking.service';

@Component({
  selector: 'rbi-monitor-checking',
  templateUrl: './monitor-checking.component.html',
  styleUrls: ['./monitor-checking.component.less']
})
export class MonitorCheckingComponent implements OnInit {

  constructor(
    private monitorCheckSrv: MonitorCheckingService
  ) { }

  ngOnInit() {
  }

}
