import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CouponPendingReview} from '../../../common/model/coupon-pending-review.model';
import {PublicMethedService} from '../../../common/public/public-methed.service';

import {RefundService} from '../../../common/services/refund.service';

@Component({
  selector: 'rbi-refund-pend-review',
  templateUrl: './refund-pend-review.component.html',
  styleUrls: ['./refund-pend-review.component.less']
})
export class RefundPendReviewComponent implements OnInit {
  public refundPendReviewTableTitle: any;
  public refundPendReviewTableContent: any[];
  public refundPendReviewTableTitleStyle: any;
  public refundPendReviewSelect: any;
  public refundPendReviewDetailDialog: boolean;
  public refundPendReviewDetail: CouponPendingReview = new CouponPendingReview();
  public esDate: any;

  public refundReviewOption: any;
  // 状态相关
  public chargeTypeOption = [];
  public paymentMethodOption = [];
  public refundStatusOption = [];
  public auditStatusOption = [];
  // 详情相关
  public refundPendReviewDetailOption: any;
  // 其他相关
  public cleanTimer: any; // 清除时钟
  // 审核状态
  public reviewOption: any;
  public reviewStatus = '通过';
  public refundPendReviewDialog: boolean;

  public option: any;
  public loadingHide = true;
  // public refundPendReviewSeachData: any;
  // public SearchOption = {
  //   village: [{label: '未来城', value: '1'}, {label: '云城尚品', value: '2'}],
  //   region: [{label: 'A3组团', value: '1'}, {label: 'A4组团', value: '2'}, {label: 'A5组团', value: '3'}, {label: 'A6组团', value: '4'}],
  //   building: [{label: '一栋', value: '1'}, {label: '二栋', value: '2'}, {label: '三栋', value: '3'}, {label: '四栋', value: '4'}],
  //   unit: [{label: '一单元', value: '1'}, {label: '二单元', value: '2'}, {label: '三单元', value: '3'}, {label: '四单元', value: '4'}],
  //   room: [{label: '2104', value: '1'}, {label: '2106', value: '2'}, {label: '2107', value: '3'}, {label: '2108', value: '4'}],
  // };
  public nowPage = 1;
  public couponTypeName: any;
  public couponEffectiveTime: any;
  constructor(
    private toolSrv: PublicMethedService,
    private refundPendReviewSrv: RefundService
  ) {
  }

  ngOnInit() {
    this.esDate = this.toolSrv.esDate;
    this.refundPendReviewInitialization();
  }

  // initialization houseinfo
  public refundPendReviewInitialization(): void {
    this.refundPendReviewTableTitle = [
      {field: 'orderId', header: '订单Id'},
      {field: 'payerName', header: '缴费人姓名'},
      {field: 'paymentMethod', header: '支付方式'},
      {field: 'roomCode', header: '房间编号'},
      {field: 'chargeName', header: '项目名称'},
      {field: 'actualMoneyCollection', header: '实收金额'},
      {field: 'auditStatus', header: '审核状态'},
      {field: 'operating', header: '操作'},
    ];
    this.loadingHide = false;
    this.toolSrv.getAdmStatus([{settingType: 'ARREARS_STATUS'}, {settingType: 'PAYMENT_METHOD'}, {settingType: 'CHARGE_TYPE'}, {settingType: 'REFUND_STATUS'}, {settingType: 'AUDIT_STATUS'}], (data) => {
      console.log(data);
      this.chargeTypeOption = this.toolSrv.setListMap(data.CHARGE_TYPE);
      this.paymentMethodOption = this.toolSrv.setListMap(data.PAYMENT_METHOD);
      this.refundStatusOption = this.toolSrv.setListMap(data.REFUND_STATUS);
      this.auditStatusOption = this.toolSrv.setListMap(data.AUDIT_STATUS);
      this.queryRefundPendReviewPageData();
    });
  }

  // // condition search click
  // public refundPendReviewSearchClick(): void {
  //   console.log('这里是条件搜索');
  // }

  // detail refundPendReviewInfo
  public refundPendReviewDetailClick(e): void {
    this.refundPendReviewDetailOption = {
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
  }
  // show refundPendReview dialog
  public  refundPendReviewClick(): void {
    if (this.refundPendReviewSelect === undefined || this.refundPendReviewSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要审核的项');

    } else if (this.refundPendReviewSelect.length === 1) {
      this.reviewOption = {
        width: '500',
        dialog: true
      };

    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行审核');

    }
  }
  // Review request
  public  refundPendReviewSureClick(e): void {
    if (e === '通过') {
      this.loadingHide = false;
      this.refundPendReviewSrv.paasRefundAuditedInfo({id: this.refundPendReviewSelect[0].id}).subscribe(
        value => {
          this.loadingHide = true;
          if (value.status === '1000') {
            this.toolSrv.setToast('success' , '操作成功', value.message);
            this.clearData();
            this.refundPendReviewInitialization();
          } else {
            this.toolSrv.setToast('error', '操作失败', value.message);
          }
        }
      );
    }  else if ( e === '不通过') {
      this.loadingHide = false;
      this.refundPendReviewSrv.RefundNoPaasAudited({id: this.refundPendReviewSelect[0].id}).subscribe(
        value => {
          this.loadingHide = true;
          if (value.status === '1000') {
            this.toolSrv.setToast('success', '操作成功', value.message);
            this.clearData();
            this.refundPendReviewInitialization();
          } else {
            this.toolSrv.setToast('error', '操作失败', value.message);
          }
        }
      );
    } else {
      this.clearData();
    }
  }
  // 清除数据
  public clearData(): void {
    this.reviewOption.dialog = false;
    this.refundPendReviewSelect = [];
  }   // this.refundPendReviewModify = e.data;
  // paging query
  public nowpageEventHandle(event: any): void {
    this.loadingHide = false;
    this.nowPage = event;
    this.queryRefundPendReviewPageData();
    this.refundPendReviewSelect = [];
  }

  public  queryRefundPendReviewPageData(): void {
    this.refundPendReviewSrv.queryRefundAuditedPageInfo({pageNo: this.nowPage, pageSize: 10}).subscribe(
      (value) => {
        console.log(value);
        this.loadingHide = true;
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
            if (this.isOrNull(v.auditStatus)) {
              v.auditStatus = this.toolSrv.setValueToLabel(this.auditStatusOption, v.auditStatus);
            }
          });
          this.setTableOption(value.data.contents);
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        } else {
          this.toolSrv.setToast('error', '查询失败', value.message);
        }
      }
    );
  }
  // 设置表格
  public  setTableOption(data1): void {
    this.refundReviewOption = {
      width: '101.4%',
      header: {
        data: [
          {field: 'orderId', header: '订单Id'},
          {field: 'payerName', header: '缴费人姓名'},
          {field: 'paymentMethod', header: '支付方式'},
          {field: 'roomCode', header: '房间编号'},
          {field: 'chargeName', header: '项目名称'},
          {field: 'actualMoneyCollection', header: '实收金额'},
          {field: 'auditStatus', header: '审核状态'},
          {field: 'operating', header: '操作'},
        ],
        style: {background: '#282A31', color: '#DEDEDE', height: '6vh'}
      },
      Content: {
        data: data1,
        styleone: {background: '#33353C', color: '#DEDEDE', textAlign: 'center', height: '2vw'},
        styletwo: {background: '#2E3037', color: '#DEDEDE', textAlign: 'center', height: '2vw'},
      },
      type: 2,
      tableList:  [{label: '详情', color: '#6A72A1'}]
    };
  }

  // info select
  public  selectData(e): void {
    this.refundPendReviewSelect = e;
  }

  public  isOrNull(data: any): boolean {
    return (data !== null && data !== '' && data !== undefined);
  }
}
