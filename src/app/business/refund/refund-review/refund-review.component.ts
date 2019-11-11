import {Component, Input, OnInit, ViewChild} from '@angular/core';

import {ModifyRefundInfo} from '../../../common/model/refund-info.model';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {RefundService} from '../../../common/services/refund.service';

@Component({
  selector: 'rbi-refund-review',
  templateUrl: './refund-review.component.html',
  styleUrls: ['./refund-review.component.less']
})
export class RefundReviewComponent implements OnInit {

  public refundReviewSelect: any;

  public refundReviewOption: any;

  // 状态相关
  public chargeTypeOption = [];
  public paymentMethodOption = [];
  public refundStatusOption = [];
  public auditStatusOption = [];
  // 详情相关
  public refundReviewDetailOption: any;
  public esDate: any;
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  public loadingHide = true;
  // 审核状态
  public reviewOption: any;
  public reviewStatus = '通过';
  public refundReviewDialog: boolean;
  // public SearchOption = {
  //   village: [{label: '未来城', value: '1'}, {label: '云城尚品', value: '2'}],
  //   region: [{label: 'A3组团', value: '1'}, {label: 'A4组团', value: '2'}, {label: 'A5组团', value: '3'}, {label: 'A6组团', value: '4'}],
  //   building: [{label: '一栋', value: '1'}, {label: '二栋', value: '2'}, {label: '三栋', value: '3'}, {label: '四栋', value: '4'}],
  //   unit: [{label: '一单元', value: '1'}, {label: '二单元', value: '2'}, {label: '三单元', value: '3'}, {label: '四单元', value: '4'}],
  //   room: [{label: '2104', value: '1'}, {label: '2106', value: '2'}, {label: '2107', value: '3'}, {label: '2108', value: '4'}],
  // };

  public nowPage = 1;
  constructor(
    private refundReviewSrv: RefundService,
    private toolSrv: PublicMethedService,
  ) {
  }

  ngOnInit() {
    this.refundReviewInitialization();
  }

  // initialization houseinfo
  public refundReviewInitialization(): void {
    this.loadingHide = false;
    this.toolSrv.getAdmStatus([{settingType: 'PAYMENT_METHOD'}, {settingType: 'CHARGE_TYPE'}, {settingType: 'REFUND_STATUS'}, {settingType: 'AUDIT_STATUS'}], (data) => {
      console.log(data);
      this.chargeTypeOption = this.toolSrv.setListMap(data.CHARGE_TYPE);
      this.paymentMethodOption = this.toolSrv.setListMap(data.PAYMENT_METHOD);
      this.refundStatusOption = this.toolSrv.setListMap(data.REFUND_STATUS);
      this.auditStatusOption = this.toolSrv.setListMap(data.AUDIT_STATUS);
      this.queryRefundReviewPageData();
    });
  }

 /* // // condition search click
  // public refundReviewSearchClick(): void {
  //
  //   console.log('这里是条件搜索');
  // }*/
  // Refund review info  details
  public refundReviewDetailClick(e): void {
    this.refundReviewDetailOption = {
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
  // show refundReview info dialog
  public  refundReviewClick(): void {
    if (this.refundReviewSelect === undefined || this.refundReviewSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要审核的项');

    } else if (this.refundReviewSelect.length === 1) {
      this.reviewOption = {
        width: '500',
        dialog: true
      };
    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行审核');

    }
  }
  // sure refundReview
  public  refundReviewSureClick(e): void {
    if (e === '通过') {
      this.refundReviewSrv.passRefundAudited({id: this.refundReviewSelect[0].id}).subscribe(
        value => {
          this.toolSrv.setToast('success' , '操作成功', value.message);
          this.clearData();
          this.refundReviewInitialization();
        }
      );
    } else if (e === '不通过') {
      this.refundReviewSrv.RefundNoPassStatus({id: this.refundReviewSelect[0].id}).subscribe(
        value => {
          this.toolSrv.setToast('success' , '操作成功', value.message);
          this.clearData();
          this.refundReviewInitialization();
        }
      );
    } else {
      this.clearData();
    }
  }
  // 清除数据
  public clearData(): void {
    this.reviewOption.dialog = false;
    this.refundReviewSelect = [];
  }
  // pageing query
  public nowpageEventHandle(event: any): void {
    this.loadingHide = false;
    this.nowPage = event;
    this.queryRefundReviewPageData();
    this.refundReviewSelect = [];
  }

  public  queryRefundReviewPageData(): void {
    this.refundReviewSrv.queryRefundAuditedPageInfo({pageNo: this.nowPage, pageSize: 10}).subscribe(
      (value) => {
        this.loadingHide = true;
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
    this.refundReviewSelect = e;
  }

  public  isOrNull(data: any): boolean {
    return (data !== null && data !== '' && data !== undefined);
  }
}
