import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {RefundNoService} from '../../../common/services/refund-No.service';
import {GlobalService} from '../../../common/services/global.service';
import {ApplicationRefund} from '../../../common/model/refund-no.model';
import {ModifyRefundInfo} from '../../../common/model/refund-info.model';
import {PublicMethedService} from '../../../common/public/public-methed.service';

@Component({
  selector: 'rbi-refund-no',
  templateUrl: './refund-no.component.html',
  styleUrls: ['./refund-no.component.less']
})
export class RefundNoComponent implements OnInit {
  public refundNoTableTitle: any;
  public refundNoTableContent: any[];
  public refundNoTableTitleStyle: any;
  public refundNoSelect: any[];
  // 添加相关
  public refundNoAdd: any;
  public  licensePlateColorOption: any[] = [];
  public  licensePlateTypeOption: any[] = [];
  public  refundNoOriginalTypeOption: any[] = [];
  // 修改相关
  public refundNoModify: any;
  public licensePlateColorModify: any;
  public licensePlateTypeModify: any;
  public paymentTypeDetail: any;
  public refundStatusDetail: any;
  // 详情相关
  public refundNoDetailDialog: boolean;
  public refundNoDetail: ModifyRefundInfo = new ModifyRefundInfo();

  // 申请退款
  public RefundDialog: any;
  public ApplicationRefund: ApplicationRefund = new ApplicationRefund();
  public refundReason: any;
  // public msgs: Message[] = []; // 消息弹窗
  // public SearchOption = {
  //   village: [],
  //   region: [],
  //   building: [],
  //   unit: []
  // };
  public option: any;
  public loadHidden = true;
  // 其他相关
  // public cleanTimer: any; // 清除时钟
  public nowPage = 1;
  public roonCodeSelectOption: any[] = [];
  constructor(
    private refundNoSrv: RefundNoService,
    private toolSrv: PublicMethedService,
  ) {
  }

  ngOnInit() {
    this.refundNoInitialization();
  }

  // initialization refundNo
  public refundNoInitialization(): void {
    this.ApplicationRefund.remark = null;
    this.refundNoTableTitle = [
      {field: 'orderId', header: '订单Id'},
      {field: 'payerName', header: '缴费人姓名'},
      {field: 'paymentMethod', header: '支付方式'},
      {field: 'roomCode', header: '房间编号'},
      {field: 'chargeName', header: '项目名称'},
      {field: 'actualMoneyCollection', header: '实收金额'},
      {field: 'operating', header: '操作'},
    ];
    this.loadHidden = false;
    this.refundNoSrv.queryRefundNoInfoPage({pageNo: this.nowPage, pageSize: 10}).subscribe(
      value => {
        this.loadHidden = true;
        this.refundNoTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
  /*  this.globalSrv.queryVillageInfo({}).subscribe(
      (data) => {
        data.data.forEach(v => {
          this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
        });
      }
    );*/
    this.refundNoTableTitleStyle = {background: '#282A31', color: '#DEDEDE', height: '6vh'};

  }

/*  // village change
  public VillageChange(e): void {
    this.loadHidden = false;
    this.SearchOption.region = [];
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.refundNoAdd.villageName = e.originalEvent.target.innerText;
    this.refundNoModify.villageName = e.originalEvent.target.innerText;
    this.globalSrv.queryRegionInfo({villageCode: e.value}).subscribe(
      (value) => {
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
    this.refundNoAdd.regionName = e.originalEvent.target.innerText;
    this.refundNoModify.regionName = e.originalEvent.target.innerText;
    this.globalSrv.queryBuilingInfo({regionCode: e.value}).subscribe(
      (value) => {
        value.data.forEach(v => {
          this.SearchOption.building.push({label: v.buildingName, value: v.buildingCode});
        });
        this.loadHidden = true;

      }
    );
  }
  public buildingChange(e): void {
    this.SearchOption.unit = [];
    this.refundNoAdd.buildingName = e.originalEvent.target.innerText;
    this.globalSrv.queryunitInfo({buildingCode: e.value}).subscribe(
      (value) => {
        value.data.forEach(v => {
          this.SearchOption.unit.push({label: v.unitName, value: v.unitCode});
        });
      }
    );
  }
  public unitChange(e): void {
    this.refundNoAdd.unitName = e.originalEvent.target.innerText;
  }*/
  // condition search click
  public refundNoSearchClick(): void {
    // @ts-ignore
  }
  // show refund application dialog
  public  InfoRefundClick(e): void {
    this.ApplicationRefund.refundableAmount = e.refundableAmount;
    this.ApplicationRefund.actualMoneyCollection = e.actualMoneyCollection;
    this.ApplicationRefund.orderId = e.orderId;
    this.ApplicationRefund.organizationId = e.organizationId;
    this.refundReason = e.reasonForDeduction;
    this.RefundDialog = true;
  }
  // sure refund application
  public  refundSureClick(): void {
    if (Number(this.ApplicationRefund.transferCardAmount) + Number(this.ApplicationRefund.deductionPropertyFee) === Number(this.ApplicationRefund.refundableAmount)) {
      this.refundNoSrv.applicationRefund(this.ApplicationRefund).subscribe(
        value => {
          if (value.status === '1000') {
            this.toolSrv.setToast('success', '操作成功', '申请退款成功');
            this.RefundDialog = false;
            this.ApplicationRefund = new ApplicationRefund();
            this.refundNoInitialization();
          }
        }
      );
    } else {
      this.toolSrv.setToast('error', '操作错误', '输入金额与退还总金额不匹配,请重新输入');
    }
  }
  // Non-refundable details
  public refundNoDetailClick(e): void {
    this.refundNoDetail = e;
    this.toolSrv.getAdminStatus('REFUND_STATUS', (data) => {
      if (data.length > 0) {
          data.forEach( v => {
          if (this.refundNoDetail.refundStatus.toString() === v.settingCode) {
            this.refundStatusDetail = v.settingName;
          }
        });
      }
    });
    this.toolSrv.getAdminStatus('CHARGE_TYPE', (data) => {
      if (data.length > 0) {
        data.forEach( v => {
          if (this.refundNoDetail.paymentType.toString() === v.settingCode) {
            this.paymentTypeDetail = v.settingName;
          }
        });
      }
    });
    this.refundNoDetailDialog = true;

  }
  // refundNo select
  public  refundNoonRowSelect(e): void {
    this.refundNoModify = e.data;
  }
  // Amount calculation
  public  transferCardAmountChange(): void {
    this.ApplicationRefund.deductionPropertyFee = Number(this.ApplicationRefund.refundableAmount) - Number(this.ApplicationRefund.transferCardAmount);
  }
  // Reset data
  public clearData(): void {
    this.refundNoAdd = null;
    this.refundNoModify = null;
    this.licensePlateColorModify = null;
    this.licensePlateTypeModify = null;
    this.licensePlateTypeModify = null;
    this.licensePlateColorOption = [];
    this.licensePlateTypeOption = [];
    this.refundNoOriginalTypeOption = [];
    this.refundNoSelect = [];
    this.ApplicationRefund = new ApplicationRefund();
  }
  // paging query
  public nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.refundNoSrv.queryRefundNoInfoPage({pageNo: this.nowPage, pageSize: 10}).subscribe(
      value => {
        this.loadHidden = true;
        this.refundNoTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
  }
}
