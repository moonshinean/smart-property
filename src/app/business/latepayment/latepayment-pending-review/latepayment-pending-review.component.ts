import {Component, OnDestroy, OnInit} from '@angular/core';
import {LatePaymentQueryData} from '../../../common/model/latepayment.model';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {LatePaymentService} from '../../../common/services/late-payment.service';
import {BtnOption} from '../../../common/components/header-btn/headerData.model';
import {ThemeService} from '../../../common/public/theme.service';
import {Subscription} from 'rxjs';
import {GlobalService} from '../../../common/services/global.service';
import {LocalStorageService} from '../../../common/services/local-storage.service';

@Component({
  selector: 'rbi-latepayment-pending-review',
  templateUrl: './latepayment-pending-review.component.html',
  styleUrls: ['./latepayment-pending-review.component.less']
})
export class LatepaymentPendingReviewComponent implements OnInit, OnDestroy {

  public latePaymentContents: any;
  public optionTable: any;
  public reviewOption: any;
  public latependreviewSelect = [];
  // 基础按钮相关
  public btnOption: BtnOption = new BtnOption();
  public SearchData: LatePaymentQueryData = new LatePaymentQueryData();
  // 详情相关
  public dialogOption: any;
  public detailTitle = [
    {field: 'orderId', header: '订单编号'},
    {field: 'villageName', header: '小区名称'},
    {field: 'regionName', header: '地块名称'},
    {field: 'buildingName', header: '楼宇名称'},
    {field: 'unitName', header: '单元名称'},
    {field: 'roomCode', header: '房间号'},
    {field: 'roomSize', header: '房间大小'},
    {field: 'surname', header: '客户姓'},
    {field: 'mobilePhone', header: '手机号'},
    {field: 'amountTotalReceivable', header: '应收总金额'},
    {field: 'actualTotalMoneyCollection', header: '实收总金额'},
    {field: 'surplusTotal', header: '减免金额'},
    {field: 'surplusReason', header: '减免原因'},
    {field: 'auditStatus', header: '审核状态'},
    {field: 'reviserId', header: '修订人'},
    {field: 'auditId', header: '审核人'},
    {field: 'retrialId', header: '复核人'},
    {field: 'propertyActualMoneyCollection', header: '物业费金额'},
    {field: 'month', header: '缴费月数'},
    {field: 'liquidatedDamageDueTime', header: '违约金到期时间'},
    {field: 'startTime', header: '物业费计费开始时间'},
    {field: 'dueTime', header: '物业费计费结束时间'},
    {field: 'oneMonthPropertyFeeAmount', header: '单月物业费'},
    {field: 'tollCollectorName', header: '操作人姓名'},
    {field: 'superfluousAmount', header: '超额物业费'},
    {field: 'reviserName', header: '修订人姓名'},
    {field: 'auditName', header: '审核人姓名'},
    {field: 'retrialName', header: '复审人姓名'},
    {field: 'quarterlyCycleTime', header: '季度周期循环时间'},
    {field: 'remarks', header: '备注'},

  ];
  // 其他相关
  public pageOption: any;
  public loadHidden = true;
  public themeSub: Subscription;
  public table = {
    tableheader: {background: '', color: ''},
    tableContent: [
      {background: '', color: ''},
      {background: '', color: ''}],
    detailBtn: ''
  };
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private toolSrv: PublicMethedService,
    private lateSrv: LatePaymentService,
    private globalSrv: GlobalService,
    private localSrv: LocalStorageService,
    private themeSrv: ThemeService,
  ) {
    this.themeSub =  this.themeSrv.changeEmitted$.subscribe(
      value => {
        this.table.tableheader = value.table.header;
        this.table.tableContent = value.table.content;
        this.table.detailBtn = value.table.detailBtn;
        this.setTableOption(this.latePaymentContents);
      }
    );
  }
  ngOnInit() {
    this.btnOption.btnlist = [
      // {label: '新增', src: 'assets/images/ic_add.png', style: {background: '#55AB7F', marginLeft: '2vw'} },
      // {label: '修改', src: 'assets/images/ic_modify.png', style: {background: '#3A78DA', marginLeft: '1vw'} },
      // {label: '删除', src: 'assets/images/ic_delete.png', style: {background: '#A84847', marginLeft: '1vw'} },
      {label: '审核', src: '', style: {background: '#55AB7F', marginLeft: '2vw'}, hidden: true},
    ];
    if (this.themeSrv.setTheme !== undefined) {
      this.table.tableheader = this.themeSrv.setTheme.table.header;
      this.table.tableContent = this.themeSrv.setTheme.table.content;
      this.table.detailBtn = this.themeSrv.setTheme.table.detailBtn;
    }
    this.latependreviewInitialization();
  }
  ngOnDestroy(): void {
    this.themeSub.unsubscribe();
  }
  // Initialize latependreview data
  public  latependreviewInitialization(): void {
    this.SearchData.pageNo = 1;
    this.SearchData.pageSize = 10;
    this.queryData(this.SearchData);
  }
  // paging query
  public  nowpageEventHandle(event: any): void {
    this.SearchData.pageNo = event;
    // this.SearchData.pageNo = 10;
    // console.log(this.SearchData);
    this.queryData(this.SearchData);
  }
  // show upload file dialog
  public reviewClick(): void {
    if (this.latependreviewSelect.length === undefined || this.latependreviewSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择一项进行审核');
    } else if(this.latependreviewSelect.length === 1) {
      this.reviewOption = {
        width: '500',
        dialog: true
      };
    } else  {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行审核');
    }
  }
  // set table data
  public  setTableOption(data1): void {
    this.optionTable = {
      width: '101.4%',
      header: {
        data:  [
          {field: 'orderId', header: '订单编号'},
          {field: 'villageName', header: '小区名称'},
          {field: 'roomCode', header: '房间号'},
          {field: 'roomSize', header: '房间大小'},
          {field: 'surname', header: '客户姓'},
          {field: 'mobilePhone', header: '手机号'},
          {field: 'propertyActualMoneyCollection', header: '物业费金额'},
          {field: 'actualTotalMoneyCollection', header: '实收金额'},
          {field: 'month', header: '缴费月数'},
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
  // set detail dialog data
  public  detailClick(e): void {
    if (e.liquidatedDamages) {
      this.dialogOption = {
        dialog: true,
        tableHidden: true,
        width: '1000',
        type: 2,
        title: '详情',
        poplist: {
          popContent: e,
          popTitle: this.detailTitle,
        },
        tablelist: {
          width: '104%',
          title: '违约金信息',
          tableHeader: {
            data: [
              {field: 'dueTimeFront', header: '季度初'},
              {field: 'dueTimeAfter', header: '季度末'},
              {field: 'days', header: '欠费天数'},
              {field: 'amountMoney', header: '金额'},
            ],
            style: {background: '#ffffff', color: '#000000', height: '6vh'},
          },
          tableContent: {
            data: JSON.parse(e.liquidatedDamages),
            styleone: {background: '#ffffff', color: '#000', textAlign: 'center', height: '2vw'},
            styletwo: {background: '#ffffff', color: '#000', textAlign: 'center', height: '2vw'}
          },
        }
      };
    } else {
      this.dialogOption = {
        dialog: true,
        tableHidden: false,
        width: '1000',
        type: 2,
        title: '详情',
        poplist: {
          popContent: e,
          popTitle:  this.detailTitle,
        }
      };
    }
  }
  // query data
  public  queryData(data): void {
    // this.SearchData.pageSize = 10;
    this.loadHidden = false;
    this.lateSrv.queryLatePaymentPendReviewPageData(data).subscribe(
      value => {
        this.loadHidden = true;
        if (value.status === '1000') {
          this.latePaymentContents = value.data.contents;
          this.setTableOption(value.data.contents);
          this.pageOption = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        } else {
          this.toolSrv.setToast('error', '请求失败', value.message);
        }
      }
    );
  }
  // sure review pass
  public  reviewPassClick(e): void {

    if (e === '通过') {
      // 审核通过时的请求
      this.lateSrv.reviewLatePaymentAgainPass({id: this.latependreviewSelect[0].id}).subscribe(
        value => {
          this.toolSrv.setQuestJudgment(value.status, value.message, () => {
            this.queryData(this.SearchData);
            this.clearSelect();
          });
        }
      );
    } else if (e === '不通过') {
      // 审核不通过时的请求
      this.lateSrv.reviewLatePaymentNoPass({id: this.latependreviewSelect[0].id}).subscribe(
        value => {
          this.toolSrv.setQuestJudgment(value.status, value.message, () => {
            this.queryData(this.SearchData);
            this.clearSelect();
          });
        }
      );
    } else {
      // console.log(e);
      // this.reviewOption.dialog = false;
      // this.latependreviewSelect = [];
      this.clearSelect();
    }
  }
  // select datat
  public  selectData(e): void {
    this.latependreviewSelect = e;
  }
  // clear select
  public clearSelect(): void {
    this.reviewOption.dialog = false;
    this.latependreviewSelect = [];
  }

  public btnClick(e): void {
    this.reviewClick();
  }
  // search data
  public  searchClick(e): void {
    if (e.type === 1) {
      this.SearchData.mobilePhone = '';
      this.SearchData.roomCode = '';
      this.queryData(this.SearchData);
    } else if (e.type === 2) {
      if (e.value === '') {
        this.toolSrv.setToast('error', '操作错误', '请输入搜索的值');
      } else {
        this.SearchData.mobilePhone = '';
        this.SearchData.roomCode = e.value;
        this.queryData(this.SearchData);
      }
    } else {
      if (e.value === '') {
        this.toolSrv.setToast('error', '操作错误', '请输入搜索的值');
      } else {
        this.SearchData.roomCode = '';
        this.SearchData.mobilePhone = e.value;
        this.queryData(this.SearchData);
      }
    }
  }

  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '待复审') {
        this.globalSrv.getChildrenRouter({parentCode: v.parentCode}).subscribe(value => {
          if (value.data.length !== 0) {
            value.data.forEach( vitem => {
              this.btnOption.btnlist.forEach( val => {
                if (vitem.title === val.label) {
                  val.hidden = false;
                }
              });
            });
          }
        });
      }
    });
  }
}
