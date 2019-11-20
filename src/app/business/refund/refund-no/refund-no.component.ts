import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApplicationRefund} from '../../../common/model/refund-no.model';
import {ModifyRefundInfo} from '../../../common/model/refund-info.model';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {RefundService} from '../../../common/services/refund.service';
import {Subscription} from 'rxjs';
import {ThemeService} from '../../../common/public/theme.service';

@Component({
  selector: 'rbi-refund-no',
  templateUrl: './refund-no.component.html',
  styleUrls: ['./refund-no.component.less']
})
export class RefundNoComponent implements OnInit, OnDestroy {
  public refundNoTableTitle: any;
  public refundNoTableContent: any[];
  public refundNoTableTitleStyle: any;
  public refundNoSelect: any[];

  public chargeTypeOption = [];
  public paymentMethodOption = [];
  public refundStatusOption = [];
  // 添加相关
  public refundNoAdd: any;
  // 详情相关
  public infoNoOption: any;
  public refundNoDetail: ModifyRefundInfo = new ModifyRefundInfo();

  // 申请退款
  public RefundDialog: any;
  public ApplicationRefund: ApplicationRefund = new ApplicationRefund();
  public refundReason: any;
  public option: any;
  public loadHidden = true;
  public themeSub: Subscription;
  public table = {
    tableheader: {background: '', color: ''},
    tableContent: [
      {background: '', color: ''},
      {background: '', color: ''}],
    detailBtn: ''
  };
  // 其他相关
  // public cleanTimer: any; // 清除时钟
  public nowPage = 1;
  constructor(
    private refundNoSrv: RefundService,
    private toolSrv: PublicMethedService,
    private themeSrv: ThemeService,
  ) {
    this.themeSub =  this.themeSrv.changeEmitted$.subscribe(
      value => {
        this.table.tableheader = value.table.header;
        this.table.tableContent = value.table.content;
        this.table.detailBtn = value.table.detailBtn;
        this.refundNoTableTitleStyle = {background: this.table.tableheader.background, color: this.table.tableheader.color, height: '6vh'};
      }
    );
  }

  ngOnInit() {
    if (this.themeSrv.setTheme !== undefined) {
      this.table.tableheader = this.themeSrv.setTheme.table.header;
      this.table.tableContent = this.themeSrv.setTheme.table.content;
      this.table.detailBtn = this.themeSrv.setTheme.table.detailBtn;
    }
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
      // {field: 'refundStatus', header: '退款状态'},
      {field: 'operating', header: '操作'},
    ];
    this.loadHidden = false;
    this.toolSrv.getAdmStatus([{settingType: 'PAYMENT_METHOD'}, {settingType: 'CHARGE_TYPE'}, {settingType: 'REFUND_STATUS'}, {settingType: 'PARMENT_TYPE'}], (data) => {
      this.chargeTypeOption = this.toolSrv.setListMap(data.CHARGE_TYPE);
      this.paymentMethodOption = this.toolSrv.setListMap(data.PAYMENT_METHOD);
      this.refundStatusOption = this.toolSrv.setListMap(data.REFUND_STATUS);
      this.queryRefundNoInfoPageData();
    });

    this.refundNoTableTitleStyle = {background: this.table.tableheader.background, color: this.table.tableheader.color, height: '6vh'};

  }
  ngOnDestroy(): void {
    this.themeSub.unsubscribe();
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
          console.log(value);
          if (value.status === '1000') {
            this.toolSrv.setToast('success', '操作成功', '申请退款成功');
            this.RefundDialog = false;
            this.ApplicationRefund = new ApplicationRefund();
            this.refundNoInitialization();
          } else {
            this.toolSrv.setToast('error', '操作失败', value.message);
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
    this.infoNoOption = {
      dialog: true,
      tableHidden: false,
      width: '1000',
      type: 2,
      title: '详情',
      poplist: {
        popContent: e,
        popTitle:  [
          {field: 'organizationName', header: '组织名称'},
          {field: 'villageName', header: '小区名称'},
          {field: 'regionName', header: '地块名称'},
          {field: 'buildingName', header: '楼栋名称'},
          {field: 'unitName', header: '单元名称'},
          {field: 'roomCode', header: '房间编号'},
          {field: 'surname', header: '客户名称'},
          {field: 'roomSize', header: '住房大小'},
          {field: 'chargeName', header: '项目名称'},
          {field: 'actualMoneyCollection', header: '实收金额'},
          {field: 'mortgageAmount', header: '抵扣金额'},
          {field: 'reasonForDeduction', header: '抵扣原因'},
          {field: 'refundableAmount', header: '可退还金额'},
          {field: 'chargeUnit', header: '收费单位'},
          {field: 'payerPhone', header: '缴费人手机号'},
          {field: 'paymentMethod', header: '支付方式'},
          {field: 'paymentType', header: '支付类型'},
          {field: 'refundStatus', header: '退款状态'},
          {field: 'startTime', header: '开始时间'},
          {field: 'endTime', header: '结束时间'},
          {field: 'delayTime', header: '延迟时长'},
          {field: 'delayReason', header: '延期原因'},
          {field: 'personLiable', header: '责任人'},
          {field: 'personLiablePhone', header: '责任人电话'},
          {field: 'responsibleAgencies', header: '负责机构'},
          {field: 'remark', header: '申请退款备注 '},
        ],
      }
    };
    // this.toolSrv.getAdminStatus('REFUND_STATUS', (data) => {
    //   if (data.length > 0) {
    //       data.forEach( v => {
    //       if (this.refundNoDetail.refundStatus.toString() === v.settingCode) {
    //         this.refundStatusDetail = v.settingName;
    //       }
    //     });
    //   }
    // });
    // this.toolSrv.getAdminStatus('CHARGE_TYPE', (data) => {
    //   if (data.length > 0) {
    //     data.forEach( v => {
    //       if (this.refundNoDetail.paymentType.toString() === v.settingCode) {
    //         this.paymentTypeDetail = v.settingName;
    //       }
    //     });
    //   }
    // });

  }
  // refundNo select
  // Amount calculation
  public  transferCardAmountChange(): void {
    this.ApplicationRefund.deductionPropertyFee = Number(this.ApplicationRefund.refundableAmount) - Number(this.ApplicationRefund.transferCardAmount);
  }
  // Reset data
  public clearData(): void {
    this.refundNoAdd = null;
    this.refundNoSelect = [];
    this.ApplicationRefund = new ApplicationRefund();
  }
  // paging query
  public nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.queryRefundNoInfoPageData();
  }

  public  queryRefundNoInfoPageData(): void {
    this.refundNoSrv.queryRefundNoInfoPage({pageNo: this.nowPage, pageSize: 10}).subscribe(
      value => {
        this.loadHidden = true;
        if (value.status === '1000') {
          value.data.contents.forEach( v => {
            if (this.isOrNull(v.refundStatus)) {
              v.refundStatus = this.toolSrv.setValueToLabel(this.refundStatusOption, v.refundStatus);
            }
            if (this.isOrNull(v.paymentMethod)) {
              v.paymentMethod = this.toolSrv.setValueToLabel(this.paymentMethodOption, v.paymentMethod);

            }
            if (this.isOrNull(v.paymentType)) {
              v.paymentType = this.toolSrv.setValueToLabel(this.chargeTypeOption, v.paymentType);

            }
          });
          this.refundNoTableContent = value.data.contents;
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        } else {
          this.toolSrv.setToast('error', '查询失败', value.message);
        }
      }
    );
  }
  public  isOrNull(data: any): boolean {
    return (data !== null && data !== '' && data !== undefined);
  }

  public  refundNoonRowSelect(e): void {
      console.log(e);
  }
}
