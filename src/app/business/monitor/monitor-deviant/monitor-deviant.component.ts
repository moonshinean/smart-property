import { Component, OnInit } from '@angular/core';
import {MonitorDeviantService} from '../../../common/services/monitor-deviant.service';

@Component({
  selector: 'rbi-monitor-deviant',
  templateUrl: './monitor-deviant.component.html',
  styleUrls: ['./monitor-deviant.component.less']
})
export class MonitorDeviantComponent implements OnInit {

  constructor(
    private monitorDeviantSrv: MonitorDeviantService
  ) { }

  ngOnInit() {
  }

}
