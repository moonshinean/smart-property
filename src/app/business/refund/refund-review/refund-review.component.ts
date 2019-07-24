import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CouponReview} from '../../../common/model/coupon-review.model';
import {ConfirmationService, MessageService} from 'primeng/api';
import {CouponReviewService} from '../../../common/services/coupon-review.service';
import {RefundReviewService} from '../../../common/services/refund-review.service';
import {ModifyRefundInfo} from '../../../common/model/refund-info.model';

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
  public couponMoney: any;
  public couponEffectiveTime: any;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    // private ownreService: BfrefundReviewService
    private refundReviewSrv: RefundReviewService
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
    this.refundReviewSrv.queryRefundStatus({settingType: 'AUDIT_STATUS'}).subscribe(
      value => {
        if (value.data.length > 0) {
          this.refundReviewSrv.queryRefundAuditedPageInfo({pageNo: this.nowPage, pageSize: 10}).subscribe(
            (val) => {
              if (val.status === '1000') {
                console.log(val);
                this.loadingHide = true;
                val.data.contents.forEach( h => {
                  value.data.forEach( v => {
                    if (h.auditStatus.toString() === v.settingCode) {
                      h.auditStatus = v.settingName;
                    }
                  });
                });
                this.refundReviewTableContent = val.data.contents;
                this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};
              } else  {
                this.setToast('error', '请求失败', val.message);
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
                this.setToast('error', '请求失败', val.message);
              }
            }
          );
        }
      }
    );
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
    this.refundReviewSrv.queryRefundStatus({settingType: 'REFUND_STATUS'}).subscribe(
      value => {
        if (value.data.length > 0) {
          value.data.forEach( v => {
            if (this.refundReviewDetail.refundStatus.toString() === v.settingCode) {
              this.refundStatusDetail = v.settingName;
            }
          });
        }
      }
    );
    this.refundReviewSrv.queryRefundStatus({settingType: 'CHARGE_TYPE'}).subscribe(
      value => {
        if (value.data.length > 0) {
          value.data.forEach( v => {
            if (this.refundReviewDetail.paymentType.toString() === v.settingCode) {
              this.paymentTypeDetail = v.settingName;
            }
          });
        }
      }
    );
    this.refundReviewDetailDialog = true;

    // if (e.effectiveTime === 0 ) {
    //   this.couponEffectiveTime = '无期限';
    // } else  {
    //   this.couponEffectiveTime = e.effectiveTime + '天';
    // }
    // this.refundReviewSrv.queryCouponType({}).subscribe(
    //   val => {
    //     console.log(val);
    //     val.data.forEach( v => {
    //       if (e.couponType === v.settingCode) {
    //         this.couponTypeName = v.settingName;
    //       }
    //     });
    //   }
    // );
  }

  // refundReview
  public  refundReviewClick(): void {
    if (this.refundReviewSelect === undefined || this.refundReviewSelect.length === 0) {
      this.setToast('error', '操作错误', '请选择需要审核的项');

    } else if (this.refundReviewSelect.length === 1) {
        this.refundReviewDialog = true;
    } else {
      this.setToast('error', '操作错误', '只能选择一项进行审核');

    }
  }
  public  refundReviewSureClick(): void {
    if (this.reviewStatus === '通过') {
      console.log(this.refundReviewSelect[0].id);
      this.refundReviewSrv.passRefundAudited({id: this.refundReviewSelect[0].id}).subscribe(
        value => {
          this.setToast('success' , '操作成功', value.message);
          this.refundReviewInitialization();
          this.refundReviewDialog = false;
          this.refundReviewSelect = null;
        }
      );
    }else {
      this.refundReviewSrv.RefundNoPassStatus({id: this.refundReviewSelect[0].id}).subscribe(
        value => {
          this.setToast('success' , '操作成功', value.message);
          this.refundReviewInitialization();
          this.refundReviewDialog = false;
          this.refundReviewSelect = null;
        }
      );
    }
    // this.confirmationService.confirm({
    //   message: `确认要审核${this.reviewStatus}吗？`,
    //   header: '审核提醒',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {
    //
    //     // console.log(this.couponTotalSelect);
    //
    //     // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
    //   },
    //   reject: () => {
    //     console.log('这里是修改信息');
    //
    //     // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
    //   }
    // });

  }
  // select houseinfo
  public refundReviewonRowSelect(e): void {
    // this.refundReviewModify = e.data;
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
