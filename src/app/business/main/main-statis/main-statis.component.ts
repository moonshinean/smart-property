import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ThemeService} from '../../../common/public/theme.service';
import {MainService} from '../../../common/services/main.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';

@Component({
  selector: 'rbi-main-statis',
  templateUrl: './main-statis.component.html',
  styleUrls: ['./main-statis.component.less']
})
export class MainStatisComponent implements OnInit, OnDestroy {

  public Bardata: any;
  public Bartitle: any;

  public piedata: any;
  public barData = [];
  public themeBarColor: any;
  public themePieColor: any;
  public eventlist: any[] = [];
  public statisSub: Subscription;
  constructor(
    private mainSrv: MainService,
    private toolSrv: PublicMethedService,
    public themeSrv: ThemeService
  ) {
    this.statisSub = this.themeSrv.changeEmitted$.subscribe(
      value => {
        this.themeBarColor = value.main.bar;
        this.themePieColor = value.main.pie;
      }
    );
  }

  ngOnInit() {
    if ( this.themeSrv.setTheme !== undefined) {
      this.themeBarColor = this.themeSrv.setTheme.main.bar;
      this.themePieColor = this.themeSrv.setTheme.main.pie;
    }
    this.queryEventData();
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

  }
  ngOnDestroy(): void {
    this.statisSub.unsubscribe();
  }
  public  queryEventData(): void {
    this.mainSrv.getEvent({pageNo: 1, pageSize: 25}).subscribe(
      value => {
        if (value.status === '1000') {
          this.eventlist = value.data.contents.map(v => {
            return {title: v.eventDescripte};
          });
        }
      });
  }
}

