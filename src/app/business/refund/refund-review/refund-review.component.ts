import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {ModifyRefundInfo} from '../../../common/model/refund-info.model';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {RefundService} from '../../../common/services/refund.service';
import {ThemeService} from '../../../common/public/theme.service';
import {Subscription} from 'rxjs';
import {GlobalService} from '../../../common/services/global.service';
import {LocalStorageService} from '../../../common/services/local-storage.service';
import {SharedServiceService} from '../../../common/public/shared-service.service';

@Component({
  selector: 'rbi-refund-review',
  templateUrl: './refund-review.component.html',
  styleUrls: ['./refund-review.component.less']
})
export class RefundReviewComponent implements OnInit, OnDestroy {

  public refundReviewSelect: any;
  public refundReviewContents: any;

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

  public nowPage = 1;

  public themeSub: Subscription;
  public table = {
    tableheader: {background: '', color: ''},
    tableContent: [
      {background: '', color: ''},
      {background: '', color: ''}],
    detailBtn: ''
  };
  // 按钮权限相关
  public btnHiden = [
    {label: '审核', hidden: true},
    // {label: '修改', hidden: true},
    // {label: '删除', hidden: true},
    {label: '搜索', hidden: true},
  ];
  // 树结构订阅
  public refundSub: Subscription;
  // 搜索相关
  public SearchData = {
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
  public searchOption = [
    {label: '手机号', value: 1},
    {label: '房间号', value: 2},
    {label: '姓名', value: 3},
    {label: '身份证号', value: 4},
  ];
  public searchType = 0;
  public searchData = '';
  constructor(
    private refundReviewSrv: RefundService,
    private toolSrv: PublicMethedService,
    private globalSrv: GlobalService,
    private localSrv: LocalStorageService,
    private sharedSrv: SharedServiceService,
    private themeSrv: ThemeService
  ) {
    this.themeSub =  this.themeSrv.changeEmitted$.subscribe(
      value => {
        this.table.tableheader = value.table.header;
        this.table.tableContent = value.table.content;
        this.table.detailBtn = value.table.detailBtn;
        this.setTableOption(this.refundReviewContents);
      }
    );
    this.refundSub = this.sharedSrv.changeEmitted$.subscribe(
      value => {
        for (const key in value) {
          if (key !== 'data') {
            this.SearchData[key] = value[key];
          }
        }
        this.nowPage = this.SearchData.pageNo = 1;
        this.reslveSearchData();
        this.queryRefundReviewPageData();
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
          this.SearchData[key] = this.sharedSrv.SearchData[key];
        }
      }
    }
    this.refundReviewInitialization();
  }
  ngOnDestroy(): void {
    this.themeSub.unsubscribe();
    this.refundSub.unsubscribe();
  }

  // initialization houseinfo
  public refundReviewInitialization(): void {
    this.loadingHide = false;
    this.toolSrv.getAdmStatus([{settingType: 'PAYMENT_METHOD'}, {settingType: 'CHARGE_TYPE'}, {settingType: 'REFUND_STATUS'}, {settingType: 'AUDIT_STATUS'}], (data) => {
      this.chargeTypeOption = this.toolSrv.setListMap(data.CHARGE_TYPE);
      this.paymentMethodOption = this.toolSrv.setListMap(data.PAYMENT_METHOD);
      this.refundStatusOption = this.toolSrv.setListMap(data.REFUND_STATUS);
      this.auditStatusOption = this.toolSrv.setListMap(data.AUDIT_STATUS);
      this.queryRefundReviewPageData();
    });
  }

  // // condition search click
  public refundReviewSearchClick(): void {
    this.nowPage = this.SearchData.pageNo = 1;
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
        this.queryRefundReviewPageData(); break;
      case 1: this.setSearData('mobilePhone'); this.SearchData.mobilePhone = this.searchData; this.queryRefundReviewPageData(); break;
      case 2: this.setSearData('roomCode'); this.SearchData.roomCode = this.searchData; this.queryRefundReviewPageData(); break;
      case 3: this.setSearData('surname'); this.SearchData.surname = this.searchData;  this.queryRefundReviewPageData(); break;
      case 4: this.setSearData('idNumber'); this.SearchData.idNumber = this.searchData; this.queryRefundReviewPageData(); break;
      default:
        break;
    }
  }
  // 重置数据
  public  setSearData(label): void {
    for (const serchKey in this.SearchData) {
      if (serchKey !== label && serchKey !== 'pageSize' && serchKey !== 'pageNo') {
        this.SearchData[serchKey] = '';
      }
    }
  }
  // 重置搜索条件
  public  reslveSearchData(): void {
    this.SearchData.mobilePhone = '';
    this.SearchData.surname = '';
    this.SearchData.idNumber = '';
  }
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
          {field: 'villageName', header: '小区名称'},
          {field: 'regionName', header: '地块名称'},
          {field: 'buildingName', header: '楼宇名称'},
          {field: 'unitName', header: '单元名称'},
          {field: 'roomCode', header: '房间编号'},
          {field: 'roomSize', header: '住房面积'},
          {field: 'surname', header: '客户姓名'},
          {field: 'mobilePhone', header: '客户电话'},


          {field: 'chargeName', header: '项目名称'},
          {field: 'actualMoneyCollection', header: '实收金额'},
          // {field: 'paymentMethod', header: '支付方式'},
          {field: 'refundStatus', header: '退款状态'},
          {field: 'auditStatus', header: '审核状态'},

          {field: 'startTime', header: '装修开始时间'},
          {field: 'endTime', header: '装修结束时间'},
          {field: 'personLiable', header: '责任人'},
          {field: 'personLiablePhone', header: '责任人电话'},
          {field: 'responsibleAgencies', header: '负责机构'},

          {field: 'reasonForDeduction', header: '抵扣原因'},
          {field: 'delayReason', header: '延期原因'},

          {field: 'mortgageAmount', header: '被扣金额'},
          {field: 'refundableAmount', header: '可退金额'},
          {field: 'transferCardAmount', header: '退还银行卡金额'},
          {field: 'deductionPropertyFee', header: '抵扣物业费金额'},

          {field: 'deductibleMoney', header: '可抵扣金额'},
          {field: 'deductibledMoney', header: '已抵扣金额'},
          {field: 'surplusDeductibleMoney', header: '剩余可抵扣'},
          {field: 'deductionRecord', header: '抵扣记录'},
          {field: 'remark', header: '备注'},
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
      this.refundReviewSrv.RefundNoPaasAudited({id: this.refundReviewSelect[0].id}).subscribe(
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
    this.SearchData.pageNo = this.nowPage;
    this.selectSearchType();
    this.refundReviewSelect = [];
  }

  public  queryRefundReviewPageData(): void {
    this.refundReviewSrv.queryRefundAuditedPageInfo(this.SearchData).subscribe(
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
        this.refundReviewContents = value.data.contents;
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
          // {field: 'orderId', header: '订单Id'},
          {field: 'chargeName', header: '项目名称'},
          {field: 'roomCode', header: '房间编号'},
          {field: 'surname', header: '客户姓名'},
          {field: 'refundStatus', header: '退款状态'},
          {field: 'auditStatus', header: '审核状态'},

          {field: 'actualMoneyCollection', header: '实收金额'},
          {field: 'transferCardAmount', header: '退还银行卡金额'},
          {field: 'deductionPropertyFee', header: '抵扣物业费金额'},
          {field: 'deductibledMoney', header: '已抵扣金额'},
          {field: 'surplusDeductibleMoney', header: '剩余可抵扣金额'},
          // {field: 'payerName', header: '缴费人姓名'},
          // {field: 'paymentMethod', header: '支付方式'},
          {field: 'operating', header: '操作'},
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

  // info select
  public  selectData(e): void {
    this.refundReviewSelect = e;
  }

  public  isOrNull(data: any): boolean {
    return (data !== null && data !== '' && data !== undefined);
  }

  // 设置按钮显示权限
  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '退款初审') {
        this.globalSrv.getChildrenRouter({parentCode: v.parentCode}).subscribe(value => {
          console.log(value);
          value.data.forEach(v => {
            this.btnHiden.forEach( val => {
              if (v.title === val.label) {
                val.hidden = false;
              }
            });
          });
        });
      }
    });
  }
}
