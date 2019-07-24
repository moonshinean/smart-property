import { Component, OnInit } from '@angular/core';
import {MonitorComplaintService} from '../../../common/services/monitor-complaint.service';

@Component({
  selector: 'rbi-monitor-complaint',
  templateUrl: './monitor-complaint.component.html',
  styleUrls: ['./monitor-complaint.component.less']
})
export class MonitorComplaintComponent implements OnInit {

  constructor(
    private monitorComplaintSrv: MonitorComplaintService
  ) { }

  ngOnInit() {
  }

}
