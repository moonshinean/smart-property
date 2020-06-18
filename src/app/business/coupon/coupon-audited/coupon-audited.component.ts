import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GlobalService} from '../../../common/services/global.service';
import {CouponAudited} from '../../../common/model/coupon-audited.model';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {CouponService} from '../../../common/services/coupon.service';
import {Subscription} from 'rxjs';
import {ThemeService} from '../../../common/public/theme.service';
import {LocalStorageService} from '../../../common/services/local-storage.service';
import {SharedServiceService} from '../../../common/public/shared-service.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'rbi-coupon-audited',
  templateUrl: './coupon-audited.component.html',
  styleUrls: ['./coupon-audited.component.less']
})
export class CouponAuditedComponent implements OnInit, OnDestroy {

  public couponAuditedOption: any;
  public couponAuditedSelect: any;
  public couponAuditedContents: any;

  // 详情相关
  public couponAuditedDetailOption: any;
  // 状态相关
  public couponTypeOption = [];
  public auditStatusOption = [];
  public pastDueOption = [];
  public userStatusOption = [];
  // 按钮权限相关
  public btnHiden = [
    {label: '搜索', hidden: true},
  ];
  // 其他相关除时钟
  public option: any;
  public nowPage = 1;
  // public msgs: Message[] = []; // 消息弹窗
  public themeSub: Subscription;
  public table = {
    tableheader: {background: '', color: ''},
    tableContent: [
      {background: '', color: ''},
      {background: '', color: ''}],
    detailBtn: ''
  };
  public changeDate = {
    timePreliminaryExamination: '',
    reviewTime: '',
    id: ''
  };
  public roomCode: any;
  public couponModel: boolean = false;
  // 搜索相关
  public searchOption = [
    {label: '手机号', value: 1},
    {label: '房间号', value: 2},
    {label: '姓名', value: 3},
    {label: '身份证号', value: 4},
  ];
  public esDate: any;
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
  // 树结构订阅
  public couponSub: Subscription;
  constructor(
    private couponAuditedSrv: CouponService,
    private toolSrv: PublicMethedService,
    private globalSrv: GlobalService,
    private localSrv: LocalStorageService,
    private  sharedSrv: SharedServiceService,
    private themeSrv: ThemeService,
    private datePipe: DatePipe,
  ) {
    this.themeSub =  this.themeSrv.changeEmitted$.subscribe(
      value => {
        this.table.tableheader = value.table.header;
        this.table.tableContent = value.table.content;
        this.table.detailBtn = value.table.detailBtn;
        this.setTableOption(this.couponAuditedContents);
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
        this.queryCouponAuditedPageData();
      }
    );
    this.esDate = this.toolSrv.esDate;
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
    this.couponAuditedInitialization();
  }
  ngOnDestroy(): void {
    this.themeSub.unsubscribe();
    this.couponSub.unsubscribe();
  }

  // initialization houseinfo
  public couponAuditedInitialization(): void {
    this.toolSrv.getAdmStatus([{settingType: 'COUPON_TYPE'}, {settingType: 'USE_STATUS'}, {settingType: 'PAST_DUE'}, {settingType: 'AUDIT_STATUS'}], (data) => {
      this.couponTypeOption = this.toolSrv.setListMap(data.COUPON_TYPE);
      this.auditStatusOption = this.toolSrv.setListMap(data.AUDIT_STATUS);
      this.pastDueOption = this.toolSrv.setListMap(data.PAST_DUE);
      this.userStatusOption = this.toolSrv.setListMap(data.USE_STATUS);
      this.queryCouponAuditedPageData();
    });
  }
  // condition search click
  public couponAuditedSearchClick(): void {
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
              this.queryCouponAuditedPageData(); break;
      case 1: this.setSearData('mobilePhone'); this.SearchCoupon.mobilePhone = this.searchData; this.queryCouponAuditedPageData(); break;
      case 2: this.setSearData('roomCode'); this.SearchCoupon.roomCode = this.searchData; this.queryCouponAuditedPageData(); break;
      case 3: this.setSearData('surname'); this.SearchCoupon.surname = this.searchData;  this.queryCouponAuditedPageData(); break;
      case 4: this.setSearData('idNumber'); this.SearchCoupon.idNumber = this.searchData; this.queryCouponAuditedPageData(); break;
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

  // detail couponAuditedInfo
  public couponAuditedDetailClick(e): void {
    e.couponType = this.toolSrv.setValueToLabel(this.couponTypeOption, e.couponType);
    e.usageState = this.toolSrv.setValueToLabel(this.userStatusOption, e.usageState);
    this.couponAuditedDetailOption = {
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
          {field: 'auditStatus', header: '审核状态'},
          {field: 'pastDue', header: '过期状态'},
          {field: 'usageState', header: '使用状态'},

          {field: 'deductibleMoney', header: '可抵扣金额'},
          {field: 'deductibledMoney', header: '已抵扣金额'},
          {field: 'surplusDeductibleMoney', header: '剩余可抵扣'},
          {field: 'deductionRecord', header: '抵扣记录'},
          {field: 'remarks', header: '备注 '},
        ],
      }
    };
  }
  // 分页请求
  public nowpageEventHandle(event: any): void {
    this.nowPage = event;
    this.selectSearchType();
    this.couponAuditedSelect = [];
  }
  // 设置表格
  public  setTableOption(data1): void {
    this.couponAuditedOption = {
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
  public  couponAuditedClick(): void {
    if (this.couponAuditedSelect.length === 0) {
      this.toolSrv.setToast('error', '操作失败', '请选择需要修改的项');
    } else if (this.couponAuditedSelect.length === 1) {
      this.couponModel = true;
      console.log(this.couponAuditedSelect);
      this.roomCode = this.couponAuditedSelect[0].roomCode;
      for (const key in this.changeDate) {
        this.changeDate[key] = this.couponAuditedSelect[0][key];
      }
    } else {
      this.toolSrv.setToast('error', '操作失败', '只能选择一项进行修改');
    }
  }
  public  sureChangeDate(): void {
    if (this.changeDate.reviewTime !== '' && this.changeDate.timePreliminaryExamination !== '') {
      this.changeDate.timePreliminaryExamination = this.datePipe.transform(this.changeDate.timePreliminaryExamination, 'yyyy-MM-dd');
      this.changeDate.reviewTime = this.datePipe.transform(this.changeDate.reviewTime, 'yyyy-MM-dd');
      this.couponAuditedSrv.changeReviewCouponInfo(this.changeDate).subscribe(val => {
        console.log(val);
        if (val.status === '1000') {
          this.couponAuditedSelect = [];
          this.couponModel = false;
          this.roomCode = '';
          this.queryCouponAuditedPageData();
          for (const key in this.changeDate) {
            this.changeDate[key] = '';
          }
        } else {
          this.toolSrv.setToast('error', '修改失败', val.message);
        }
      });
    } else {
      this.toolSrv.setToast('error', '操作失败', '时间未选择');
    }
  }
  // 选择数据
  public  selectData(e): void {
    this.couponAuditedSelect = e;
  }
  // 分页查询
  public  queryCouponAuditedPageData(): void {
    this.couponAuditedSrv.queryCouponAuditedPageData(this.SearchCoupon).subscribe(
      (value) => {
        value.data.contents.forEach( v => {
          v.effectiveTime = (v.effectiveTime === 0 || v.effectiveTime === '0') ? '无期限' : v.effectiveTime + '天';
          v.auditStatus = this.toolSrv.setValueToLabel(this.auditStatusOption, v.auditStatus);
          v.pastDue = this.toolSrv.setValueToLabel(this.pastDueOption, v.pastDue);
        });
        this.couponAuditedContents = value.data.contents;
        this.setTableOption(value.data.contents);
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
  }

  // 设置按钮显示权限
  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '已审核') {
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
