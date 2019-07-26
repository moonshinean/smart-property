import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {RefundInfoService} from '../../../common/services/refund-info.service';
import {GlobalService} from '../../../common/services/global.service';
import {RefundApplicationInfoService} from '../../../common/services/refund-application-info.service';
import {RefundApplicationInfo} from '../../../common/model/refund-applicationInfo.model';
import {PublicMethedService} from '../../../common/public/public-methed.service';

@Component({
  selector: 'rbi-refund-application-info',
  templateUrl: './refund-application-info.component.html',
  styleUrls: ['./refund-application-info.component.less']
})
export class RefundApplicationInfoComponent implements OnInit {
  public applicationInfoTableTitle: any;
  public applicationInfoTableContent: any[];
  public applicationInfoTableTitleStyle: any;
  public applicationInfoSelect: any[];
  // 添加相关
  public applicationInfoAdd: any;
  public  licensePlateColorOption: any[] = [];
  public  licensePlateTypeOption: any[] = [];
  public  applicationInfoOriginalTypeOption: any[] = [];
  // 修改相关
  public applicationInfoModifayDialog: boolean;
  public applicationInfoModify: any;
  public licensePlateColorModify: any;
  public licensePlateTypeModify: any;
  // 详情相关
  public applicationInfoDetailDialog: boolean;
  public applicationInfoDetail: RefundApplicationInfo = new RefundApplicationInfo();
  public refundStatusDetail: any;
  public paymentTypeDetail: any;
  public SearchOption = {
    village: [],
    region: [],
    building: [],
    unit: []
  };
  public option: any;
  public loadHidden = true;
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public nowPage = 1;
  public roonCodeSelectOption: any[] = [];

  constructor(
    private applicationInfoSrv: RefundApplicationInfoService,
    private toolSrv: PublicMethedService,
    private globalSrv: GlobalService,
  ) {
  }
  ngOnInit() {
    this.applicationInfoInitialization();
  }
  // initialization applicationInfo
  public applicationInfoInitialization(): void {
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
    this.toolSrv.getAdminStatus('AUDIT_STATUS', (data) => {
      if (data.length > 0) {
        this.applicationInfoSrv.queryRefundApplicationInfoPage({pageNo: this.nowPage, pageSize: 10}).subscribe(
          val => {
            if (val.status === '1000') {
              this.loadHidden = true;
              val.data.contents.forEach( h => {
                data.forEach( v => {
                  if (h.auditStatus.toString() === v.settingCode) {
                    h.auditStatus = v.settingName;
                  }
                });
              });
              this.applicationInfoTableContent = val.data.contents;
              this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};
            } else {
              this.toolSrv.setToast('error', '请求失败', val.message);
            }
          }
        );
      } else {
        this.applicationInfoSrv.queryRefundApplicationInfoPage({pageNo: this.nowPage, pageSize: 10}).subscribe(
          val => {
            if (val.status === '1000') {
              this.loadHidden = true;
              this.applicationInfoTableContent = val.data.contents;
              this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};
            } else {
              this.toolSrv.setToast('error', '请求失败', val.message);
            }
          }
        );
      }
    });
    this.globalSrv.queryVillageInfo({}).subscribe(
      (data) => {
        data.data.forEach(v => {
          this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
        });
      }
    );
    this.applicationInfoTableTitleStyle = {background: '#282A31', color: '#DEDEDE', height: '6vh'};

  }
  // query Village
  public VillageChange(e): void {
    this.loadHidden = false;
    this.SearchOption.region = [];
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.applicationInfoAdd.villageName = e.originalEvent.target.innerText;
    this.applicationInfoModify.villageName = e.originalEvent.target.innerText;
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
  // query region
  public regionChange(e): void {
    this.loadHidden = false;
    this.SearchOption.unit = [];
    this.applicationInfoAdd.regionName = e.originalEvent.target.innerText;
    this.applicationInfoModify.regionName = e.originalEvent.target.innerText;
    this.globalSrv.queryBuilingInfo({regionCode: e.value}).subscribe(
      (value) => {
        value.data.forEach(v => {
          this.SearchOption.building.push({label: v.buildingName, value: v.buildingCode});
        });
        this.loadHidden = true;

      }
    );
  }
  // query building
  public buildingChange(e): void {
    this.SearchOption.unit = [];
    this.applicationInfoAdd.buildingName = e.originalEvent.target.innerText;
    this.globalSrv.queryunitInfo({buildingCode: e.value}).subscribe(
      (value) => {
        value.data.forEach(v => {
          this.SearchOption.unit.push({label: v.unitName, value: v.unitCode});
        });
      }
    );
  }
  // query unit
  public unitChange(e): void {
    this.applicationInfoAdd.unitName = e.originalEvent.target.innerText;

  }
  //  applicationInfo detail
  public applicationInfoDetailClick(e): void {
    this.applicationInfoDetail = e;
    this.toolSrv.getAdminStatus('CHARGE_TYPE', (data) => {
        data.forEach( v => {
          if (this.applicationInfoDetail.paymentType.toString() === v.settingCode) {
            this.paymentTypeDetail = v.settingName;
          }
        });
    });
    this.toolSrv.getAdminStatus('REFUND_STATUS', (data) => {
        data.forEach( v => {
          if (this.applicationInfoDetail.refundStatus.toString() === v.settingCode) {
            this.refundStatusDetail = v.settingName;
          }
        });
    });
    this.applicationInfoDetail = e;
    this.applicationInfoDetailDialog = true;
  }
  // applicationInfo select
  public  applicationInfoonRowSelect(e): void {
    this.applicationInfoModify = e.data;
  }
  // applicationInfo delete
  public  applicationInfoDeleteClick(): void {
  }
  // modify applicationInfo
  public applicationInfoModifyClick(): void {
    if (this.applicationInfoSelect === undefined || this.applicationInfoSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.applicationInfoSelect.length === 1) {
      this.applicationInfoModifayDialog = true;
    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行修改');
    }
  }
  // clearData
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
  // Paging request
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
