import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rbi-main-statis',
  templateUrl: './main-statis.component.html',
  styleUrls: ['./main-statis.component.less']
})
export class MainStatisComponent implements OnInit {

  public Bardata: any;
  public Bartitle: any;

  public piedata: any;
  public barData = [];
  public eventlist: any;

  constructor() {
  }

  ngOnInit() {
    for (let i = 0; i < 7; i++) {

      const data = Math.random() * 500;
      this.barData.push(data);
    }
    this.Bardata = [
      {value: 335, name: '装修巡检'},
      {value: 310, name: '治安巡检'},
      {value: 274, name: '卫生巡检'},
      {value: 235, name: '其它巡检'},
      {value: 400, name: '设备巡检'}
    ];
    this.Bartitle = ['设备巡检', '装修巡检', '治安巡检', '卫生巡检', '其它巡检'];
    this.piedata = {
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      barData: this.barData,
      lineData: ['600', '600', '600', '600', '600', '600', '600'],
    };
    this.eventlist = [
      {title: '15栋A3业主xxx缴费成功'},
      {title: '编号152员工需要援助'},
      {title: '15栋A3业主xxx缴费成功'},
      {title: '5栋7单元防火装置修理完成'},
      {title: '编号152员工需要援助'},
      {title: '编号152员工需要援助'},
      {title: '编号152员工需要援助'},
    ];
  }
  public refresh(e): void {
    console.log(e);
  }
}

