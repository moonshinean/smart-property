import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CouponPendingReview} from '../../../common/model/coupon-pending-review.model';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {CouponService} from '../../../common/services/coupon.service';
import {ThemeService} from '../../../common/public/theme.service';
import {Subscription} from 'rxjs';
import {GlobalService} from '../../../common/services/global.service';
import {LocalStorageService} from '../../../common/services/local-storage.service';
import {SharedServiceService} from '../../../common/public/shared-service.service';

@Component({
  selector: 'rbi-coupon-pending-review',
  templateUrl: './coupon-pending-review.component.html',
  styleUrls: ['./coupon-pending-review.component.less']
})
export class CouponPendingReviewComponent implements OnInit, OnDestroy {
  public couponPendRevieweContent: any;
  public couponPendReviewOption: any;
  public couponPendingReviewSelect: any;
  // 添加相关
  // 审核相关
  public reviewOption: any;
  // 状态相关
  public userStatusOption = [];
  public couponTypeOption = [];
  public auditStatusOption = [];
  public pastDueOption = [];
  // 详情相关
  public couponPendReviewDetailOption: any;
  public esDate: any;
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  public loadingHide = true;
  public nowPage = 1;
  // 搜索相关
  public searchOption = [
    {label: '手机号', value: 1},
    {label: '房间号', value: 2},
    {label: '姓名', value: 3},
    {label: '身份证号', value: 4},
  ];
  public SearchCoupon = {
    villageCode: '',
    regionCode: '',
    buildingCode:  '',
    unitCode: '',
    roomCode: '',
    mobilePhone: '',
    idNumber: '',
    surname: '',
    pageNo: 1,
    pageSize: 10
  };
  public searchType = 0;
  public searchData =  '';
  // 按钮权限相关
  public btnHiden = [
    {label: '审核', hidden: true},
    {label: '搜索', hidden: true},
  ];
  public themeSub: Subscription;
  public table = {
    tableheader: {background: '', color: ''},
    tableContent: [
      {background: '', color: ''},
      {background: '', color: ''}],
    detailBtn: ''
  };
  // 树结构订阅
  public couponSub: Subscription;
  constructor(
    // private ownreService: BfcouponPendingReviewService
    private couponPendingReviewSrv: CouponService,
    private toolSrv: PublicMethedService,
    private globalSrv: GlobalService,
    private localSrv: LocalStorageService,
    private  sharedSrv: SharedServiceService,
    private themeSrv: ThemeService,
  ) {
    this.themeSub =  this.themeSrv.changeEmitted$.subscribe(
      value => {
        this.table.tableheader = value.table.header;
        this.table.tableContent = value.table.content;
        this.table.detailBtn = value.table.detailBtn;
        this.setTableOption(this.couponPendRevieweContent);
      }
    );
    this.couponSub = this.sharedSrv.changeEmitted$.subscribe(
      value => {
        for (const key in value) {
          if (key !== 'data') {
            this.SearchCoupon[key] = value[key];
          }
        }
        this.nowPage = this.SearchCoupon.pageNo = 1;
        this.reslveSearchData();
        this.queryCouponPendReviewPageData();
      }
    );
  }

  ngOnInit() {
    this.setBtnIsHidden();
    if (this.themeSrv.setTheme !== undefined) {
      this.table.tableheader = this.themeSrv.setTheme.table.header;
      this.table.tableContent = this.themeSrv.setTheme.table.content;
      this.table.detailBtn = this.themeSrv.setTheme.table.detailBtn;
    }
    if (this.sharedSrv.SearchData !== undefined) {
      for (const key in this.sharedSrv.SearchData) {
        if (key !== 'data') {
          this.SearchCoupon[key] = this.sharedSrv.SearchData[key];
        }
      }
    }
    this.esDate = this.toolSrv.esDate;
    this.couponPendingReviewInitialization();
  }
  ngOnDestroy(): void {
    this.themeSub.unsubscribe();
    this.couponSub.unsubscribe();
  }

  // initialization houseinfo
  public couponPendingReviewInitialization(): void {
    this.toolSrv.getAdmStatus([{settingType: 'COUPON_TYPE'}, {settingType: 'USE_STATUS'}, {settingType: 'PAST_DUE'}, {settingType: 'AUDIT_STATUS'}], (data) => {
      this.couponTypeOption = this.toolSrv.setListMap(data.COUPON_TYPE);
      this.auditStatusOption = this.toolSrv.setListMap(data.AUDIT_STATUS);
      this.pastDueOption = this.toolSrv.setListMap(data.PAST_DUE);
      this.userStatusOption = this.toolSrv.setListMap(data.USE_STATUS);
      this.queryCouponPendReviewPageData();
    });
  }

  // condition search click
  public couponPendingReviewSearchClick(): void {
    if (this.searchData !== '') {
      this.selectSearchType();
    } else {
      this.toolSrv.setToast('error', '操作错误', '请填写需要搜索的值');
    }
  }
  // 判断搜索方式
  public  selectSearchType(): void {
    switch (this.searchType) {
      case 0: this.reslveSearchData();
              this.queryCouponPendReviewPageData(); break;
      case 1: this.setSearData('mobilePhone'); this.SearchCoupon.mobilePhone = this.searchData; this.queryCouponPendReviewPageData(); break;
      case 2: this.setSearData('roomCode'); this.SearchCoupon.roomCode = this.searchData; this.queryCouponPendReviewPageData(); break;
      case 3: this.setSearData('surname'); this.SearchCoupon.surname = this.searchData;  this.queryCouponPendReviewPageData(); break;
      case 4: this.setSearData('idNumber'); this.SearchCoupon.idNumber = this.searchData; this.queryCouponPendReviewPageData(); break;
      default:
        break;
    }
  }
  // 重置数据
  public  setSearData(label): void {
    for (const serchKey in this.SearchCoupon) {
      if (serchKey !== label && serchKey !== 'pageSize' && serchKey !== 'pageNo') {
        this.SearchCoupon[serchKey] = '';
      }
    }
  }
  // 重置搜索条件
  public  reslveSearchData(): void {
    this.SearchCoupon.mobilePhone = '';
    this.SearchCoupon.surname = '';
    this.SearchCoupon.idNumber = '';
  }
  // detail couponPendingReviewInfo
  public couponPendingReviewDetailClick(e): void {
    e.couponType = this.toolSrv.setValueToLabel(this.couponTypeOption, e.couponType);
    e.usageState = this.toolSrv.setValueToLabel(this.userStatusOption, e.usageState);

    this.couponPendReviewDetailOption = {
      dialog: true,
      tableHidden: false,
      width: '1000',
      type: 1,
      title: '详情',
      poplist: {
        popContent: e,
        popTitle:  [
          {field: 'villageName', header: '小区名称'},
          {field: 'regionName', header: '地块名称'},
          {field: 'buildingName', header: '楼宇名称'},
          {field: 'unitName', header: '单元名称'},
          {field: 'roomCode', header: '房间编号'},
          {field: 'surname', header: '客户姓名'},
          {field: 'mobilePhone', header: '客户电话'},

          {field: 'couponName', header: '优惠券名称'},
          {field: 'money', header: '优惠金额'},
          {field: 'effectiveTime', header: '有效时长'},
          {field: 'pastDue', header: '过期状态'},
          {field: 'usageState', header: '使用状态'},
          {field: 'remarks', header: '备注 '},
        ],
      }
    };
  }

  // couponPendingReview
  public  couponPendingReviewClick(): void {
    if (this.couponPendingReviewSelect === undefined || this.couponPendingReviewSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要审核的项');

    } else if (this.couponPendingReviewSelect.length === 1) {
      this.reviewOption = {
        width: '500',
        dialog: true
      };
    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行审核');

    }
  }
  // 确认审核
  public  refundPendingReviewSureClick(e): void {
    console.log(e);
    if (e === '通过') {
      this.couponPendingReviewSrv.couponPendingReviewPassById({id: this.couponPendingReviewSelect[0].id}).subscribe(
        value => {
          if (value.status === '1000') {
            this.toolSrv.setToast('success' , '操作成功', value.message);
            this.clearData();
            this.couponPendingReviewInitialization();
          } else {
            this.toolSrv.setToast('error' , '操作失败', value.message);

          }
        }
      );
    } else if (e === '不通过') {
      this.couponPendingReviewSrv.couponPendingReviewNoPassById({id: this.couponPendingReviewSelect[0].id}).subscribe(
        value => {
          if (value.status === '1000') {
            this.toolSrv.setToast('success' , '操作成功', value.message);
            this.clearData();
            this.couponPendingReviewInitialization();
          } else {
            this.toolSrv.setToast('error' , '操作失败', value.message);

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
    this.couponPendingReviewSelect = [];
  }
  // get couponPendingReview Pagination
  public nowpageEventHandle(event: any): void {
    this.loadingHide = false;
    this.nowPage = event;
    this.selectSearchType();
  }
  // 设置表格
  public  setTableOption(data1): void {
    this.couponPendReviewOption = {
      width: '101.4%',
      header: {
        data:   [
          {field: 'roomCode', header: '房间代码'},
          {field: 'couponName', header: '优惠券名称'},
          {field: 'surname', header: '客户名称'},
          {field: 'mobilePhone', header: '客户电话'},
          {field: 'effectiveTime', header: '有效时长'},
          {field: 'money', header: '金额'},
          {field: 'operating', header: '操作'}
        ],
        style: {background: this.table.tableheader.background, color: this.table.tableheader.color, height: '6vh'}
      },
      Content: {
        data: data1,
        styleone: {background: this.table.tableContent[0].background, color: this.table.tableContent[0].color, textAlign: 'center', height: '2vw'},
        styletwo: {background: this.table.tableContent[1].background, color: this.table.tableContent[1].color, textAlign: 'center', height: '2vw'},
      },
      type: 2,
      tableList:  [{label: '详情', color: this.table.detailBtn}]
    };
  }

  // 选择数据
  public  selectData(e): void {
    this.couponPendingReviewSelect = e;
  }

  public  queryCouponPendReviewPageData(): void {
    this.couponPendingReviewSrv.queryCouponPendingReviewPageData(this.SearchCoupon).subscribe(
      (value) => {
        this.loadingHide = true;
        value.data.contents.forEach( v => {
          v.effectiveTime = (v.effectiveTime === 0 || v.effectiveTime === '0') ? '无期限' : v.effectiveTime + '天';
          v.auditStatus = this.toolSrv.setValueToLabel(this.auditStatusOption, v.auditStatus);
          v.pastDue = this.toolSrv.setValueToLabel(this.pastDueOption, v.pastDue);
        });
        this.couponPendRevieweContent = value.data.contents;
        this.setTableOption(value.data.contents);
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
  }
  // 设置按钮显示权限
  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '优惠券复审') {
        this.globalSrv.getChildrenRouter({parentCode: v.parentCode}).subscribe(value => {
          console.log(value);
          value.data.forEach(item => {
            this.btnHiden.forEach( val => {
              if (item.title === val.label) {
                val.hidden = false;
              }
            });
          });
        });
      }
    });
  }
}
