import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApplicationRefund, BudgetClass} from '../../../common/model/refund-no.model';
import {ModifyRefundInfo} from '../../../common/model/refund-info.model';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {RefundService} from '../../../common/services/refund.service';
import {Subscription} from 'rxjs';
import {ThemeService} from '../../../common/public/theme.service';
import {GlobalService} from '../../../common/services/global.service';
import {LocalStorageService} from '../../../common/services/local-storage.service';
import {SharedServiceService} from '../../../common/public/shared-service.service';

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
  public auditStatusOption = [];
  // 添加相关
  public refundNoAdd: any;
  // 详情相关
  public infoNoOption: any;
  public refundNoDetail: ModifyRefundInfo = new ModifyRefundInfo();

  // 申请退款
  public RefundDialog: any;
  // 预算弹窗
  public budgetDialog: any;
  public ApplicationRefund: ApplicationRefund = new ApplicationRefund();

  public budgetClass: BudgetClass = new BudgetClass();
  public refundReason: any;
  public option: any;
  public loadHidden = true;
  public themeSub: Subscription;
  public selData: any;
  public esDate: any;
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
  // 按钮权限相关
  public btnHiden = [
    // {label: '新增', hidden: true},
    // {label: '修改', hidden: true},
    // {label: '删除', hidden: true},
    {label: '搜索', hidden: true},
  ];
  public table = {
    tableheader: {background: '', color: ''},
    tableContent: [
      {background: '', color: ''},
      {background: '', color: ''}],
    detailBtn: ''
  };
  // 树结构订阅
  public refundSub: Subscription;
  // 其他相关
  // public cleanTimer: any; // 清除时钟
  public nowPage = 1;
  constructor(
    private refundNoSrv: RefundService,
    private toolSrv: PublicMethedService,
    private globalSrv: GlobalService,
    private localSrv: LocalStorageService,
    private sharedSrv: SharedServiceService,
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
    this.refundSub = this.sharedSrv.changeEmitted$.subscribe(
      value => {
        for (const key in value) {
          if (key !== 'data') {
            this.SearchData[key] = value[key];
          }
        }
        this.nowPage = this.SearchData.pageNo = 1;
        this.reslveSearchData();
        this.queryRefundNoInfoPageData();
      }
    );
  }

  ngOnInit() {
    this.esDate = this.toolSrv.esDate;
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
    this.refundNoInitialization();
  }

  // initialization refundNo
  public refundNoInitialization(): void {
    this.ApplicationRefund.remark = null;
    this.refundNoTableTitle = [
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
      {field: 'paymentMethod', header: '支付方式'},
      {field: 'operating', header: '操作'},
    ];
    this.loadHidden = false;
    this.toolSrv.getAdmStatus([{settingType: 'PAYMENT_METHOD'}, {settingType: 'AUDIT_STATUS'}, {settingType: 'CHARGE_TYPE'}, {settingType: 'REFUND_STATUS'}, {settingType: 'PARMENT_TYPE'}], (data) => {
      this.chargeTypeOption = this.toolSrv.setListMap(data.CHARGE_TYPE);
      this.paymentMethodOption = this.toolSrv.setListMap(data.PAYMENT_METHOD);
      this.refundStatusOption = this.toolSrv.setListMap(data.REFUND_STATUS);
      this.auditStatusOption = this.toolSrv.setListMap(data.AUDIT_STATUS);
      this.queryRefundNoInfoPageData();
    });

    this.refundNoTableTitleStyle = {background: this.table.tableheader.background, color: this.table.tableheader.color, height: '6vh'};

  }
  ngOnDestroy(): void {
    this.themeSub.unsubscribe();
    this.refundSub.unsubscribe();
  }

  // condition search click
  public refundNoSearchClick(): void {
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
              this.queryRefundNoInfoPageData(); break;
      case 1: this.setSearData('mobilePhone'); this.SearchData.mobilePhone = this.searchData; this.queryRefundNoInfoPageData(); break;
      case 2: this.setSearData('roomCode'); this.SearchData.roomCode = this.searchData; this.queryRefundNoInfoPageData(); break;
      case 3: this.setSearData('surname'); this.SearchData.surname = this.searchData;  this.queryRefundNoInfoPageData(); break;
      case 4: this.setSearData('idNumber'); this.SearchData.idNumber = this.searchData; this.queryRefundNoInfoPageData(); break;
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
  // show refund application dialog
  public  InfoRefundClick(e): void {
    this.selData = e;
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
          {field: 'paymentMethod', header: '支付方式'},
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
    if (Number(this.ApplicationRefund.refundableAmount) !== 0) {
      this.ApplicationRefund.deductionPropertyFee = Number(this.ApplicationRefund.refundableAmount) - Number(this.ApplicationRefund.transferCardAmount);
    } else {
      this.toolSrv.setToast('error', '错误信息', '请检查退还金额数据是否错误');
    }
  }
  // Reset data
  public clearData(): void {
    this.refundNoAdd = null;
    this.refundNoSelect = [];
    this.ApplicationRefund = new ApplicationRefund();
  }
  // paging query
  public nowpageEventHandle(event: any): void {
    this.nowPage = this.SearchData.pageNo = event;
    this.selectSearchType();
  }

  public  queryRefundNoInfoPageData(): void {
    this.refundNoSrv.queryRefundNoInfoPage(this.SearchData).subscribe(
      value => {
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
  }
  // 预算点击
  public  budgetClick(): void {
    console.log(this.selData);
    this.budgetClass.roomCode = this.selData.roomCode;
    this.budgetClass.roomSize = this.selData.roomSize;
    this.budgetDialog = true;
  }
  // 预算费用
  public  budgetFree(): void {
     this.refundNoSrv.budgetRefundFree({roomCode: this.budgetClass.roomCode, roomSize: this.budgetClass.roomSize, datedif: this.budgetClass.datedif}).subscribe(val => {
       console.log(val);
       if (val.status === '1000') {
         this.budgetClass.amoutReceivable = val.data.amountReceivable;
         this.budgetClass.startTime = val.data.startTime;
         this.budgetClass.endTime = val.data.dueTime;
       } else {
         this.toolSrv.setToast('error', '请求失败', val.message);
       }
     });
  }
  // 关闭弹窗
  public  budgetCancle(): void {
      this.budgetDialog = false;
      this.budgetClass.endTime = '';
      this.budgetClass.startTime = '';
      this.budgetClass.datedif = '';
      this.budgetClass.amoutReceivable = '';
  }

  // 设置按钮显示权限
  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '未退款') {
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
