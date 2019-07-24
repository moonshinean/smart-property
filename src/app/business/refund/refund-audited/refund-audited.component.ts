import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {GlobalService} from '../../../common/services/global.service';
import {RefundAuditedService} from '../../../common/services/refund-audited.service';
import {ModifyRefundInfo} from '../../../common/model/refund-info.model';

@Component({
  selector: 'rbi-refund-audited',
  templateUrl: './refund-audited.component.html',
  styleUrls: ['./refund-audited.component.less']
})
export class RefundAuditedComponent implements OnInit {


  @ViewChild('input') input: Input;
  // @ViewChild('file') file: Input;
  public refundAuditeTableTitle: any;
  public refundAuditeTableContent: any[];
  // public refundAuditeTableContent: any;
  public refundAuditeTableTitleStyle: any;
  public refundAuditeSelect: any;
  // 添加相关
  public refundAuditeAddDialog: boolean;
  public refundAuditeDetail: ModifyRefundInfo = new ModifyRefundInfo();

  // public couponAdd: any;
  // 修改相关
  public refundAuditeModifayDialog: boolean;
  // public couponModify: any;
  // 详情相关
  public refundStatusDetail: any;
  public paymentTypeDetail: any;
  public refundAuditeDetailDialog: boolean;
  public esDate = {
    firstDayOfWeek: 0,
    dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dayNamesMin: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    today: '今天',
    clear: '清除'
  };
  // 上传相关
  // public refundAuditeUploadFileDialog: boolean;
  // public uploadedFiles: any[] = [];
  // 其他相关
  public deleteIds: any[] = [];
  public cleanTimer: any; // 清除时钟
  public option: any;
  public loadingHide = true;
  public refundAuditeSeachData: any;
  // public SearchCoupon: SearchCoupon = new SearchCoupon();
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
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private refundAuditeSrv: RefundAuditedService,
    private globalSrv: GlobalService
  ) {
  }

  ngOnInit() {
    this.refundAuditeInitialization();
  }

  // initialization houseinfo
  public refundAuditeInitialization(): void {
    console.log('这里是信息的初始化');
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
        console.log(value);
        this.loadingHide = true;
        if (value.status === '1000') {
          this.refundAuditeTableContent = value.data.contents;
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        } else {
          this.setToast('error', '请求失败', value.message);
        }
      }
    );
    this.refundAuditeTableTitleStyle = {background: '#282A31', color: '#DEDEDE', height: '6vh'};
    this.globalSrv.queryVillageInfo({}).subscribe(
      (data) => {
        console.log(data);
        data.data.forEach( v => {
          this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
          // = v.villageName;
        });
        // this.villageplaceholder =  this.SearchOption.village[0].label;
      }
    );
  }

  public  VillageChange(e): void {

    this.SearchOption.region = [];
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.globalSrv.queryRegionInfo({villageCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach( v => {
          this. SearchOption.region.push({label: v.regionName, value: v.regionCode});
        });
      }
    );
  }
  public  regionChange(e): void {
    // this.SearchCoupon.regionCode = '';
    // this.SearchCoupon.buildingCode = '';
    // this.SearchCoupon.unitCode = '';
    // this.SearchCoupon.regionCode = e.value;
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    console.log(e.value);
    this.globalSrv.queryBuilingInfo({regionCode: e.value}).subscribe(
      (value) => {
        console.log(value);
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
        console.log(value);
        value.data.forEach( v => {
          this. SearchOption.unit.push({label: v.unitName, value: v.unitCode});
        });
      }
    );
  }
  public  unitChange(e): void {
    // this.SearchCoupon.unitCode = '';
    console.log(e);
    this.roonCodeSelectOption = [];
  }

  // condition search click
  public refundAuditeSearchClick(): void {
    // @ts-ignore
    // if (this.couponSeachData !== undefined ) {
    //   if (isNaN(this.couponSeachData)) {
    //     this.chargeCouponSrv.queryConditionalCoupon({}).subscribe(
    //       (value) => {
    //         console.log(value);
    //       }
    //     );
    //   } else {
    //     this.chargeCouponSrv.queryConditionalCoupon({}).subscribe(
    //       (value) => {
    //         console.log(value);
    //       }
    //     );
    //   }
    // }
    console.log('这里是条件搜索');
  }


  // detail refundAuditeInfo
  public refundAuditeDetailClick(e): void {
    this.refundAuditeDetail = e;
    this.refundAuditeSrv.queryRefundStatus({settingType: 'ARREARS_STATUS'}).subscribe(
      value => {
        if (value.data.length > 0) {
          value.data.forEach( v => {
            if (this.refundAuditeDetail.refundStatus.toString() === v.settingCode) {
              this.refundStatusDetail = v.settingName;
            }
          });
        }
      }
    );
    this.refundAuditeSrv.queryRefundStatus({settingType: 'CHARGE_TYPE'}).subscribe(
      value => {
        if (value.data.length > 0) {
          value.data.forEach( v => {
            if (this.refundAuditeDetail.paymentType.toString() === v.settingCode) {
              this.paymentTypeDetail = v.settingName;
            }
          });
        }
      }
    );
    this.refundAuditeDetailDialog = true;

    // this.refundAuditeSrv.queryCouponType({}).subscribe(
    //   val => {
    //     console.log(val);
    //     val.data.forEach( v => {
    //       if (e.couponType === v.settingCode) {
    //         this.couponTypeName = v.settingName;
    //       }
    //     });
    //   }
    // );
    console.log(e);
  }

  // modify refundAudite
  public refundAuditeModifyClick(): void {
    console.log(this.refundAuditeSelect);
    if (this.refundAuditeSelect === undefined || this.refundAuditeSelect.length === 0) {
      this.setToast('error', '操作错误', '请选择需要修改的项');

    } else if (this.refundAuditeSelect.length === 1) {
      this.refundAuditeModifayDialog = true;
      console.log('这里是修改信息');
    } else {
      this.setToast('error', '操作错误', '只能选择一项进行修改');

    }
  }

  // sure modify coupon
  public refundAuditeModifySureClick(): void {
    this.confirmationService.confirm({
      message: `确认要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(this.refundAuditeSelect);
        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
        console.log('这里是修改信息');

        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }
  // 分页请求
  public nowpageEventHandle(event: any): void {
    this.loadingHide = false;
    this.nowPage = event;
    this.refundAuditeSrv.queryRefundAuditedPageInfo({pageNo: event, pageSize: 10}).subscribe(
      (value) => {
        console.log(value);
        this.loadingHide = true;
        this.refundAuditeTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};

      }
    );
    this.refundAuditeSelect = [];
  }

  public  setToast(type, title, message): void {
    if (this.cleanTimer) {
      clearTimeout(this.cleanTimer);
    }
    this.messageService.clear();
    this.messageService.add({severity: type, summary: title, detail: message});
    this.cleanTimer = setTimeout(() => {
      this.messageService.clear();
    }, 3000);
  }
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
