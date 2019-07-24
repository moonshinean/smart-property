import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {RefundInfoService} from '../../../common/services/refund-info.service';
import {GlobalService} from '../../../common/services/global.service';
import {RefundApplicationInfoService} from '../../../common/services/refund-application-info.service';
import {RefundApplicationInfo} from '../../../common/model/refund-applicationInfo.model';

@Component({
  selector: 'rbi-refund-application-info',
  templateUrl: './refund-application-info.component.html',
  styleUrls: ['./refund-application-info.component.less']
})
export class RefundApplicationInfoComponent implements OnInit {


  @ViewChild('input') input: Input;
  public applicationInfoTableTitle: any;
  public applicationInfoTableContent: any[];
  public applicationInfoTableTitleStyle: any;
  public applicationInfoSelect: any[];
  // 添加相关
  public applicationInfoAddDialog: boolean;
  public applicationInfoAdd: any;
  public  licensePlateColorOption: any[] = [];
  public  licensePlateTypeOption: any[] = [];
  public  applicationInfoOriginalTypeOption: any[] = [];
  // 修改相关
  public applicationInfoModifayDialog: boolean;
  public applicationInfoModify: any;
  public licensePlateColorModify: any;
  public licensePlateTypeModify: any;
  public applicationInfoOriginalTypeModify: any;
  // 详情相关
  public applicationInfoDetailDialog: boolean;
  public applicationInfoDetail: RefundApplicationInfo = new RefundApplicationInfo();
  public refundStatusDetail: any;
  public paymentTypeDetail: any;

  // public msgs: Message[] = []; // 消息弹窗
  public SearchOption = {
    village: [],
    region: [],
    building: [],
    unit: []
  };
  public deleteIds: any[] = [];
  public option: any;
  public loadHidden = true;
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public nowPage = 1;
  public roonCodeSelectOption: any[] = [];

  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private applicationInfoSrv: RefundApplicationInfoService,
    private globalSrv: GlobalService,
  ) {
  }

  ngOnInit() {
    this.applicationInfoInitialization();
  }

  // initialization applicationInfo
  public applicationInfoInitialization(): void {
    console.log('这里是信息的初始化');
    this.applicationInfoTableTitle = [
      {field: 'orderId', header: '订单Id'},
      {field: 'payerName', header: '缴费人姓名'},
      {field: 'paymentMethod', header: '支付方式'},
      {field: 'roomCode', header: '房间编号'},
      {field: 'chargeName', header: '项目名称'},
      {field: 'actualMoneyCollection', header: '实收金额'},
      {field: 'auditStatus', header: '审核状态'},
      {field: 'operating', header: '操作'},
    ];
    this.loadHidden = false;
    this.applicationInfoSrv.queryRefundStatus({settingType: 'AUDIT_STATUS'}).subscribe(
      value => {
        if (value.data.length > 0) {
          this.applicationInfoSrv.queryRefundApplicationInfoPage({pageNo: this.nowPage, pageSize: 10}).subscribe(
            val => {
              if (val.status === '1000') {
                this.loadHidden = true;
                console.log(val);
                val.data.contents.forEach( h => {
                  value.data.forEach( v => {
                    if (h.auditStatus.toString() === v.settingCode) {
                         h.auditStatus = v.settingName;
                    }
                  });
                });
                this.applicationInfoTableContent = val.data.contents;
                this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};
              } else {
                this.setToast('error', '请求失败', val.message);
              }
            }
          );
        } else {
          this.applicationInfoSrv.queryRefundApplicationInfoPage({pageNo: this.nowPage, pageSize: 10}).subscribe(
            val => {
              if (val.status === '1000') {
                this.loadHidden = true;
                console.log(val);
                this.applicationInfoTableContent = val.data.contents;
                this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};
              } else {
                this.setToast('error', '请求失败', val.message);
              }
            }
          );
        }
      }
    );

    this.globalSrv.queryVillageInfo({}).subscribe(
      (data) => {
        console.log(data);
        data.data.forEach(v => {
          this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
          // = v.villageName;
        });
        // this.villageplaceholder =  this.SearchOption.village[0].label;
      }
    );
    this.applicationInfoTableTitleStyle = {background: '#282A31', color: '#DEDEDE', height: '6vh'};
    console.log(this.applicationInfoSelect);

  }

  // village change
  public VillageChange(e): void {
    // console.log(this.test);
    this.loadHidden = false;
    this.SearchOption.region = [];
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.applicationInfoAdd.villageName = e.originalEvent.target.innerText;
    // this.applicationInfoAdd.villageCode = e.value;
    this.applicationInfoModify.villageName = e.originalEvent.target.innerText;
    // this.applicationInfoModify.villageCode = e.value;
    this.globalSrv.queryRegionInfo({villageCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach(v => {
          this.loadHidden = true;
          this.SearchOption.region.push({label: v.regionName, value: v.regionCode});
        });
      }
    );
  }
  public regionChange(e): void {
    this.loadHidden = false;
    this.SearchOption.unit = [];
    this.applicationInfoAdd.regionName = e.originalEvent.target.innerText;
    // this.applicationInfoAdd.regionCode = e.value;
    this.applicationInfoModify.regionName = e.originalEvent.target.innerText;
    // this.applicationInfoModify.regionCode = e.value;
    console.log(e.value);
    this.globalSrv.queryBuilingInfo({regionCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach(v => {
          this.SearchOption.building.push({label: v.buildingName, value: v.buildingCode});
        });
        this.loadHidden = true;

      }
    );
  }
  public buildingChange(e): void {
    this.SearchOption.unit = [];
    this.applicationInfoAdd.buildingName = e.originalEvent.target.innerText;
    this.globalSrv.queryunitInfo({buildingCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach(v => {
          this.SearchOption.unit.push({label: v.unitName, value: v.unitCode});
        });
      }
    );
  }
  public unitChange(e): void {
    console.log(e.value);
    this.applicationInfoAdd.unitName = e.originalEvent.target.innerText;
    // this.applicationInfoSrv.queryRoomCode({unitCode: e.value}).subscribe(
    //   value => {
    //     console.log(value);
    //     value.data.forEach( v => {
    //       this.roonCodeSelectOption.push({label: v.roomCode, value: v.roomCode});
    //     });
    //   }
    // );
  }
  // condition search click
  public applicationInfoSearchClick(): void {
    // @ts-ignore
    console.log(this.input.nativeElement.value);
    console.log('这里是条件搜索');
  }
  // add applicationInfo
  public applicationInfoAddClick(): void {

    this.applicationInfoAddDialog = true;
  }
  // sure add applicationInfo
  // public applicationInfoAddSureClick(): void {
  //   this.confirmationService.confirm({
  //     message: `确认要增加吗？`,
  //     header: '增加提醒',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       console.log(this.applicationInfoAdd);
  //       this.applicationInfoSrv.addRefunapplicationInfo(this.applicationInfoAdd).subscribe(
  //         value => {
  //           if (value.status === '1000') {
  //             this.setToast('success', '操作成功', value.message);
  //             this.clearData();
  //             this.applicationInfoAddDialog = false;
  //             this.applicationInfoInitialization();
  //           }
  //         }
  //       );
  //
  //       // this.msgs = [{severity:'applicationInfo', summary:'Confirmed', detail:'You have accepted'}];
  //     },
  //     reject: () => {
  //       console.log('这里是增加信息');
  //
  //       // this.msgs = [{severity:'applicationInfo', summary:'Rejected', detail:'You have rejected'}];
  //     }
  //   });
  // }
  //  applicationInfo detail
  public applicationInfoDetailClick(e): void {
    this.applicationInfoDetail = e;
    this.applicationInfoSrv.queryRefundStatus({settingType: 'CHARGE_TYPE'}).subscribe(
      value => {
        if (value.data.length > 0) {
          value.data.forEach( v => {
            if (this.applicationInfoDetail.paymentType.toString() === v.settingCode) {
              this.paymentTypeDetail = v.settingName;
            }
          });
        }
      }
    );
    this.applicationInfoSrv.queryRefundStatus({settingType: 'REFUND_STATUS'}).subscribe(
      value => {
        if (value.data.length > 0) {
          value.data.forEach( v => {
            if (this.applicationInfoDetail.refundStatus.toString() === v.settingCode) {
              this.refundStatusDetail = v.settingName;
            }
          });
        }
      }
    );
    this.applicationInfoDetail = e;

    this.applicationInfoDetailDialog = true;

  }
  // applicationInfo select
  public  applicationInfoonRowSelect(e): void {
    this.applicationInfoModify = e.data;
  }
  // modify applicationInfo
  public applicationInfoModifyClick(): void {
    if (this.applicationInfoSelect === undefined || this.applicationInfoSelect.length === 0) {
      this.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.applicationInfoSelect.length === 1) {

      this.applicationInfoModifayDialog = true;
    } else {
      this.setToast('error', '操作错误', '只能选择一项进行修改');
    }
  }
  public  applicationInfoDeleteClick(): void {

  }
  // public  applicationInfoAddSureClick(): void {
  //
  // }
  public setToast(type, title, message): void {
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
    this.applicationInfoAdd = null;
    this.applicationInfoModify = null;
    this.licensePlateColorModify = null;
    this.licensePlateTypeModify = null;
    this.licensePlateTypeModify = null;
    this.licensePlateColorOption = [];
    this.licensePlateTypeOption = [];
    this.applicationInfoOriginalTypeOption = [];
    this.applicationInfoSelect = [];
  }

  // 分页请求
  public nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.applicationInfoSrv.queryRefundApplicationInfoPage({pageNo: this.nowPage, pageSize: 10}).subscribe(
      value => {
        this.loadHidden = true;
        this.applicationInfoTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
  }

}
