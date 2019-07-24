import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {CouponReviewService} from '../../../common/services/coupon-review.service';
import {CouponReview} from '../../../common/model/coupon-review.model';

@Component({
  selector: 'rbi-coupon-review',
  templateUrl: './coupon-review.component.html',
  styleUrls: ['./coupon-review.component.less']
})
export class CouponReviewComponent implements OnInit {


  @ViewChild('input') input: Input;
  // @ViewChild('file') file: Input;
  public couponReviewTableTitle: any;
  public couponReviewTableContent: CouponReview[] = [];
  // public couponReviewTableContent: any;
  public couponReviewTableTitleStyle: any;
  public couponReviewSelect: any;
  // 添加相关
  public couponReviewAddDialog: boolean;
  // public couponReviewAdd: any;
  // 修改相关
  public couponReviewModifayDialog: boolean;
  // public couponReviewModify: any;
  public couponReviewDetailDialog: boolean;
  public couponReviewDetail: CouponReview = new CouponReview();
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
  // 审核相关
  public couponReviewDialog: any;
  public reviewStatus  = '通过';
  // 上传相关
  // public couponReviewUploadFileDialog: boolean;
  // public uploadedFiles: any[] = [];
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  public loadingHide = true;
  public couponReviewSeachData: any;
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
    // private ownreService: BfcouponReviewService
    private couponReviewSrv: CouponReviewService
  ) {
  }

  ngOnInit() {
    this.couponReviewInitialization();
  }

  // initialization houseinfo
  public couponReviewInitialization(): void {
    console.log('这里是信息的初始化');
    this.couponReviewTableTitle = [
      {field: 'roomCode', header: '房间代码'},
      {field: 'couponName', header: '优惠券名称'},
      {field: 'surname', header: '客户名称'},
      {field: 'mobilePhone', header: '客户电话'},
      {field: 'effectiveTime', header: '有效时长'},
      {field: 'money', header: '金额'},
      {field: 'operating', header: '操作'}
    ];
    this.loadingHide = false;
    this.couponReviewSrv.queryCouponReviewPageData({pageNo: this.nowPage, pageSize: 10}).subscribe(
      (value) => {
        console.log(value);
        this.loadingHide = true;
        this.couponReviewTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
    this.couponReviewTableTitleStyle = {background: '#282A31', color: '#DEDEDE', height: '6vh'};
    console.log(this.couponReviewSelect);

  }

  // condition search click
  public couponReviewSearchClick(): void {
    // @ts-ignore
    // if (this.couponReviewSeachData !== undefined ) {
    //   if (isNaN(this.couponReviewSeachData)) {
    //     this.chargecouponReviewSrv.queryConditionalcouponReview({}).subscribe(
    //       (value) => {
    //         console.log(value);
    //       }
    //     );
    //   } else {
    //     this.chargecouponReviewSrv.queryConditionalcouponReview({}).subscribe(
    //       (value) => {
    //         console.log(value);
    //       }
    //     );
    //   }
    // }
    console.log('这里是条件搜索');
  }
  // detail couponReviewInfo
  public couponReviewDetailClick(e): void {
    this.couponReviewDetailDialog = true;
    console.log(e);
    this.couponReviewDetail = e;
    if (e.effectiveTime === 0 ) {
      this.couponEffectiveTime = '无期限';
    } else  {
      this.couponEffectiveTime = e.effectiveTime + '天';
    }
    this.couponReviewSrv.queryCouponType({}).subscribe(
      val => {
        console.log(val);
        val.data.forEach( v => {
          if (e.couponType === v.settingCode) {
            this.couponTypeName = v.settingName;
          }
        });
      }
    );
  }

  // couponreview
  public  couponReviewClick(): void {
    if (this.couponReviewSelect === undefined || this.couponReviewSelect.length === 0) {
      this.setToast('error', '操作错误', '请选择需要审核的项');

    } else if (this.couponReviewSelect.length === 1) {
      this.couponReviewDialog = true;
    } else {
      this.setToast('error', '操作错误', '只能选择一项进行审核');
    }
  }
  public  refundReviewSureClick(): void {
    if (this.reviewStatus === '通过') {
      this.couponReviewSrv.couponReviewPassById({id: this.couponReviewSelect[0].id}).subscribe(
        value => {
          if (value.status === '1000') {
            this.setToast('success' , '操作成功', value.message);
            this.couponReviewInitialization();
            this.couponReviewSelect = null;
            this.couponReviewDialog = false;
          } else {
            this.setToast('error' , '操作失败', value.message);

          }
        }
      );
    } else {
      this.couponReviewSrv.couponReviewNoPassById({id: this.couponReviewSelect[0].id}).subscribe(
        value => {
          if (value.status === '1000') {
            this.setToast('success' , '操作成功', value.message);
            this.couponReviewInitialization();
            this.couponReviewSelect = null;
            this.couponReviewDialog = false;
          } else {
            this.setToast('error' , '操作失败', value.message);

          }
        }
      );
    }
  }
  // select houseinfo
  public couponReviewonRowSelect(e): void {
    // this.couponReviewModify = e.data;
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
  // get couponReview Pagination
  public nowpageEventHandle(event: any): void {
    this.loadingHide = false;

    this.couponReviewSrv.queryCouponReviewPageData({pageNo: event, pageSize: 10}).subscribe(
      (value) => {
        console.log(value);
        this.loadingHide = true;
        this.couponReviewTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};

      }
    );
    this.couponReviewSelect = [];
  }
}
