import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CouponPendingReview} from '../../../common/model/coupon-pending-review.model';
import {ConfirmationService, MessageService} from 'primeng/api';
import {CouponPendingReviewService} from '../../../common/services/coupon-pending-review.service';
import {RefundPendReviewService} from '../../../common/services/refund-pend-review.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';

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
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public refundStatusDetail: any;
  public paymentTypeDetail: any;
  // 审核状态
  public reviewStatus = '通过';
  public refundPendReviewDialog: boolean;

  public option: any;
  public loadingHide = true;
  public refundPendReviewSeachData: any;
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
  constructor(
    private toolSrv: PublicMethedService,
    private refundPendReviewSrv: RefundPendReviewService
  ) {
  }

  ngOnInit() {
    this.esDate = this.toolSrv.esDate;
    this.refundPendReviewInitialization();
  }

  // initialization houseinfo
  public refundPendReviewInitialization(): void {
    console.log('这里是信息的初始化');
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
    this.toolSrv.getAdminStatus('ARREARS_STATUS', (data) => {
      if (data.length > 0) {
        this.refundPendReviewSrv.queryRefundAuditedPageInfo({pageNo: this.nowPage, pageSize: 10}).subscribe(
          (val) => {
            this.loadingHide = true;
            if (val.status === '1000') {
              val.data.contents.forEach(h => {
                 data.forEach( v => {
                  if (h.auditStatus.toString() === v.settingCode) {
                    h.auditStatus = v.settingName;
                  }
                });
              });
              this.refundPendReviewTableContent = val.data.contents;
              this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};
            }  else  {
              this.toolSrv.setToast('error', '请求错误', val.message);
            }
          }
        );
      } else {
        this.refundPendReviewSrv.queryRefundAuditedPageInfo({pageNo: this.nowPage, pageSize: 10}).subscribe(
          (val) => {
            console.log(val);
            this.loadingHide = true;
            if (val.status === '1000') {
              this.refundPendReviewTableContent = val.data.contents;
              this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};
            }  else  {
              this.toolSrv.setToast('error', '请求错误', val.message);
            }
          }
        );
      }
    });
    this.refundPendReviewTableTitleStyle = {background: '#282A31', color: '#DEDEDE', height: '6vh'};
    console.log(this.refundPendReviewSelect);

  }

  // condition search click
  public refundPendReviewSearchClick(): void {
    console.log('这里是条件搜索');
  }
  // detail refundPendReviewInfo
  public refundPendReviewDetailClick(e): void {
    console.log(e);
    this.refundPendReviewDetail = e;
    this.toolSrv.getAdminStatus('ARREARS_STATUS', (data) => {
       if (data.length > 0) {
         this.toolSrv.setDataFormat(data, this.refundPendReviewDetail.refundStatus, (list, dataName) => {
           this.refundStatusDetail = dataName;
         });
       }
    });
    this.toolSrv.getAdminStatus('CHARGE_TYPE', (data) => {
      if (data.length > 0) {
        this.toolSrv.setDataFormat(data, this.refundPendReviewDetail.refundStatus, (list, dataName) => {
          this.paymentTypeDetail = dataName;
        });
      }
    });
    this.refundPendReviewDetailDialog = true;
  }


  // refundPendReview
  public  refundPendReviewClick(): void {
    if (this.refundPendReviewSelect === undefined || this.refundPendReviewSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要审核的项');

    } else if (this.refundPendReviewSelect.length === 1) {
      this.refundPendReviewDialog = true;

    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行审核');

    }
  }
  public  refundPendReviewSureClick(): void {
    if (this.reviewStatus === '通过') {
      this.refundPendReviewSrv.paasRefundAuditedInfo({id: this.refundPendReviewSelect[0].id}).subscribe(
        value => {
          this.toolSrv.setToast('success' , '操作成功', value.message);
          this.refundPendReviewInitialization();
          this.refundPendReviewDialog = false;
        }
      );
    }  else {
      this.refundPendReviewSrv.RefundNoPaasAudited({id: this.refundPendReviewSelect[0].id}).subscribe(
        value => {
          this.toolSrv.setToast('success' , '操作成功', value.message);
          this.refundPendReviewInitialization();
          this.refundPendReviewDialog = false;
        }
      );
    }
  }
  // select houseinfo
  public refundPendReviewonRowSelect(e): void {
    // this.refundPendReviewModify = e.data;
  }
  // get refundPendReview Pagination
  public nowpageEventHandle(event: any): void {
    this.loadingHide = false;

    this.refundPendReviewSrv.queryRefundAuditedPageInfo({pageNo: event, pageSize: 10}).subscribe(
      (value) => {
        console.log(value);
        this.loadingHide = true;
        this.refundPendReviewTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};

      }
    );
    this.refundPendReviewSelect = [];
  }
}
