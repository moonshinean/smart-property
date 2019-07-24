import { Component, OnInit } from '@angular/core';
import {MonitorComplaintService} from '../../../common/services/monitor-complaint.service';
import {MonitorLogService} from '../../../common/services/monitor-log.service';

@Component({
  selector: 'rbi-monitor-log',
  templateUrl: './monitor-log.component.html',
  styleUrls: ['./monitor-log.component.less']
})
export class MonitorLogComponent implements OnInit {

  constructor(
    private monitorLogSrv: MonitorLogService
  ) { }

  ngOnInit() {
  }

}
