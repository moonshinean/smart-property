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

  public Bardata: any[] = [];
  public Bartitle: any[] = [];

  public piedata: any;
  public barData = [];
  public themeBarColor: any;
  public themePieColor: any;
  // 小区
  public village: any;
  public chargrType = '应收金额';
  // 小区下拉框
  public villageOption: any[] = [];
  // 按钮
  public btnList = [
    {label: '应收金额', bgcolor: '#0A7C79', top: '16vh'},
    {label: '实收金额', bgcolor: '#31C5C0', top: '22vh'}
  ];
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
    this.villageChange();

    // this.Bardata = [
    //   {value: 234, name: '设备巡检'},
    //   {value: 34, name: '装修巡检'},
    //   {value: 134, name: '治安巡检'},
    //   {value: 224, name: '卫生巡检'},
    //   {value: 1234, name: '其它巡检'}
    // ];
    // this.Bartitle = ['设备巡检', '装修巡检', '治安巡检', '卫生巡检', '其它巡检'];
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

  public  villageChange(): void {
       this.mainSrv.getVillageInfo({}).subscribe(val => {
         if (val.status === '1000') {
           val.data.forEach( (v, index) => {
             if (index === 0) {
               this.village = v.villageCode;
             }
             this.villageOption.push({label: v.villageName, value: v.villageCode});
           });
           this.getChargeDataForPie();
         } else {
            this.toolSrv.setToast('error', '请求错误', val.message);
         }
       });
  }

  public  btnChangeClick(index): void {
      this.btnList.forEach(val => {
          val.bgcolor = '#31C5C0';
          // val.bgcolor = '#31C5C0';
      });
      this.btnList[index].bgcolor = '#0A7C79';
      this.chargrType = this.btnList[index].label;
      // console.log(this.Bardata);
    // this.Bardata = [
    //   {value: 1234, name: '设备巡检'},
    //   {value: 234, name: '装修巡检'},
    //   {value: 334, name: '治安巡检'},
    //   {value: 2224, name: '卫生巡检'},
    //   {value: 134, name: '其它巡检'}
    // ];
      this.getChargeDataForPie();
  }

  public  getChargeDataForPie(): void {
      this.mainSrv.getChargeTypeDataInfo({villageCode: this.village}).subscribe(val => {
        console.log(val);
         if (val.status === '1000') {
           this.Bardata = [];
           val.data.forEach(v => {
             if (this.chargrType === '应收金额') {
               this.Bardata.push({value: v.amountReceivable, name: v.chargeName});
             } else {
               this.Bardata.push({value: v.actualMoneyCollection, name: v.chargeName});
             }
           });
           this.toolSrv.setToast('success', '请求成功', val.message);
         } else {
           this.toolSrv.setToast('error', '请求错误', val.message);
         }
      });
  }
}

