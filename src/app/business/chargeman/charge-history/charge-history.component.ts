import {Component, OnDestroy, OnInit} from '@angular/core';
import {FileOption} from '../../../common/components/basic-dialog/basic-dialog.model';
import {ChargeDetail} from '../../../common/model/charge-detail.model';
import {Subscription} from 'rxjs';
import {ChargeDetailsService} from '../../../common/services/charge-details.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {GlobalService} from '../../../common/services/global.service';
import {LocalStorageService} from '../../../common/services/local-storage.service';
import {SharedServiceService} from '../../../common/public/shared-service.service';
import {ThemeService} from '../../../common/public/theme.service';
import {ChargeHistoryService} from '../../../common/services/charge-history.service';

@Component({
  selector: 'rbi-charge-history',
  templateUrl: './charge-history.component.html',
  styleUrls: ['./charge-history.component.less']
})
export class ChargeHistoryComponent implements OnInit, OnDestroy {

  public option: any;
  public paymentDetailTableContnt: any;
  public paymentDialogTableTitle = [
    {field: 'chargeName', header: '项目名称'},
    {field: 'chargeStandard', header: '标准单价'},
    {field: 'chargeUnit', header: '单位'},
    {field: 'discount', header: '折扣'},
    {field: 'datedif', header: '月/张数'},
    {field: 'amountReceivable', header: '应收金额'},
    {field: 'actualMoneyCollection', header: '实收金额'},
    {field: 'usageAmount', header: '使用量'},
    {field: 'currentReadings', header: '当前读数'},
    {field: 'lastReading', header: '上次读数'},
    {field: 'startTime', header: '开始计费时间'},
    {field: 'dueTime', header: '结束计费时间'},
    {field: 'payerName', header: '缴费人姓名'},
    {field: 'payerPhone', header: '缴费人手机号'},
    {field: 'stateOfArrears', header: '欠费状态'},
  ];
  public deductioTitle = [
    {field: 'deductionItem', header: '抵扣项目'},
    {field: 'deductibleMoney', header: '抵扣金额'},
    {field: 'deductionMethod', header: '抵扣方式'},
    {field: 'deductibledMoney', header: '已抵扣金额'},
    {field: 'surplusDeductibleMoney', header: '剩余可抵扣金额'},
    {field: 'amountDeductedThisTime', header: '本次抵扣金额'},
    {field: 'discount', header: '折扣'},
    {field: 'deductionRecord', header: '抵扣记录'},
  ];
  public deductioContent: any[] = [];
  public liquidatedDamagesStyle: any;
  public uploadFileOption: FileOption = new FileOption();
  public uploadRecordOption: any;
  public optionTable: any;
  // 搜索相关
  public searchType = 0;
  public searchOption = [
    {label: '手机号', value: 1},
    {label: '房间号', value: 2},
    {label: '姓名', value: 3},
    {label: '身份证号', value: 4},
  ];
  public SearchData = {
    villageCode: '',
    regionCode: '',
    buildingCode:  '',
    unitCode: '',
    roomCode: '',
    pageNo: 1,
    pageSize: 10
  };
  public searchData = '';

  // 按钮权限相关
  public btnHiden = [
    {label: '导入', hidden: true},
    {label: '搜索', hidden: true},
  ];
  // 缴费相关
  // public projectSelectDialog: boolean;
  public chargeStatusoption: any[] = [];
  public detailsDialog: any;
  public nowPage = 1;
  // 初始化项目
  public detailsPaymentProject: any;
  public detailsProjectStyle: any;
  // 详情相关
  public chargeDetails: ChargeDetail = new ChargeDetail();
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public loadHidden = true;
  // 树结构订阅
  public detailSub: Subscription;
  // 切换主题
  public themeSub: Subscription;
  public table = {
    tableheader: {background: '', color: ''},
    tableContent: [
      {background: '', color: ''},
      {background: '', color: ''}],
    detailBtn: ''
  };
  constructor(
    private chargeHistorySrv: ChargeHistoryService,
    private toolSrv: PublicMethedService,
    private globalSrv: GlobalService,
    private localSrv: LocalStorageService,
    private  sharedSrv: SharedServiceService,
    private themeSrv: ThemeService
  ) {
    this.themeSub = this.themeSrv.changeEmitted$.subscribe(
      value => {
        this.table.tableheader = value.table.header;
        this.table.tableContent = value.table.content;
        this.table.detailBtn = value.table.detailBtn;
        this.setTableOption(this.paymentDetailTableContnt);
      }
    );
    this.detailSub = this.sharedSrv.changeEmitted$.subscribe(
      value => {
        for (const key in value) {
          if (key !== 'data') {
            this.SearchData[key] = value[key];
          }
        }
        this.nowPage = this.SearchData.pageNo = 1;
        this.queryData();
      }
    );
  }
  ngOnInit() {
    this.setBtnIsHidden();
    if (this.sharedSrv.SearchData !== undefined) {
      for (const key in this.sharedSrv.SearchData) {
        if (key !== 'data') {
          this.SearchData[key] = this.sharedSrv.SearchData[key];
        }
      }
      // this
    }
    if (this.themeSrv.setTheme !== undefined) {
      this.table.tableheader = this.themeSrv.setTheme.table.header;
      this.table.tableContent = this.themeSrv.setTheme.table.content;
      this.table.detailBtn = this.themeSrv.setTheme.table.detailBtn;
    }
    this.detailsInitialization();
  }
  ngOnDestroy(): void {
    this.themeSub.unsubscribe();
    // 取消订阅
    this.detailSub.unsubscribe();
  }

  // initialization details
  public  detailsInitialization(): void {
    this.loadHidden = false;
    this.toolSrv.getAdmStatus([{settingType: 'PAYMENT_METHOD'}] , (data) => {
      this.chargeStatusoption = this.toolSrv.setListMap(data.PAYMENT_METHOD);
      this.queryData();
    });
  }
  // condition search click
  // 判断搜索方式
  public  selectSearchType(): void {
    switch (this.searchType) {
      case 0: this.queryData(); break;
      default:
        break;
    }
  }

  // charge item detail
  public  detailsDialogClick(e): void {
    this.detailsDialog = {
      dialog: true,
      tableHidden: false,
      width: '1000',
      type: 1,
      title: '详情',
      poplist: {
        popContent: e,
        popTitle:  [
          {field: 'roomCode', header: '房间编号'},
          {field: 'deliveryTime', header: '交付时间'},
          {field: 'startTime', header: '开始计费时间'},
          {field: 'roomSize', header: '住房面积'},
          {field: 'vacancyCharge', header: '空置费'},
          {field: 'paidInPropertyFee', header: '实收物业费'},
          {field: 'decorationManagementFee', header: '装修管理费'},
          {field: 'garbageCollectionAndTransportationFee', header: '垃圾清运费'},
          {field: 'decorationDeposit', header: '装修保证金'},
          {field: 'refundedDecorationDeposit', header: '已退装修保证金'},
          {field: 'deductedDecorationDeposit', header: '已抵扣装修保证金'},
          {field: 'cashCoupon', header: '物业代金券'},
          {field: 'oldPropertyBringsNew', header: '老带新'},
          {field: 'deductionThreeWayFees', header: '三通费抵扣'},
          {field: 'reductionIncome', header: '冲减收入'},
          {field: 'idt', header: '上传时间'},
          {field: 'remarks', header: '备注'},
        ],
      }
    };
    // }
  }

  // paging query
  public  nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.SearchData.pageNo = event;
    this.selectSearchType();
  }

  public  uploadFileClick(): void {
    this.uploadFileOption.width = '900';
    this.uploadFileOption.dialog = true;
    this.uploadFileOption.files = [];
  }
  // set table data （设置列表数据）
  public  setTableOption(data1): void {
    this.optionTable = {
      width: '100%',
      header: {
        data:  [
          {field: 'roomCode', header: '房间编号'},
          {field: 'deliveryTime', header: '交付时间'},
          {field: 'startTime', header: '开始计费时间'},
          {field: 'roomSize', header: '住房面积'},
          {field: 'vacancyCharge', header: '空置费'},
          {field: 'paidInPropertyFee', header: '实收物业费'},
          {field: 'decorationManagementFee', header: '装修管理费'},
          {field: 'garbageCollectionAndTransportationFee', header: '垃圾清运费'},
          // {field: 'decorationDeposit', header: '装修保证金'},
          // {field: 'refundedDecorationDeposit', header: '已退装修保证金'},
          // {field: 'deductedDecorationDeposit', header: '已抵扣装修保证金'},
          // {field: 'cashCoupon', header: '物业代金券'},
          // {field: 'oldPropertyBringsNew', header: '老带新'},
          // {field: 'deductionThreeWayFees', header: '三通费抵扣'},
          // {field: 'reductionIncome', header: '冲减收入'},
          // {field: 'remarks', header: '备注'},
          {field: 'idt', header: '上传时间'},
          {field: 'operating', header: '操作'}],
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
  public  uploadFileSureClick(e): void {
    if (e.getAll('file').length !== 0) {
      this.chargeHistorySrv.imporChargeHistoryData(e).subscribe(
        value => {
          console.log(value);
          if (value.status === '1000') {
            this.uploadRecordOption = {
              width: '900',
              dialog: true,
              title: '上传记录',
              totalNumber: value.data.totalNumber,
              realNumber: value.data.realNumber,
              uploadOption: {
                width: '102%',
                tableHeader: {
                  data: [
                    {field: 'code', header: '序号'},
                    {field: 'roomCode', header: '房间编号'},
                    {field: 'result', header: '结果'},
                    {field: 'remarks', header: '备注'},
                  ],
                    style: { background: '#F4F4F4', color: '#000', height: '6vh'}
                  },
                  tableContent: {
                    data: value.data.logOldBillsDOS,
                    styleone: { background: '#FFFFFF', color: '#000', height: '2vw', textAlign: 'center'},
                    styletwo: { background: '#FFFFFF', color: '#000', height: '2vw', textAlign: 'center'}
                  }
              }
            };
            this.queryData();
            this.uploadFileOption.files = [];
          } else {
            this.toolSrv.setToast('error', '操作失败', value.message);
          }
        }
      );
    } else {
      this.toolSrv.setToast('error', '操作错误', '请选择文件');
    }

  }

  // 查找数据
  // public  queryDetail(data): void {
  //   this.chargeHistorySrv.queryBillDetail({orderId: data}).subscribe(
  //     value => {
  //       console.log(value);
  //       if (value.status === '1000') {
  //         this.chargeDetails = value.data.bill;
  //         this.detailsPaymentProject = value.data.billDetailedDOS;
  //         this.deductioContent = value.data.costDeductionDOS;
  //         this.detailsAddTitle.forEach( v => {
  //           v.value = this.chargeDetails[v.label];
  //         });
  //         this.chargeDetails.paymentMethod = this.toolSrv.setValueToLabel(this.chargeStatusoption, this.chargeDetails.paymentMethod);
  //       } else {
  //         this.toolSrv.setToast('error', '请求错误', value.message);
  //       }
  //     }
  //   );
  // }
  // 分页查询
  public  queryData(): void {
    this.chargeHistorySrv.queryChargeHistoryPageInfo(this.SearchData).subscribe(
      (value) => {
        console.log(value);
        this.loadHidden = true;
        if (value.status === '1000') {
          value.data.contents.forEach( v => {
            v.paymentMethod = this.toolSrv.setValueToLabel(this.chargeStatusoption, v.paymentMethod);
          });
          this.paymentDetailTableContnt = value.data.contents;
          this.setTableOption(value.data.contents);
        }
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
  }

  // 设置按钮显示权限
  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '历史数据') {
        this.globalSrv.getChildrenRouter({parentCode: v.parentCode}).subscribe(value => {
          console.log(value);
          value.data.forEach( item => {
            this.btnHiden.forEach( val => {
              if (item.title === val.label) {
                val.hidden = false;
              }
            });
          });
          console.log(this.btnHiden);
        });
      }
    });
  }
}
