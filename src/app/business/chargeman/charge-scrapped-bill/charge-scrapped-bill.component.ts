import {Component, OnDestroy, OnInit} from '@angular/core';
import {FileOption} from '../../../common/components/basic-dialog/basic-dialog.model';
import {ChargeItemDetail, ChargePaymentAddOrder, RentalAddSparkSpace} from '../../../common/model/charge-payment.model';
import {DataTree} from '../../../common/components/basic-dialog/dialog.model';
import {ChargeDetail} from '../../../common/model/charge-detail.model';
import {Subscription} from 'rxjs';
import {ChargeDetailsService} from '../../../common/services/charge-details.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {GlobalService} from '../../../common/services/global.service';
import {ChargePaymentService} from '../../../common/services/charge-payment.service';
import {LocalStorageService} from '../../../common/services/local-storage.service';
import {SharedServiceService} from '../../../common/public/shared-service.service';
import {DatePipe} from '@angular/common';
import {ThemeService} from '../../../common/public/theme.service';
import {TreeNode} from '../../../common/model/shared-model';
import {ChargeScrappedBillService} from '../../../common/services/charge-scrapped-bill.service';

@Component({
  selector: 'rbi-charge-scrapped-bill',
  templateUrl: './charge-scrapped-bill.component.html',
  styleUrls: ['./charge-scrapped-bill.component.less']
})
export class ChargeScrappedBillComponent implements OnInit, OnDestroy {

  public option: any;
  public paymentDetailSelect: any[] = [];
  public paymentDetailTableContnt: any;
  // 状态值相关
  public roomTypeOption: any[] = [];
  public paymentMethodOption: any[] = [];
  public sexOption: any[] = [];
  public identityOption: any[] = [];
  public datedifOption: any[] = [];
  public lincesePlateColorOption = [];
  public lincesePlateTypeOption = [];
  public vehicleOriginaTypeOption = [];
  public parkSpacePlaceOption = [];
  public parkSpaceTypeOption = [];
  // 收费项，列表
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
    {field: 'operating', header: '操作'},
  ];

  // 抵扣项目列表
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
  public  deductionDamagesStatus: any;
  public  deductionDamagesData: any[] = [];
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
    {label: '业主姓名', value: 3},
    {label: '身份证号', value: 4},
    {label: '工作人员姓名', value: 5},
  ];
  public SearchData = {
    villageCode: '',
    regionCode: '',
    buildingCode:  '',
    unitCode: '',
    roomCode: '',
    mobilePhone: '',
    tollCollectorName: '',
    idNumber: '',
    surname: '',
    pageNo: 1,
    pageSize: 10
  };
  public searchData = '';


  public rentalParkSpace: RentalAddSparkSpace  = new RentalAddSparkSpace();
  public rentalRenewalStatusOption = [{label: '续租', value: '1'}, {label: '非续租', value: '0'}];

  // 修改费用详细
  public dialogOption: any;
  public chargeItemDialog: boolean;
  public changeChangeIndex: any;
  // 按钮权限相关
  public btnHiden = [
    {label: '搜索', hidden: true},
  ];
  // 缴费相关
  // public projectSelectDialog: boolean;
  public chargeStatusoption: any[] = [];
  public paymentList: any[] =[];
  public detailsDialog: boolean;
  public nowPage = 1;
  // 初始化项目
  public detailsPaymentProject: any;

  public parkspaceTitleDetail = [
    {field: 'chargeName', header: '项目名称'},
    {field: 'contractNumber', header: '合同编号'},
    {field: 'rentalRenewalStatus', header: '续租状态'},
    {field: 'datedif', header: '月数'},
    {field: 'parkingSpaceCode', header: '车位编号'},
    {field: 'parkingSpaceType', header: '车位类型'},
    {field: 'actualMoneyCollection', header: '实收金额'},
    {field: 'amountReceivable', header: '应收金额'},
    {field: 'startTime', header: '开始时间'},
    {field: 'dueTime', header: '结束时间'},
  ];
  public parkSpaceData: any[] = [];


  public paymentAddTitle =  [
    {name: '房间编号', value: '', label: 'roomCode'},
    {name: '建筑面积', value: '', label: 'roomSize'},
    {name: '客户名称', value: '', label: 'surname'},
    {name: '手机号码', value: '', label: 'mobilePhone'},
  ];

  public paymentItemData: ChargeItemDetail[] = [];
  public changePaymentItem: ChargeItemDetail = new ChargeItemDetail();
  // 详情相关
  public chargeDetails: ChargeDetail = new ChargeDetail();
  // 其他相关
  public cleanTimer: any; // 清除时钟

  public esDate: any;
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
    private chargeDetailSrv: ChargeDetailsService,
    private chargeScrappedBillSrv: ChargeScrappedBillService,
    private toolSrv: PublicMethedService,
    private globalSrv: GlobalService,
    private paymentSrv: ChargePaymentService,
    private localSrv: LocalStorageService,
    private  sharedSrv: SharedServiceService,
    private datePipe: DatePipe,
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
        this.reslveSearchData();
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
          // console.log(key);
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
    this.esDate = this.toolSrv.esDate;
    this.toolSrv.getAdmStatus([{settingType: 'PAYMENT_METHOD'},
      {settingType: 'ROOM_TYPE'}, {settingType: 'SEX'}, {settingType: 'IDENTITY'},
      {settingType: 'LICENSE_PLATE_COLOR'}, {settingType: 'DATEDIF'}, {settingType: 'CWLX'},
      {settingType: 'VEHICLE_ORIGINA_TYPE'}, {settingType: 'LICENSE_PLATE_TYPE'},
      {settingType: 'PAEKING_SPACE_PLACE'}, {settingType: 'CWLX'}], (data) => {
      this.lincesePlateTypeOption = this.toolSrv.setListMap(data.LICENSE_PLATE_TYPE);
      this.vehicleOriginaTypeOption = this.toolSrv.setListMap(data.VEHICLE_ORIGINA_TYPE);
      this.roomTypeOption = this.toolSrv.setListMap(data.ROOM_TYPE);
      this.chargeStatusoption = this.toolSrv.setListMap(data.PAYMENT_METHOD);
      this.sexOption = this.toolSrv.setListMap(data.SEX);
      this.identityOption = this.toolSrv.setListMap(data.IDENTITY);
      this.lincesePlateColorOption = this.toolSrv.setListMap(data.LICENSE_PLATE_COLOR);
      this.datedifOption = this.toolSrv.setListMap(data.DATEDIF);
      this.parkSpacePlaceOption = this.toolSrv.setListMap(data.PAEKING_SPACE_PLACE);
      this.parkSpaceTypeOption = this.toolSrv.setListMap(data.CWLX);
      this.queryData();
    });
  }
  // 重置搜索条件
  public  reslveSearchData(): void {
    this.SearchData.mobilePhone = '';
    this.SearchData.surname = '';
    this.SearchData.idNumber = '';
  }
  // condition search click
  public  detailsSearchClick(): void {
    this.nowPage = this.SearchData.pageNo = 1;
    if (this.searchData !== '') {
      this.selectSearchType();
    } else {
      this.reslveSearchData();
      this.queryData();
    }
  }
  // 判断搜索方式
  public  selectSearchType(): void {
    switch (this.searchType) {
      case 0: this.reslveSearchData();
              this.queryData(); break;
      case 1: this.setSearData('mobilePhone'); this.SearchData.mobilePhone = this.searchData; this.queryData(); break;
      case 2: this.setSearData('roomCode'); this.SearchData.roomCode = this.searchData; this.queryData(); break;
      case 3: this.setSearData('surname'); this.SearchData.surname = this.searchData;  this.queryData(); break;
      case 4: this.setSearData('idNumber'); this.SearchData.idNumber = this.searchData; this.queryData(); break;
      case 5: this.setSearData('tollCollectorName'); this.SearchData.tollCollectorName = this.searchData; this.queryData(); break;
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

  // sure modify details
  public  detailsSureClick(): void {
    this.chargeDetailSrv.getPayDocument({orderId: this.chargeDetails.orderId, organizationId: this.chargeDetails.organizationId}).subscribe(
      (data) => {
        if (data.data !== '') {
          window.open(data.data);
          this.detailsDialog = false;
        } else {
          this.toolSrv.setToast('error', '操作失败', data.message);
        }
      }
    );
  }
  public  detailsFaleseClick(): void {
    this.detailsDialog = false;
  }
  // charge item detail
  public  detailsDialogClick(e): void {
    this.queryDetail(e.orderId);
    console.log(this.parkSpaceTypeOption);
    this.detailsDialog = true;
  }

  // paging query
  public  nowpageEventHandle(event: any): void {
    this.nowPage = event;
    this.SearchData.pageNo = event;
    this.selectSearchType();
  }
  // set table data （设置列表数据）
  public  setTableOption(data1): void {
    this.optionTable = {
      width: '100%',
      header: {
        data:  [
          {field: 'orderId', header: '订单编号'},
          {field: 'villageName', header: '小区名称'},
          {field: 'roomCode', header: '房间编号'},
          {field: 'costInvolved', header: '涉及费用'},
          {field: 'actualTotalMoneyCollection', header: '缴费金额'},
          {field: 'idt', header: '缴费时间'},
          {field: 'operating', header: '操作'}],
        style: {background: this.table.tableheader.background, color: this.table.tableheader.color, height: '6vh'}
      },
      Content: {
        data: data1,
        styleone: {background: this.table.tableContent[0].background, color: this.table.tableContent[0].color, textAlign: 'center', height: '2vw'},
        styletwo: {background: this.table.tableContent[1].background, color: this.table.tableContent[1].color, textAlign: 'center', height: '2vw'},
      },
      type: 4,
      tableList:  [{label: '详情', color: this.table.detailBtn}]
    };
  }

  // 查找数据
  public  queryDetail(data): void {
    this.chargeDetailSrv.queryBillDetail({orderId: data}).subscribe(
      value => {
        console.log(value);
        if (value.status === '1000') {
          // 基本信息
          this.chargeDetails = value.data.bill;
          this.detailsPaymentProject = value.data.billDetailedDOS;
          this.deductioContent = value.data.costDeductionDOS;
          // 缴费明细
          this.paymentItemData = value.data.billDetailedDOS.map( v => {
            return v;
          });
          if (value.data.paymentMethodDOS.length > 0) {
            value.data.paymentMethodDOS.forEach(val => {
               this.paymentList.push({label: val.paymentName, value: val.moneyCollection});
            });
          }
          // 抵扣账单
          this.deductionDamagesData = value.data.costDeductionDOS;
          this.paymentAddTitle.forEach( v => {
            v.value = this.chargeDetails[v.label];
          });
          this.parkSpaceData = value.data.parkingSpaceCostDetailDOS;
          // this.chargeDetails.paymentMethod = this.toolSrv.setValueToLabel(this.chargeStatusoption, this.chargeDetails.paymentMethod);
        } else {
          this.toolSrv.setToast('error', '请求错误', value.message);
        }
      }
    );
  }
  // 分页查询
  public  queryData(): void {
    this.chargeScrappedBillSrv.queryChargeDataPage(this.SearchData).subscribe(
      (value) => {
        if (value.status === '1000') {
          if (value.data.contents.length === 0) {
            if (this.SearchData.pageNo !== 1) {
              this.SearchData.pageNo = this.nowPage = value.data.totalPage;
              this.queryData();
            } else {
              this.paymentDetailTableContnt = value.data.contents;
              this.setTableOption(value.data.contents);
            }
          } else {
            value.data.contents.forEach( v => {
              v.paymentMethod = this.toolSrv.setValueToLabel(this.chargeStatusoption, v.paymentMethod);
            });
            this.paymentDetailTableContnt = value.data.contents;
            this.setTableOption(value.data.contents);
          }
        } else {
          this.toolSrv.setToast('error', '请求失败', '数据查询失败');
        }
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
  }

  // 设置按钮显示权限
  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '报废单据') {
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
  // 车位信息详情
  public  parkSpaceDetailClick(index): void {
    for (const  key in this.parkSpaceData[index]) {
      this.rentalParkSpace[key] = this.parkSpaceData[index][key];
    }
    this.rentalParkSpace.rentalRenewalStatus = this.toolSrv.setValueToLabel(this.rentalRenewalStatusOption, this.rentalParkSpace.rentalRenewalStatus);
    this.rentalParkSpace.parkingSpacePlace = this.toolSrv.setValueToLabel(this.parkSpacePlaceOption, this.rentalParkSpace.parkingSpacePlace);
    this.rentalParkSpace.parkingSpaceType = this.toolSrv.setValueToLabel(this.parkSpaceTypeOption, this.rentalParkSpace.parkingSpaceType);
    this.rentalParkSpace.vehicleOriginalType = this.toolSrv.setValueToLabel(this.vehicleOriginaTypeOption, this.rentalParkSpace.vehicleOriginalType);
    this.rentalParkSpace.licensePlateColor = this.toolSrv.setValueToLabel(this.lincesePlateColorOption, this.rentalParkSpace.licensePlateColor);
    this.dialogOption = {
      dialog: true,
      tableHidden: false,
      width: '1000',
      type: 1,
      title: '车位详情',
      poplist: {
        popContent: this.rentalParkSpace,
        popTitle:  [
          {field: 'villageName', header: '小区名称'},
          {field: 'regionName', header: '地块名称'},
          {field: 'buildingName', header: '楼栋名称'},
          {field: 'roomSize', header: '建筑面积'},
          {field: 'parkingSpaceCode', header: '车位编号'},
          {field: 'rentalRenewalStatus', header: '续租状态'},
          {field: 'datedif', header: '月数'},
          {field: 'startTime', header: '开始计费时间'},
          {field: 'parkingSpacePlace', header: '车位地点'},
          {field: 'parkingSpaceType', header: '车位类型'},
          {field: 'vehicleOriginalType', header: '车辆原始类型'},
          {field: 'licensePlateColor', header: '车牌颜色'},
          {field: 'authorizedPersonName', header: '车主姓名'},
          {field: 'authorizedPersonPhone', header: '车主电话'},
          {field: 'authorizedPersonIdNumber', header: '车主身份证号'},
          {field: 'dueTime', header: '计费结束时间'},
          {field: 'discount', header: '折扣率'},
          {field: 'chargeUnit', header: '收费单位'},
          {field: 'chargeStandard', header: '标准单价'},
          {field: 'chargeName', header: '项目名称'},
          {field: 'actualMoneyCollection', header: '实收金额'},
          {field: 'amountReceivable', header: '应收金额'},
        ],
      }
    };
  }
  // 缴费明细详情
  public  changeChargeItemDataClick(index): void {
    this.changeChangeIndex = index;
    for(const  chargekey in this.paymentItemData[index]){
      this.changePaymentItem[chargekey] = this.paymentItemData[index][chargekey];
    }
    this.chargeItemDialog = true;
  }

}
