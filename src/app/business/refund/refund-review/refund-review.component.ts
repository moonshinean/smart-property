import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CouponReview} from '../../../common/model/coupon-review.model';
import {ConfirmationService, MessageService} from 'primeng/api';
import {CouponReviewService} from '../../../common/services/coupon-review.service';
import {RefundReviewService} from '../../../common/services/refund-review.service';
import {ModifyRefundInfo} from '../../../common/model/refund-info.model';
import {PublicMethedService} from '../../../common/public/public-methed.service';

@Component({
  selector: 'rbi-refund-review',
  templateUrl: './refund-review.component.html',
  styleUrls: ['./refund-review.component.less']
})
export class RefundReviewComponent implements OnInit {

  @ViewChild('input') input: Input;
  // @ViewChild('file') file: Input;
  public refundReviewTableTitle: any;
  public refundReviewTableContent: any[];
  // public refundReviewTableContent: any;
  public refundReviewTableTitleStyle: any;
  public refundReviewSelect: any;
  // public refundReviewModify: any;
  public refundReviewDetailDialog: boolean;
  public refundReviewDetail: ModifyRefundInfo = new ModifyRefundInfo();
  public refundStatusDetail: any;
  public paymentTypeDetail: any;
  public esDate: any;
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  public loadingHide = true;
  public refundReviewSeachData: any;
  // 审核状态
  public reviewStatus = '通过';
  public refundReviewDialog: boolean;

  public SearchOption = {
    village: [{label: '未来城', value: '1'}, {label: '云城尚品', value: '2'}],
    region: [{label: 'A3组团', value: '1'}, {label: 'A4组团', value: '2'}, {label: 'A5组团', value: '3'}, {label: 'A6组团', value: '4'}],
    building: [{label: '一栋', value: '1'}, {label: '二栋', value: '2'}, {label: '三栋', value: '3'}, {label: '四栋', value: '4'}],
    unit: [{label: '一单元', value: '1'}, {label: '二单元', value: '2'}, {label: '三单元', value: '3'}, {label: '四单元', value: '4'}],
    room: [{label: '2104', value: '1'}, {label: '2106', value: '2'}, {label: '2107', value: '3'}, {label: '2108', value: '4'}],
  };
  public nowPage = 1;
  public couponTypeName: any;
  public couponEffectiveTime: any;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private refundReviewSrv: RefundReviewService,
    private toolSrv: PublicMethedService,
  ) {
  }

  ngOnInit() {
    this.refundReviewInitialization();
  }

  // initialization houseinfo
  public refundReviewInitialization(): void {
    console.log('这里是信息的初始化');
    this.refundReviewTableTitle = [
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
    this.toolSrv.getAdminStatus( 'AUDIT_STATUS', (data) => {
      if (data.length > 0) {
        this.refundReviewSrv.queryRefundAuditedPageInfo({pageNo: this.nowPage, pageSize: 10}).subscribe(
          (val) => {
            if (val.status === '1000') {
              console.log(val);
              this.loadingHide = true;
              val.data.contents.forEach( h => {
                 data.forEach( v => {
                  if (h.auditStatus.toString() === v.settingCode) {
                    h.auditStatus = v.settingName;
                  }
                });
              });
              this.refundReviewTableContent = val.data.contents;
              this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};
            } else  {
              this.toolSrv.setToast('error', '请求失败', val.message);
            }
          }
        );

      } else {
        this.refundReviewSrv.queryRefundAuditedPageInfo({pageNo: this.nowPage, pageSize: 10}).subscribe(
          (val) => {
            if (val.status === '1000') {
              console.log(val);
              this.loadingHide = true;
              this.refundReviewTableContent = val.data.contents;
              this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};
            } else  {
              this.toolSrv.setToast('error', '请求失败', val.message);
            }
          }
        );
      }
    });
    this.refundReviewSrv.queryRefundAuditedPageInfo({pageNo: this.nowPage, pageSize: 10}).subscribe(
      (value) => {
        console.log(value);
        this.loadingHide = true;
        this.refundReviewTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
    this.refundReviewTableTitleStyle = {background: '#282A31', color: '#DEDEDE', height: '6vh'};
    console.log(this.refundReviewSelect);

  }

  // condition search click
  public refundReviewSearchClick(): void {

    console.log('这里是条件搜索');
  }
  // detail refundReviewInfo
  public refundReviewDetailClick(e): void {
    console.log(e);
    this.refundReviewDetail = e;
    this.toolSrv.getAdminStatus('REFUND_STATUS', (data) => {
      if (data.length > 0) {
        this.toolSrv.setDataFormat(data, this.refundReviewDetail.refundStatus, (list, dataName) => {
          this.refundStatusDetail = dataName;
        });
      }
    });
    this.toolSrv.getAdminStatus('CHARGE_TYPE', (data) => {
      if (data.length > 0) {
        this.toolSrv.setDataFormat(data, this.refundReviewDetail.refundStatus, (list, dataName) => {
          this.paymentTypeDetail = dataName;
        });
      }
    });
    this.refundReviewDetailDialog = true;
  }

  // refundReview
  public  refundReviewClick(): void {
    if (this.refundReviewSelect === undefined || this.refundReviewSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要审核的项');

    } else if (this.refundReviewSelect.length === 1) {
        this.refundReviewDialog = true;
    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行审核');

    }
  }
  public  refundReviewSureClick(): void {
    if (this.reviewStatus === '通过') {
      console.log(this.refundReviewSelect[0].id);
      this.refundReviewSrv.passRefundAudited({id: this.refundReviewSelect[0].id}).subscribe(
        value => {
          this.toolSrv.setToast('success' , '操作成功', value.message);
          this.refundReviewInitialization();
          this.refundReviewDialog = false;
          this.refundReviewSelect = null;
        }
      );
    }else {
      this.refundReviewSrv.RefundNoPassStatus({id: this.refundReviewSelect[0].id}).subscribe(
        value => {
          this.toolSrv.setToast('success' , '操作成功', value.message);
          this.refundReviewInitialization();
          this.refundReviewDialog = false;
          this.refundReviewSelect = null;
        }
      );
    }

  }
  // select houseinfo
  public refundReviewonRowSelect(e): void {
    // this.refundReviewModify = e.data;
  }
  // get refundReview Pagination
  public nowpageEventHandle(event: any): void {
    this.loadingHide = false;

    this.refundReviewSrv.queryRefundAuditedPageInfo({pageNo: event, pageSize: 10}).subscribe(
      (value) => {
        console.log(value);
        this.loadingHide = true;
        this.refundReviewTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};

      }
    );
    this.refundReviewSelect = [];
  }

}
