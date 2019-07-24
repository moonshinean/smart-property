import {Component, OnInit} from '@angular/core';
import {HomeService} from '../../common/services/home.service';
import {NavigationEnd, Router} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'rbi-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.less']
})
export class BreadcrumbComponent implements OnInit {
  public breadDatas = {
    main: ['首页', ''],
    toll: ['基础信息', '收费项目'],
    owner: ['基础信息', '业主资料'],
    vehicle: ['基础信息', '车辆信息'],
    workgroup: ['基础信息', '工作组'],
    staff: ['基础信息', '员工档案'],
    deviceinfo: ['基础信息', '设备信息'],
    projectinfo: ['基础信息', '项目信息'],
    qrcode: ['基础信息', '二维码信息'],
    details: ['收费管理', '费用详情'],
    record: ['收费管理', '退款记录'],
    export: ['收费管理', '报表导出'],
    assocstaff: ['关联设置', '员工分组'],
    log: ['事件监控', '日志监视'],
    deviant: ['事件监控', '异常管理'],
    complaint: ['事件监控', '投诉管理'],
    check: ['投诉管理', '巡检记录'],
    carkind: ['系统设置', '车辆种类'],
    carbrand: ['系统设置', '车辆品牌'],
    nation: ['系统设置', '民族管理'],
  };
  public routerName: any = null;
  constructor(
    private homeSrv: HomeService,
    private router: Router,
    private location: Location,
  ) { }

  ngOnInit() {
    this.routerName = this.urlSplitTool(this.location.path());
    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd) {
          this.routerName = this.urlSplitTool(event.urlAfterRedirects);
        }
      }
    );
  }
  public urlSplitTool(url): any {
    const urla = url.split('?');
    const urlb = urla[0].split('/');
    const urlLength = urlb.length;
    return urlb[urlLength - 1];
  }
}
