import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {ModifyRefundInfo} from '../../../common/model/refund-info.model';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {RefundService} from '../../../common/services/refund.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'rbi-refund-audited',
  templateUrl: './refund-audited.component.html',
  styleUrls: ['./refund-audited.component.less']
})
export class RefundAuditedComponent implements OnInit, OnDestroy {
  public refundAuditeTableTitle: any;
  public refundAuditeTableContent: any[];
  public refundAuditeTableTitleStyle: any;
  public refundAuditeSelect: any;
  // 添加相关
  public refundAuditeDetail: ModifyRefundInfo = new ModifyRefundInfo();
  // 详情相关
  public refundStatusDetail: any;
  public paymentTypeDetail: any;
  public refundAuditeDetailDialog: boolean;
  public esDate: any;
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  public loadingHide = true;
  public nowPage = 1;
  public SearchOption = {
    village: [],
    region: [],
    building: [],
    unit: [],
    room: [],
  };

  public couponSelectOption: any[] = [];
  public roonCodeSelectOption: any[] = [];
  public couponTypeName: any;
  public couponMoney: any;
  public couponEffectiveTime: any;
  // 搜索相关
  public SearchData = {
    villageCode: '',
    regionCode: '',
    buildingCode:  '',
    unitCode: '',
    roomCode: '',
    mobilePhone: '',
    idNumber: '',
    surname: '',
    pageNo: 1,
    pageSize: 10
  };
  public searchOption = [
    {label: '手机号', value: 1},
    {label: '房间号', value: 2},
    {label: '姓名', value: 3},
    {label: '身份证号', value: 4},
  ];
  public searchType = 0;
  public searchData = '';
  // 树结构订阅
  public refundSub: Subscription;
  constructor(
    private refundAuditeSrv: RefundService,
    private toolSrv: PublicMethedService,
  ) {
  }

  ngOnInit() {
    this.esDate = this.toolSrv.esDate;
    this.refundAuditeInitialization();
  }
  ngOnDestroy(): void {
    this.refundSub.unsubscribe();
  }

  // initialization houseinfo
  public refundAuditeInitialization(): void {
    this.refundAuditeTableTitle = [
      {field: 'roomCode', header: '房间代码'},
      {field: 'surname', header: '客户名称'},
      {field: 'mobilePhone', header: '客户电话'},
      {field: 'effectiveTime', header: '有效时长'},
      {field: 'money', header: '金额'},
      {field: 'operating', header: '操作'}
    ];
    this.loadingHide = false;
    this.refundAuditeSrv.queryRefundAuditedPageInfo({pageNo: this.nowPage, pageSize: 10}).subscribe(
      (value) => {
        this.loadingHide = true;
        if (value.status === '1000') {
          this.refundAuditeTableContent = value.data.contents;
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        } else {
          this.toolSrv.setToast('error', '请求失败', value.message);
        }
      }
    );
    this.refundAuditeTableTitleStyle = {background: '#282A31', color: '#DEDEDE', height: '6vh'};
/*    this.globalSrv.queryVillageInfo({}).subscribe(
      (data) => {
        data.data.forEach( v => {
          this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
          // = v.villageName;
        });
        // this.villageplaceholder =  this.SearchOption.village[0].label;
      }
    );*/
  }

/*  public  VillageChange(e): void {

    this.SearchOption.region = [];
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.globalSrv.queryRegionInfo({villageCode: e.value}).subscribe(
      (value) => {
        value.data.forEach( v => {
          this. SearchOption.region.push({label: v.regionName, value: v.regionCode});
        });
      }
    );
  }
  public  regionChange(e): void {
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.globalSrv.queryBuilingInfo({regionCode: e.value}).subscribe(
      (value) => {
        value.data.forEach( v => {
          this. SearchOption.building.push({label: v.buildingName, value: v.buildingCode});
        });
      }
    );
  }
  public  buildingChange(e): void {

    this.SearchOption.unit = [];
    this.globalSrv.queryunitInfo({buildingCode: e.value}).subscribe(
      (value) => {
        value.data.forEach( v => {
          this. SearchOption.unit.push({label: v.unitName, value: v.unitCode});
        });
      }
    );
  }
  public  unitChange(e): void {
    this.roonCodeSelectOption = [];
  }*/

  // condition search click
  // public refundAuditeSearchClick(): void {
  //   console.log('这里是条件搜索');
  // }

  // detail refundAuditeInfo
  public refundAuditeDetailClick(e): void {
    this.refundAuditeDetail = e;
    // this.toolSrv.getAdminStatus('ARREARS_STATUS', (data) => {
    //   if (data.length > 0) {
    //       data.forEach( v => {
    //       if (this.refundAuditeDetail.refundStatus.toString() === v.settingCode) {
    //         this.refundStatusDetail = v.settingName;
    //       }
    //     });
    //   }
    // });
    // this.toolSrv.getAdminStatus('CHARGE_TYPE', (data) => {
    //   if (data.length > 0) {
    //     data.forEach( v => {
    //       if (this.refundAuditeDetail.refundStatus.toString() === v.settingCode) {
    //         this.refundStatusDetail = v.settingName;
    //       }
    //     });
    //   }
    // });
    this.refundAuditeDetailDialog = true;
  }
  // paging query
  public nowpageEventHandle(event: any): void {
    this.loadingHide = false;
    this.nowPage = event;
    this.refundAuditeSrv.queryRefundAuditedPageInfo({pageNo: event, pageSize: 10}).subscribe(
      (value) => {
        this.loadingHide = true;
        if (value.status === '1000') {
          this.refundAuditeTableContent = value.data.contents;
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        } else {
          this.toolSrv.setToast('error', '查询失败', value.message);
        }
      }
    );
    this.refundAuditeSelect = [];
  }
  // Reset data
  public clearData(): void {
    this.couponTypeName = null;
    this.couponMoney = null;
    this.couponEffectiveTime = null;
    this.SearchOption = {
      village: [],
      region: [],
      building: [],
      unit: [],
      room: [],
    };
    this.couponSelectOption = [];
    this.roonCodeSelectOption = [];
  }


}
