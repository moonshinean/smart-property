import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService} from 'primeng/api';
import {ChargePaymentService} from '../../../common/services/charge-payment.service';
import {
  AddSparkSpace,
  ChargeItem, ChargeItemData, ChargeItemDetail, ChargeItems, ChargePaymentAddOrder, CostSplitData, Patyment, RentalAddSparkSpace, SearchData
} from '../../../common/model/charge-payment.model';
import {GlobalService} from '../../../common/services/global.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {SharedServiceService} from '../../../common/public/shared-service.service';
import {Subscription} from 'rxjs';
import {DatePipe} from '@angular/common';
import {ThemeService} from '../../../common/public/theme.service';
import {DataTree, FormValue} from '../../../common/components/basic-dialog/dialog.model';
import {FormGroup} from '@angular/forms';
import {TreeNode} from '../../../common/model/shared-model';
import {FileOption} from '../../../common/components/basic-dialog/basic-dialog.model';
import {LocalStorageService} from '../../../common/services/local-storage.service';
import {validate} from 'codelyzer/walkerFactory/walkerFn';

@Component({
  selector: 'rbi-chargeman-payment',
  templateUrl: './chargeman-payment.component.html',
  styleUrls: ['./chargeman-payment.component.less'],
})
export class ChargemanPaymentComponent implements OnInit, OnDestroy {
  public paymentTableContnt: any;
  public optionTable: any;
  public roomTypeOption: any[] = [];
  public paymentMethodOption: any[] = [];
  public paymentMethodList: any[] = [];
  public selPaymentList: any[] =[];
  public sexOption: any[] = [];
  public identityOption: any[] = [];
  public datedifOption: any[] = [];

  // public stateOfArrearChecked = false;
  // 缴费项目选则
  public selectCheckChargeItemList: any[] = [];
  public paymentDialogTableTitle = [
    {field: 'chargeName', header: '项目名称'},
    {field: 'payerName', header: '缴费人姓名'},
    {field: 'amountReceivable', header: '应收金额'},
    {field: 'actualMoneyCollection', header: '实收金额'},
    {field: 'startTime', header: '开始计费时间'},
    {field: 'dueTime', header: '结束计费时间'},
    {field: 'usageAmount', header: '使用量'},
    {field: 'lastReading', header: '上次读数'},
    {field: 'currentReadings', header: '当前读数'},
    {field: 'datedif', header: '月/张数'},
    {field: 'chargeStandard', header: '标准单价'},
    {field: 'discount', header: '折扣'},
    {field: 'payerPhone', header: '缴费人手机号'},
    {field: 'chargeUnit', header: '单位'},
    {field: 'stateOfArrears', header: '欠费状态'},
    {field: 'operating', header: '操作'},
  ];
  // 抵扣项目列表
  public deductionDamagesTitle = [
    {field: 'deductionItem', header: '抵扣项目'},
    {field: 'deductibleMoney', header: '抵扣金额'},
    {field: 'deductionMethod', header: '抵扣方式'},
    {field: 'deductibledMoney', header: '已抵扣金额'},
    {field: 'surplusDeductibleMoney', header: '剩余可抵扣金额'},
    {field: 'amountDeductedThisTime', header: '本次抵扣金额'},
    {field: 'discount', header: '折扣'},
    {field: 'deductionRecord', header: '抵扣记录'},
  ];
  // 车位费用列表
  public parkspaceTitle = [
    {field: 'chargeName', header: '项目名称'},
    {field: 'contractNumber', header: '合同编号'},
    {field: 'rentalRenewalStatus', header: '续租状态'},
    {field: 'datedif', header: '月数'},
    {field: 'parkingSpaceCode', header: '车位编号'},
    {field: 'parkingSpaceType', header: '车位类型'},
    {field: 'actualMoneyCollection', header: '实收金额'},
    {field: 'amountReceivable', header: '应收金额'},
    {field: 'operating', header: '操作'},
  ];
  // 抵扣项目表内容
  public  parkSpaceData: any;
  public  deductionDamagesData: any;
  public  deductionDamagesStatus: any;
  public  deductionDamagesSelect: any[];
  public addPayProject = false;
  public paymentSelect: Patyment[];
  // 详情相关
  public dialogOption: any;
  // 收费项目选择确认查找详细数据
  public payItemDetail: ChargeItemData = new ChargeItemData();
  // 缴费相关
  public projectSelectDialog: boolean;
  public paymentDialog: boolean;
  public paymentReceivableTotle = 0;
  public paymentTotle =  0; // 总计金额
  public paymentActualTotal = 0; // 实收总计
  public paymentMoney = 0; //
  public Balance = 0;
  // 搜索相关
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
    mobilePhone: '',
    idNumber: '',
    surname: '',
    pageNo: 1,
    pageSize: 10
  };
  public searchType = 0;
  public searchData = '';
  public threeWayFeeCalculationTime = '';
  // 初始化项目
  public paymentProject: ChargeItem[] = [];
  public paymentItemData: ChargeItemDetail[] = [];
  public paymentAddTitle =  [
    {name: '房间代码', value: '', label: 'roomCode'},
    {name: '建筑面积', value: '', label: 'roomSize'},
    {name: '客户名称', value: '', label: 'surname'},
    {name: '手机号码', value: '', label: 'mobilePhone'},
    {name: '物业费到期时间', value: '', label: 'dueTime'},
    {name: '预存金额', value: '', label: 'surplus'},
    {name: '单月物业费', value: '', label: 'oneMonthPropertyFee'},
    {name: '欠费月数', value: '', label: 'minMonth'}
  ];

  public nowPage = 1;
  public paymentOrderAdd: ChargePaymentAddOrder  = new ChargePaymentAddOrder();
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  public phoneErrorToast = true;
  public esDate: any;
  public lincePlate: RegExp = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
  // public msgs: Message[] = []; // 消息弹窗
  public paymentItemListIndex: any;
  public deductionDamagesListIndex: any;
  public deductionDamagesItem: any;
  // 费用拆分
  public ownerOption: any[] = [];
  public ownerList: any[] = [];
  public costSplitDialog: boolean;
  public firstDate: Date = new Date();
  public secondDate: Date = new Date();
  public costSplitData: CostSplitData =  new CostSplitData();

  // 车位指定
  public addParkSpace: AddSparkSpace = new AddSparkSpace();
  public addParkSpaceOptionDialog: boolean;
  public lincesePlateColorOption = [];
  public lincesePlateTypeOption = [];
  public vehicleOriginaTypeOption = [];
  public parkSpacePlaceOption = [];
  public parkSpaceTypeOption = [];
  public treeCode: any;

  // 零时车位车位
  public parkSpaceOptionDialog: boolean;
  public rentalParkSpace: RentalAddSparkSpace  = new RentalAddSparkSpace();
  public editRentalParkspaceDataFlag: any;
  public rentalRenewalStatusOption = [{label: '续租', value: '1'}, {label: '非续租', value: '0'}];
  public rentalHiddenInfo = true;
  public rentalCode: any;
  // 树结构相关
  public treeDialog: boolean;
  public dataTrees: DataTree[];
  public dataTree: DataTree = new DataTree();
  // 按钮权限相关
  public btnHiden = [
    {label: '缴费', hidden: true},
    {label: '搜索', hidden: true},
  ];
  // 上传车位信息
  public UploadFileOption: FileOption = new FileOption();
  public uploadRecordOption: any;

  // 打开链接列表
  public openListDataPdf: any[] = [];
  public openListLength: any;
  // 树结构订阅
  public paymentSub: Subscription;
  // 切换主题
  public themeSub: Subscription;
  public table = {
    tableheader: {background: '', color: ''},
    tableContent: [
      {background: '', color: ''},
      {background: '', color: ''}],
    detailBtn: ''
  };
  public keyChargeList = false;
  // 房屋添加检验
  public keyChargeParkSpaceList = [false, false, false, false, false, false];
  // 放大 缩小显示
  public dialogHiddenData = [];
  constructor(
    private paymentSrv: ChargePaymentService,
    private confirmationService: ConfirmationService,
    private globalSrv: GlobalService,
    private localSrv: LocalStorageService,
    public  toolSrv: PublicMethedService,
    private datePipe: DatePipe,
    private  sharedSrv: SharedServiceService,
    private themeSrv: ThemeService
  ) {
    // this.themeSrv.changeEmitted$
    this.themeSub = this.themeSrv.changeEmitted$.subscribe(
      value => {
        this.table.tableheader = value.table.header;
        this.table.tableContent = value.table.content;
        this.table.detailBtn = value.table.detailBtn;
        this.setTableOption(this.paymentTableContnt);
      }
    );
    this.paymentSub = this.sharedSrv.changeEmitted$.subscribe(
      value => {
        for (const key in value) {
          if (key !== 'data') {
            this.SearchData[key] = value[key];
          }
        }
        this.nowPage = this.SearchData.pageNo = 1;
        this.reslveSearchData();
        this.queryPaymentPage();
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
          // console.log(key);
        }
      }
    }
    this.getLocalTime();
    console.log(this.threeWayFeeCalculationTime);
    this.paymentInitialization();
  }
  ngOnDestroy(): void {
    // 取消订阅
    this.paymentSub.unsubscribe();
    this.themeSub.unsubscribe();
  }

  // Initialize the charge record（初始化收费记录）
  public  paymentInitialization(): void {
     this.esDate = this.toolSrv.esDate;
     this.toolSrv.getAdmStatus([
      {settingType: 'ROOM_TYPE'}, {settingType: 'SEX'}, {settingType: 'IDENTITY'},
       {settingType: 'LICENSE_PLATE_COLOR'}, {settingType: 'DATEDIF'}, {settingType: 'CWLX'},
       {settingType: 'VEHICLE_ORIGINA_TYPE'}, {settingType: 'LICENSE_PLATE_TYPE'},
       {settingType: 'PAEKING_SPACE_PLACE'}, {settingType: 'CWLX'}], (data) => {
       this.lincesePlateTypeOption = this.toolSrv.setListMap(data.LICENSE_PLATE_TYPE);
       this.vehicleOriginaTypeOption = this.toolSrv.setListMap(data.VEHICLE_ORIGINA_TYPE);
       this.roomTypeOption = this.toolSrv.setListMap(data.ROOM_TYPE);
       // this.paymentMethodOption = this.toolSrv.setListMap(data.PAYMENT_METHOD);
       this.sexOption = this.toolSrv.setListMap(data.SEX);
       this.identityOption = this.toolSrv.setListMap(data.IDENTITY);
       this.lincesePlateColorOption = this.toolSrv.setListMap(data.LICENSE_PLATE_COLOR);
       this.datedifOption = this.toolSrv.setListMap(data.DATEDIF);
       this.parkSpacePlaceOption = this.toolSrv.setListMap(data.PAEKING_SPACE_PLACE);
       this.parkSpaceTypeOption = this.toolSrv.setListMap(data.CWLX);
       this.queryPaymentPage();
       this.globalSrv.getPayMethods({}).subscribe(
         value => {
           if (value.status === '1000') {
             this.paymentMethodOption = this.toolSrv.setListMap(value.data.PAYMENT_METHOD);
             this.paymentMethodList = this.paymentMethodOption.map(val => {
                return {label: val.label, value: val.value, num: ''};
             });
           } else {
             this.toolSrv.setToast('error', '支付方式查询错误', value.message);
           }
         }
       );
    });
    // this.paymentTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
  }
  // condition search 条件搜索）
  public paymentSearchClick(): void {
    this.nowPage = this.SearchData.pageNo = 1;
    if (this.searchData !== '') {
      this.selectSearchType();
    } else {
      this.toolSrv.setToast('error', '操作错误', '请填写需要搜索的值');
    }
  }
  // 判断搜索方式
  public selectSearchType(): void {
    switch (this.searchType) {
      case 0: this.reslveSearchData();
              this.queryPaymentPage(); break;
      case 1: this.setSearData('mobilePhone'); this.SearchData.mobilePhone = this.searchData; this.queryPaymentPage(); break;
      case 2: this.setSearData('roomCode'); this.SearchData.roomCode = this.searchData; this.queryPaymentPage(); break;
      case 3: this.setSearData('surname'); this.SearchData.surname = this.searchData;  this.queryPaymentPage(); break;
      case 4: this.setSearData('idNumber'); this.SearchData.idNumber = this.searchData; this.queryPaymentPage(); break;
      default:
            break;
    }
  }
  // 重置数据
  public setSearData(label): void {
      for (const serchKey in this.SearchData) {
        if (serchKey !== label && serchKey !== 'pageSize' && serchKey !== 'pageNo') {
          this.SearchData[serchKey] = '';
        }
      }
  }
  // 重置搜索条件
  public reslveSearchData(): void {
    this.SearchData.mobilePhone = '';
    this.SearchData.surname = '';
    this.SearchData.idNumber = '';
  }
  // sure selectPreject payment （选择项目确认）
  public paymentProjectSureClick(): void {

    // 获取选中的收费项目
    const list  = this.paymentProject.filter( v => {
      return v.check === 1;
    });
    if (list.length > 0 ) {
      // 组装请求参数
      const keyList = ['roomSize', 'roomCode', 'customerUserId', 'dueTime', 'surplus', 'identity', 'oneMonthPropertyFee'];
      for (const key of keyList) {
        if (key === 'identity') {
          this.payItemDetail[key] = this.toolSrv.setLabelToValue(this.identityOption, this.paymentSelect[0][key]);
        } else {
          this.payItemDetail[key] = this.paymentSelect[0][key];
        }
      }
      this.payItemDetail.chargeItem = list.map( v => {
        if (v.chargeWay !== 6) {
          return {chargeCode: v.chargeCode, chargeName: v.chargeName, chargeType: v.chargeType, parkingSpaceCode: v.parkingSpaceCode,
            datedif: v.datedif, chargeStandard: v.chargeStandard};
        } else {
          return {chargeCode: v.chargeCode, chargeName: v.chargeName, chargeType: v.chargeType, parkingSpaceCode: v.parkingSpaceCode,
            datedif: v.datedif, chargeStandard: v.chargeStandard, multiple: v.multiple, usageAmount: v.usageAmount};
        }
      });
      this.payItemDetail.threeWayFeeCalculationTime = this.datePipe.transform(this.threeWayFeeCalculationTime, 'yyyy-MM');
      console.log(this.payItemDetail);

      // 查询拆分业主
      this.paymentSrv.getUserInfoByRoomCode({roomCode: this.paymentSelect[0].roomCode}).subscribe(
        value => {
          console.log(value);
          if (value.status === '1000') {
            this.ownerOption = [];
            this.ownerList = value.data;
            value.data.forEach( v => {
              this.ownerOption.push({label: v.surname, value: v.surname});
            });
          } else {
            this.toolSrv.setToast('error', '查询失败', value.message);
          }
        }
      );
      // 计费请求
      this.paymentSrv.searchChargeItemDetail(this.payItemDetail).subscribe(value => {
          if (value.status === '1000') {
            console.log(value);
            this.setPaymentList(value);
            this.paymentTotle = value.data.amountTotalReceivable;
            this.paymentActualTotal = value.data.actualTotalMoneyCollection;
            this.paymentReceivableTotle = value.data.actualTotalMoneyCollection;
            this.paymentMoney = value.data.actualTotalMoneyCollection;
          } else {
            this.toolSrv.setToast('error', '请求失败', value.message);
          }
        }
      );
      this.paymentDialog = true;
      this.projectSelectDialog = false;
    } else {
      this.toolSrv.setToast('error', '操作错误', '请选择收费项目');
    }
  }
  // 表单检验
  public  changeInput(data): void {
    this.keyChargeList = !(data !== '' && data !== null && data !== undefined);
  }
  // sure  payment (缴费确认)
  public paymentSureClick(): void {
    const PaymentList = [];
    this.paymentMethodList.forEach(val => {
       if (this.selPaymentList.includes(val.label)) {
         PaymentList.push({paymentMethod: val.value, moneyCollection: val.num});
       }
    });
    if (PaymentList.length > 0) {
      if (PaymentList.some(val => {
        return val.moneyCollection === '';
      })) {
        this.toolSrv.setToast('error', '操作失败', '已选择的支付方式对应该支付的金额未填写');
      } else {
        const listKey = ['organizationId', 'villageName',
          'villageCode', 'regionCode', 'regionName', 'buildingCode', 'buildingName', 'unitCode',
          'unitName', 'roomCode', 'roomSize', 'surname', 'mobilePhone', 'idNumber',
          'customerUserId', 'oneMonthPropertyFee'];
        for (const key of listKey) {
          this.paymentOrderAdd[key] = this.paymentSelect[0][key];
        }
        this.paymentOrderAdd.threeWayFeeCalculationTime = this.datePipe.transform(this.threeWayFeeCalculationTime, 'yyyy-MM');
        this.paymentOrderAdd.payerPhone = this.paymentOrderAdd.payerPhone === undefined ? '' : this.paymentOrderAdd.payerPhone;
        this.paymentOrderAdd.payerName = this.paymentOrderAdd.payerName === undefined ? '' : this.paymentOrderAdd.payerName;
        this.paymentOrderAdd.remark = this.paymentOrderAdd.remark === undefined ? '' : this.paymentOrderAdd.remark;
        this.paymentOrderAdd.amountTotalReceivable = this.paymentTotle;
        this.paymentOrderAdd.actualTotalMoneyCollection = this.paymentMoney;
        this.paymentOrderAdd.billDetailedDOArrayList = this.paymentItemData.map( v => {
          v.stateOfArrears = v.stateOfArrears === false ? 0 : 1;
          return v;
        });
        this.paymentOrderAdd.parkingSpaceCostDetailDOList = this.parkSpaceData.map(v => {
          v.rentalRenewalStatus = this.toolSrv.setLabelToValue(this.rentalRenewalStatusOption, v.rentalRenewalStatus);
          v.parkingSpaceType = this.toolSrv.setLabelToValue(this.parkSpaceTypeOption, v.parkingSpaceType);
          v.vehicleOriginalType = this.toolSrv.setLabelToValue(this.vehicleOriginaTypeOption, v.vehicleOriginalType);
          v.licensePlateType = this.toolSrv.setLabelToValue(this.lincesePlateTypeOption, v.licensePlateType);
          v.licensePlateColor = this.toolSrv.setLabelToValue(this.lincesePlateColorOption, v.licensePlateColor);
          v.parkingSpacePlace = this.toolSrv.setLabelToValue(this.parkSpacePlaceOption, v.parkingSpacePlace);
          return v;
        });
        this.paymentOrderAdd.costDeduction = this.deductionDamagesData;
        this.paymentOrderAdd.correctedAmount = this.Balance;
        this.paymentOrderAdd.paymentMethodDOList = PaymentList;
        // console.log(this.paymentOrderAdd);
        this.paymentSrv.addPayOrder(this.paymentOrderAdd).subscribe(
          (value) => {
            if (value.status === '1000') {
              this.confirmationService.confirm({
                message: `是否打印单据吗？`,
                header: '缴费成功',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                  this.openListLength = value.data.length;
                  value.data.forEach(v => {
                    this.printBillDetail(v.orderId, v.organizationId);
                  });
                },
                reject: () => {
                  this.paymentDialog = false;
                  this.selPaymentList = [];
                  this.paymentMethodList = this.paymentMethodList.map(v => {
                    v.num = '';
                    return v;
                  });
                  this.InitializationAllpayData();
                }
              });
            } else {
              // 请求失败了 数据还原
              this.paymentItemData.map( v => {
                v.stateOfArrears = v.stateOfArrears !== 0;
                return v;
              });
              this.parkSpaceData.map(v => {
                v.rentalRenewalStatus = this.toolSrv.setValueToLabel(this.rentalRenewalStatusOption, v.rentalRenewalStatus);
                v.parkingSpaceType = this.toolSrv.setValueToLabel(this.parkSpaceTypeOption, v.parkingSpaceType);
                v.vehicleOriginalType = this.toolSrv.setValueToLabel(this.vehicleOriginaTypeOption, v.vehicleOriginalType);
                v.licensePlateType = this.toolSrv.setValueToLabel(this.lincesePlateTypeOption, v.licensePlateType);
                v.licensePlateColor = this.toolSrv.setValueToLabel(this.lincesePlateColorOption, v.licensePlateColor);
                // v.datedif = this.toolSrv.setValueToLabel(this.datedifOption, v.datedif);
                v.parkingSpacePlace = this.toolSrv.setValueToLabel(this.parkSpacePlaceOption, v.parkingSpacePlace);
                return v;
              });
              this.toolSrv.setToast('error', '请求错误', value.message);
            }
          }
        );
      }
    } else {
      this.toolSrv.setToast('error', '填写错误', '有数据没填写或者选择');
    }
  }
  // 预打印单据
  public  paymentPreprintClick(): void {
    const PaymentList = [];
    this.paymentMethodList.forEach(val => {
      if (this.selPaymentList.includes(val.label)) {
        PaymentList.push({paymentMethod: val.value, moneyCollection: val.num});
      }
    });
    if (PaymentList.length > 0) {
      if (PaymentList.some(val => {
        return val.moneyCollection === '';
      })) {
        this.toolSrv.setToast('error', '操作失败', '已选择的支付方式对应该支付的金额未填写');
      } else {
        const listKey = ['organizationId', 'villageName',
          'villageCode', 'regionCode', 'regionName', 'buildingCode', 'buildingName', 'unitCode',
          'unitName', 'roomCode', 'roomSize', 'surname', 'mobilePhone', 'idNumber',
          'customerUserId', 'oneMonthPropertyFee'];
        for (const key of listKey) {
          this.paymentOrderAdd[key] = this.paymentSelect[0][key];
        }
        this.paymentOrderAdd.threeWayFeeCalculationTime = this.datePipe.transform(this.threeWayFeeCalculationTime, 'yyyy-MM');
        this.paymentOrderAdd.payerPhone = this.paymentOrderAdd.payerPhone === undefined ? '' : this.paymentOrderAdd.payerPhone;
        this.paymentOrderAdd.payerName = this.paymentOrderAdd.payerName === undefined ? '' : this.paymentOrderAdd.payerName;
        this.paymentOrderAdd.remark = this.paymentOrderAdd.remark === undefined ? '' : this.paymentOrderAdd.remark;
        this.paymentOrderAdd.amountTotalReceivable = this.paymentTotle;
        this.paymentOrderAdd.actualTotalMoneyCollection = this.paymentMoney;
        this.paymentOrderAdd.billDetailedDOArrayList = this.paymentItemData.map( v => {
          v.stateOfArrears = v.stateOfArrears === false ? 0 : 1;
          return v;
        });
        this.paymentOrderAdd.parkingSpaceCostDetailDOList = this.parkSpaceData.map(v => {
          v.rentalRenewalStatus = this.toolSrv.setLabelToValue(this.rentalRenewalStatusOption, v.rentalRenewalStatus);
          v.parkingSpaceType = this.toolSrv.setLabelToValue(this.parkSpaceTypeOption, v.parkingSpaceType);
          v.vehicleOriginalType = this.toolSrv.setLabelToValue(this.vehicleOriginaTypeOption, v.vehicleOriginalType);
          v.licensePlateType = this.toolSrv.setLabelToValue(this.lincesePlateTypeOption, v.licensePlateType);
          v.licensePlateColor = this.toolSrv.setLabelToValue(this.lincesePlateColorOption, v.licensePlateColor);
          v.parkingSpacePlace = this.toolSrv.setLabelToValue(this.parkSpacePlaceOption, v.parkingSpacePlace);
          return v;
        });
        this.paymentOrderAdd.costDeduction = this.deductionDamagesData;
        this.paymentOrderAdd.correctedAmount = this.Balance;
        this.paymentOrderAdd.paymentMethodDOList = PaymentList;
        // console.log(this.paymentOrderAdd);
        this.paymentSrv.prePrintPayOrder(this.paymentOrderAdd).subscribe(
          (value) => {
            if (value.status === '1000') {
              // console.log(value);
              window.open(value.data);
              // this.openListLength = value.data.length;
              // value.data.forEach(v => {
              //   this.printBillDetail(v.orderId, v.organizationId);
              // });
            } else {
              // 请求失败了 数据还原
              this.paymentItemData.map( v => {
                v.stateOfArrears = v.stateOfArrears !== 0;
                return v;
              });
              this.parkSpaceData.map(v => {
                v.rentalRenewalStatus = this.toolSrv.setValueToLabel(this.rentalRenewalStatusOption, v.rentalRenewalStatus);
                v.parkingSpaceType = this.toolSrv.setValueToLabel(this.parkSpaceTypeOption, v.parkingSpaceType);
                v.vehicleOriginalType = this.toolSrv.setValueToLabel(this.vehicleOriginaTypeOption, v.vehicleOriginalType);
                v.licensePlateType = this.toolSrv.setValueToLabel(this.lincesePlateTypeOption, v.licensePlateType);
                v.licensePlateColor = this.toolSrv.setValueToLabel(this.lincesePlateColorOption, v.licensePlateColor);
                // v.datedif = this.toolSrv.setValueToLabel(this.datedifOption, v.datedif);
                v.parkingSpacePlace = this.toolSrv.setValueToLabel(this.parkSpacePlaceOption, v.parkingSpacePlace);
                return v;
              });
              this.toolSrv.setToast('error', '请求错误', value.message);
            }
          }
        );
      }
    } else {
      this.toolSrv.setToast('error', '填写错误', '有数据没填写或者选择');
    }
  }
  // 打印单据
  public printBillDetail(orderIdData, organizationIdData): void {
    // const newWindow = window.open();
    // console.log(123);
    this.paymentSrv.getPayDocument({orderId: orderIdData, organizationId: organizationIdData}).subscribe(
      (data) => {
        if (data.status === '1000') {
          if (data.data !== '' && data.data !== null) {
            this.openListDataPdf.push(data.data);
            if (this.openListDataPdf.length === this.openListLength) {
              this.openListDataPdf.forEach( (v, index) => {
                window.open(v, index.toString());
              });
              this.paymentMethodList = this.paymentMethodList.map(v => {
                v.num = '';
                return v;
              });
              this.InitializationAllpayData();
              this.paymentDialog = false;
              this.selPaymentList = [];
            }
          } else {
            this.toolSrv.setToast('error', '操作失败', '数据为空');
          }
        } else {
          this.toolSrv.setToast('error', '请求失败', data.message);
        }
      }
    );
  }
  // Display charging items selection pop-up window (展示项目选择弹窗)
  public paymentClick(): void {
    if (this.paymentSelect === undefined || this.paymentSelect.length === 0 ) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要缴费的项');
    } else if (this.paymentSelect.length === 1) {
      this.paymentProject = [];
      this.paymentSrv.searchChargeItem({roomCode: this.paymentSelect[0].roomCode}).subscribe(
        (value) => {
          if (value.status === '1000') {
            console.log(value);
            value.data.forEach( v => {
              if (v.chargeWay === 4) {
                this.selectCheckChargeItemList.push(v.chargeName);
                this.paymentProject.push({chargeCode: v.chargeCode, chargeName: v.chargeName, parkingSpaceCode: v.parkingSpaceCode,
                  chargeType: v.chargeType, datedif: 1, chargeWay: v.chargeWay, check: 1, minMonth: 1,
                  chargeStandards: JSON.parse(v.chargeStandards), chargeStandard: v.chargeStandard});
              } else  if (v.chargeWay === 3) {
                this.paymentProject.push({chargeCode: v.chargeCode, chargeName: v.chargeName, parkingSpaceCode: v.parkingSpaceCode,
                  chargeType: v.chargeType, datedif: 0, chargeWay: v.chargeWay, check: 0, minMonth: 1,
                  chargeStandards: JSON.parse(v.chargeStandards), chargeStandard: JSON.parse(v.chargeStandards)[0].value});
              } else if (v.chargeWay === 6) {
                this.paymentProject.push({chargeCode: v.chargeCode, chargeName: v.chargeName, parkingSpaceCode: v.parkingSpaceCode,
                  chargeType: v.chargeType, datedif: 1, chargeWay: v.chargeWay, check: 0, minMonth: 1, multiple: 1, usageAmount: 0,
                  chargeStandards: JSON.parse(v.chargeStandards), chargeStandard: v.chargeStandard});
              } else  {
                this.paymentProject.push({chargeCode: v.chargeCode, chargeName: v.chargeName, parkingSpaceCode: v.parkingSpaceCode,
                  chargeType: v.chargeType, datedif: 1, chargeWay: v.chargeWay, check: 0, minMonth: 1,
                  chargeStandards: JSON.parse(v.chargeStandards), chargeStandard: v.chargeStandard});
              }
            });
            this.projectSelectDialog = true;
          } else {
            this.toolSrv.setToast('error', '操作错误', value.message);
          }
        }
      );
    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行缴费');
    }
  }
  // Charge item selection switch (收费项目选择切换)
  public projectChange(i): void {
    if (this.paymentProject[i].check === 0) {
      this.paymentProject[i].check = 1;
    } else {
      this.paymentProject[i].check = 0;
    }
  }
  // add payment Project
  public paymentAddProjectClick(): void {
    this.addPayProject = true;
    this.projectSelectDialog = true;
    this.paymentSrv.searchChargeItem({roomCode: this.paymentSelect[0].roomCode}).subscribe(
      (value) => {
        value.data.forEach( v => {
          let flag = true;
          this.paymentProject.forEach(item => {
              if (v.chargeName === item.chargeName) {
                flag = false;
              }
          });
          if (flag) {
            if (v.chargeType === '1' || v.chargeType === '2' || v.chargeType === '3') {
              this.paymentProject.push({chargeCode: v.chargeCode, chargeName: v.chargeName, chargeType: v.chargeType, parkingSpaceCode: v.parkingSpaceCode,
                datedif: this.paymentSelect[0].minMonth, chargeWay: v.chargeWay, check: 0, minMonth: this.paymentSelect[0].minMonth
              });
            } else {
              this.paymentProject.push({chargeCode: v.chargeCode, chargeName: v.chargeName, chargeType: v.chargeType, datedif: 1,  parkingSpaceCode: v.parkingSpaceCode,
                chargeWay: v.chargeWay, check: 0, minMonth: 1
              });
            }
          }
        }
       );
      }
    );
  }
  // Cancel payment
  public paymentFaleseClick(): void {
    this.paymentDialog = false;
    this.ownerList = [];
    this.deductionDamagesSelect = [];
    this.dialogHiddenData = [];
    this.selPaymentList = [];
    this.paymentMethodList = this.paymentMethodList.map(v => {
      v.num = '';
      return v;
    });
    this.getLocalTime();
    this.InitializationAllpayData();

  }
  // Calculated amount (计算金额)
  public getBalance(e): void {
      this.Balance = parseFloat(( e.target.value - this.paymentReceivableTotle).toFixed(2));
  }
  // cancel select charging items
  public payProjectFalseClick(): void {
    if (this.addPayProject) {
      this.addPayProject = false;
      this.projectSelectDialog = false;
    } else {
      this.InitializationAllpayData();
      this.projectSelectDialog = false;
    }
  }
  // paging query
  public nowpageEventHandle(event: any): void {
    this.nowPage = event;
    this.SearchData.pageNo = event;
    this.selectSearchType();
    this.paymentSelect = [];
  }
  // Mobile phone number format judgment （手机号格式判断）
  public paymentPhoneChange(e): void {
    if (!/^1[37458]\d{9}$/.test(e)) {
      this.toolSrv.setToast('error', '手机号码格式错误', '请重新输入11位手机号码');
      this.phoneErrorToast = false;
    } else {
      this.phoneErrorToast = true;
    }
  }
  // Reset data (重置数据)
  public InitializationAllpayData(): void {
    this.rentalHiddenInfo = true;
    this.paymentItemData = [];
    this.paymentTotle = 0;
    this.paymentActualTotal = 0;
    this.payItemDetail = new ChargeItemData();
    this.paymentOrderAdd = new ChargePaymentAddOrder();
    this.Balance = 0;
    this.paymentSelect = [];
    // this.paymentInitialization();
    this.payItemDetail = new ChargeItemData();
    this.paymentProject = [];
    this.deductionDamagesSelect = [];
    this.openListDataPdf = [];
    this.selectCheckChargeItemList = [];
    this.deductionDamagesData = [];
    this.queryPaymentPage();
  }
  // Paging query data （分页查询数据）
  public queryPaymentPage(): void {
    this.paymentSrv.searchPaymentData(this.SearchData).subscribe(
      (val) => {
        console.log(val);
        if (val.status === '1000') {
          val.data.contents.forEach( t => {
            t.sex = this.toolSrv.setValueToLabel(this.sexOption, t.sex);
            t.roomType = this.toolSrv.setValueToLabel(this.roomTypeOption, t.roomType);
            t.identity = this.toolSrv.setValueToLabel(this.identityOption, t.identity);
          });
          this.paymentTableContnt = val.data.contents;
          this.setTableOption(val.data.contents);
          this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};
        } else {
          this.toolSrv.setToast('error', '请求错误', val.message);
        }
      }
    );
  }
  // set table data （设置列表数据）
  public setTableOption(data1): void {
    this.optionTable = {
      width: '100.5%',
      header: {
        data:  [
          {field: 'roomCode', header: '房间编号'},
          {field: 'roomSize', header: '建筑面积'},
          {field: 'roomType', header: '房间类型'},
          {field: 'surname', header: '客户名称'},
          {field: 'identity', header: '客户身份'},
          {field: 'mobilePhone', header: '客户电话'},
          {field: 'dueTime', header: '物业费到期时间'},
          {field: 'oneMonthPropertyFee', header: '单月物业费'},
          {field: 'minMonth', header: '欠费月数'},
          {field: 'prepaidAmount', header: '预缴金额'},
          {field: 'amountOfArrears', header: '欠费金额'},
          {field: 'operating', header: '操作'}],
        style: {background: this.table.tableheader.background, color: this.table.tableheader.color, height: '6vh'}
      },
      Content: {
        data: data1,
        styleone: {background: this.table.tableContent[0].background, color: this.table.tableContent[0].color, textAlign: 'center', height: '2vw'},
        styletwo: {background: this.table.tableContent[1].background, color: this.table.tableContent[1].color, textAlign: 'center', height: '2vw'},
      },
      type: 3,
      tableList:  [{label: '详情', color: this.table.detailBtn}]
    };
  }
  // show detail dialog (展示详情弹窗)
  public detailClick(e): void {
    if (e.parkingSpaceManagementDOS.length !== 0) {
      this.dialogOption = {
        dialog: true,
        tableHidden: true,
        width: '1000',
        type: 1,
        title: '详情',
        poplist: {
          popContent: e,
          popTitle:  [
            {field: 'villageName', header: '小区名称'},
            {field: 'regionName', header: '地块名称'},
            {field: 'buildingName', header: '楼栋名称'},
            {field: 'unitName', header: '单元名称'},
            {field: 'roomCode', header: '房间编号'},
            {field: 'roomSize', header: '建筑面积'},
            {field: 'roomType', header: '房间类型'},
            {field: 'surname', header: '客户名称'},
            {field: 'sex', header: '客户性别'},
            {field: 'idNumber', header: '身份证号'},
            {field: 'mobilePhone', header: '客户电话'},
            {field: 'dueTime', header: '物业费到期时间'},
            {field: 'surplus', header: '预存金额'},
            {field: 'prepaidAmount', header: '预缴金额'},
            {field: 'minMonth', header: '欠费月数'},
          ],
        },
        tablelist: {
          width: '102%',
          tableHeader: {
            data: [
              {field: 'buildingName', header: '楼栋名称'},
              {field: 'roomCode', header: '房间编号'},
              {field: 'parkingSpaceCode', header: '车位编号'},
              {field: 'authorizedPersonName', header: '车主姓名'},
              {field: 'authorizedPersonPhone', header: '车主电话'},
              {field: 'remarks', header: '备注'},
            ],
            style: {background: '#F4F4F4', color: '#000', height: '6vh'}
          },
          tableContent: {
            data: e.parkingSpaceManagementDOS,
            styleone: {background: '#FFFFFF', color: '#000', height: '2vw', textAlign: 'center'},
            styletwo: {background: '#FFFFFF', color: '#000', height: '2vw', textAlign: 'center'}
          }
        }
      };
    } else {
      this.dialogOption = {
        dialog: true,
        tableHidden: false,
        width: '1000',
        type: 1,
        title: '详情',
        poplist: {
          popContent: e,
          popTitle: [
            {field: 'villageName', header: '小区名称'},
            {field: 'regionName', header: '地块名称'},
            {field: 'buildingName', header: '楼栋名称'},
            {field: 'unitName', header: '单元名称'},
            {field: 'roomCode', header: '房间编号'},
            {field: 'roomSize', header: '建筑面积'},
            {field: 'roomType', header: '房间类型'},
            {field: 'surname', header: '客户名称'},
            {field: 'sex', header: '客户性别'},
            {field: 'idNumber', header: '身份证号'},
            {field: 'mobilePhone', header: '客户电话'},
            {field: 'dueTime', header: '物业费到期时间'},
            {field: 'surplus', header: '预存金额'},
            {field: 'prepaidAmount', header: '预缴金额'},
            {field: 'minMonth', header: '欠费月数'},
          ],
        }
      };
    }
  }
  // select data （选择数据）
  public selectData(e): void {
      this.paymentSelect = e;
  }
  // 设置欠费未欠费计算总和
  public stateOfArrearChange(value, index): void {
    this.paymentItemData[index].stateOfArrears = (value === true);
    this.getTotalBalaceData();
  }
  // 设置拆分
  public costSplitClick(e, index): void {
      this.paymentItemListIndex = index;
      this.costSplitData = e;
      this.paymentSrv.getCostSplitStartTime({roomCode: this.paymentSelect[0].roomCode}).subscribe(val => {
        if (val.status === '1000') {
          this.costSplitData.firstStartTime = val.data;
          this.costSplitDialog = true;
          this.SelectDateClick(1);
        } else {
          this.toolSrv.setToast('error', '请求失败', val.message);
        }
      });
      // this.costSplitData.spiltTime = e.startTime;
      // this.setDate(e.startTime, this.minDate);
      // this.setDate(e.dueTime, this.maxDate);
  }
  // 监听时间选择
  public SelectDateClick(data): void {
    this.costSplitData.firstStartTime = this.datePipe.transform(this.costSplitData.firstStartTime, 'yyyy-MM-dd');
    if (data === 1) {
      this.setDate(this.costSplitData.firstStartTime, this.firstDate);
    } else {
      this.costSplitData.secondStartTime = this.addDate(this.costSplitData.firstEndTime, 1);
      this.setDate(this.costSplitData.secondStartTime, this.secondDate);
    }
  }
  // 日期加一天
  public addDate(date, days): any {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    const month = newDate.getMonth() + 1 >= 10 ? newDate.getMonth() + 1 : '0' + (newDate.getMonth() + 1);
    const day = newDate.getDate() >= 10 ?  newDate.getDate() : '0' + newDate.getDate();
    return newDate.getFullYear() + '-' + month + '-' + day;
  }
  // 拆分请求
  public costSplitSure(): void {
    const list = ['firstStartTime', 'firstEndTime', 'secondStartTime', 'secondEndTime'];
    let costPass: boolean;
    costPass =  list.some(v => {
      return (this.costSplitData[v] === null || this.costSplitData[v] === undefined);
    });
    if (!costPass) {
        this.costSplitData.oneMonthPropertyFee = this.paymentSelect[0].oneMonthPropertyFee;
        // this.costSplitData.firstStartTime =
        this.costSplitData.firstEndTime = this.datePipe.transform(this.costSplitData.firstEndTime, 'yyyy-MM-dd');
        this.costSplitData.secondEndTime = this.datePipe.transform(this.costSplitData.secondEndTime, 'yyyy-MM-dd');
        this.costSplitData.stateOfArrears = this.costSplitData.stateOfArrears === true ? 1 : 0 ;
        console.log(this.costSplitData);
        this.paymentSrv.getCostSplitBill(this.costSplitData).subscribe(
          value => {
            if (value.status === '1000') {
              this.paymentItemData.splice( this.paymentItemListIndex, 1);
              // 设置其欠费状态和用户选择
              const costSplitList = value.data.map( v => {
                v.stateOfArrears = v.stateOfArrears !== 0;
                v.ownerSelection = this.ownerOption;
                return v;
             });
              this.paymentItemData.unshift(...costSplitList);
              this.getTotalBalaceData();
              this.costSplitDialog = false;
            } else {
              this.toolSrv.setToast('error', '操作成功', value.message);
            }
          }
        );
    } else {
      this.toolSrv.setToast('error', '操作错误', '您有信息未填');
    }
  }
  // 设置最大时间和最小时间
  public setDate(data, time): void {
    const Year = data.slice(0, data.indexOf('-'));
    const Month = data.slice(data.indexOf('-') + 1, data.lastIndexOf('-'));
    const Day = data.slice(data.lastIndexOf('-') + 1, data.length);
    time.setFullYear(Number(Year));
    time.setMonth(Number(Month) - 1);
    time.setDate(Number(Day));
  }

  public  getLocalTime(): void {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1;
    this.threeWayFeeCalculationTime =  year + '-' + month;
  }
  // 拆分列表切换用户设置其电话和id
  public changeSurname(name, index): void {
    console.log(this.ownerList);
    this.ownerList.forEach(v => {
      if (name === v.surname) {
        this.paymentItemData[index].payerPhone = v.mobilePhone;
        this.paymentItemData[index].payerUserId = v.customerUserId;
      }
    });
  }
  // 抵扣项目选则后计算总和
  public checkClickData(data, index): void {
      // console.log(this.paymentItemData);
      this.deductionDamagesItem = data;
      this.deductionDamagesListIndex = index;
      this.deductionDamagesData[index].deductionStatus =  this.deductionDamagesData[index].deductionStatus === 0 ? 1 : 0;
      this.getTotalBalaceData();
      // this.deductionDamagesSelect = [];
  }
  // 重新计算计算费用总和
  public getTotalBalaceData(): void {
    // console.log(this.paymentItemData);
    this.paymentItemData =  this.paymentItemData.map( v => {
      v.stateOfArrears = v.stateOfArrears === false ? 0 : 1;
      return v;
    });
    this.parkSpaceData = this.parkSpaceData.map( v => {
      v.rentalRenewalStatus = this.toolSrv.setLabelToValue(this.rentalRenewalStatusOption, v.rentalRenewalStatus);
      v.parkingSpaceType = this.toolSrv.setLabelToValue(this.parkSpaceTypeOption, v.parkingSpaceType);
      v.vehicleOriginalType = this.toolSrv.setLabelToValue(this.vehicleOriginaTypeOption, v.vehicleOriginalType);
      v.licensePlateType = this.toolSrv.setLabelToValue(this.lincesePlateTypeOption, v.licensePlateType);
      v.licensePlateColor = this.toolSrv.setLabelToValue(this.lincesePlateColorOption, v.licensePlateColor);
      v.parkingSpacePlace = this.toolSrv.setLabelToValue(this.parkSpacePlaceOption, v.parkingSpacePlace);
      return v;
    });
    this.paymentSrv.getTotalBalace({parkingSpaceCostDetailDOList: this.parkSpaceData, costDeduction: this.deductionDamagesData, billDetailedDOArrayList: this.paymentItemData, actualTotalMoneyCollection: this.paymentMoney}).subscribe(
      value => {

        if (value.status === '1000') {
           this.setPaymentList(value);
           this.paymentMoney = value.data.actualTotalMoneyCollection;
           this.paymentTotle = value.data.amountTotalReceivable;
           this.paymentActualTotal = value.data.actualTotalMoneyCollection;
           this.paymentReceivableTotle = value.data.actualTotalMoneyCollection;
           this.toolSrv.setToast('success', '计费成功', value.message);
           this.Balance = 0;
        } else {
          if (this.deductionDamagesData[this.deductionDamagesListIndex]) {
            if (this.deductionDamagesData[this.deductionDamagesListIndex].deductionStatus !== undefined) {
              this.deductionDamagesData[this.deductionDamagesListIndex].deductionStatus =  this.deductionDamagesData[this.deductionDamagesListIndex].deductionStatus === 0 ? 1 : 0;
            }
            this.deductionDamagesSelect.splice(this.deductionDamagesSelect.indexOf(this.deductionDamagesItem), 1);
            // 获取抵扣项目勾选中的抵扣项目
            this.deductionDamagesSelect =  this.deductionDamagesData.filter(v => {
              return v.deductionStatus === 1;
            });
          }
          // console.log(this.deductionDamagesData[this.deductionDamagesListIndex]);
          // this.toolSrv.setToast('error', '请求失败', value.message);
          this.paymentItemData =  this.paymentItemData.map( v => {
            v.stateOfArrears = v.stateOfArrears !== 0;
            return v;
          });
        }
      }
    );
  }
  // 设置费用的列表
  public setPaymentList(data): void {
    // 费用明细的列表
    // this.deductionDamagesSelect = [];
    this.paymentItemData = data.data.billDetailedDOArrayList.map( v => {
      v.stateOfArrears = v.stateOfArrears !== 0;
      v.ownerSelection = this.ownerOption;
      return v;
    });
    this.deductionDamagesData = data.data.costDeduction;
    // 获取抵扣项目勾选中的抵扣项目
    if (data.data.costDeduction)  {
      this.deductionDamagesSelect = data.data.costDeduction.filter(v => {
        return v.deductionStatus === 1;
      });
    }
    // console.log(this.deductionDamagesSelect);
    this.paymentAddTitle.forEach(v => {
      v.value = this.paymentSelect[0][v.label];
    });
    this.parkSpaceData = data.data.parkingSpaceCostDetailDOList.map( v => {
        v.rentalRenewalStatus = this.toolSrv.setValueToLabel(this.rentalRenewalStatusOption, v.rentalRenewalStatus);
        v.parkingSpaceType = this.toolSrv.setValueToLabel(this.parkSpaceTypeOption, v.parkingSpaceType);
        v.vehicleOriginalType = this.toolSrv.setValueToLabel(this.vehicleOriginaTypeOption, v.vehicleOriginalType);
        v.licensePlateType = this.toolSrv.setValueToLabel(this.lincesePlateTypeOption, v.licensePlateType);
        v.licensePlateColor = this.toolSrv.setValueToLabel(this.lincesePlateColorOption, v.licensePlateColor);
        v.parkingSpacePlace = this.toolSrv.setValueToLabel(this.parkSpacePlaceOption, v.parkingSpacePlace);
        // v. = this.toolSrv.setValueToLabel(this.parkSpaceTypeOption, v.parkingSpaceType);
        return v;
    });
  }

  // 树形结构点击
  public dataTreeClick(): void {
    this.treeDialog = true;
  }
  // Tree structure initialization
  public initializeTree(data, flag): any {
    const oneChild = [];
    for (let i = 0; i < data.length; i++) {
      const childnode = new TreeNode();
      childnode.value = data[i].code;
      childnode.label = data[i].name;
      childnode.level = data[i].level;
      if (flag === 'parkSpace') {
        if (data[i].level === '4') {
          childnode.selectable = true;
        } else {
          childnode.selectable = false;
        }
      } else {
        if (data[i].level === '1') {
          childnode.selectable = false;
        } else {
          childnode.selectable = true;
        }
      }

      if (data[i].SpaceDTO != null && data[i].SpaceDTO.length !== 0 ) {
        childnode.children = this.initializeTree(data[i].SpaceDTO, flag);
      } else {
        childnode.children = [];
      }
      oneChild.push(childnode);
    }
    return oneChild;
  }
  //  shu结构选择
  public dataTreeSureClick(): void {
    this.treeDialog = false;
    console.log(this.dataTree);
    const dataList = ['villageCode', 'villageName', 'regionCode', 'regionCode', 'buildingCode', 'buildingName', 'parkingSpaceCode'];
    for (const itemkey of dataList) {
      this.rentalParkSpace[itemkey] = '';
    }
    this.addParkSpace.parkingSpaceCode = this.dataTree.label;
    switch (this.dataTree.level) {
      case '1':
        this.rentalParkSpace.villageCode = this.dataTree.value;
        this.rentalParkSpace.villageName = this.dataTree.label;
        this.rentalCode = this.dataTree.label;
        break;
      case '2':
        this.rentalParkSpace.villageCode = this.dataTree.parent.value;
        this.rentalParkSpace.villageName = this.dataTree.parent.label;
        this.rentalParkSpace.regionCode = this.dataTree.value;
        this.rentalParkSpace.regionName = this.dataTree.label;
        this.rentalCode = this.dataTree.label;
        break;
      case '3':
        this.rentalParkSpace.villageCode = this.dataTree.parent.parent.value;
        this.rentalParkSpace.villageName = this.dataTree.parent.parent.label;
        this.rentalParkSpace.regionCode = this.dataTree.parent.value;
        this.rentalParkSpace.regionName = this.dataTree.parent.label;
        this.rentalParkSpace.buildingCode = this.dataTree.value;
        this.rentalParkSpace.buildingName = this.dataTree.label;
        this.rentalCode = this.dataTree.label;
        break;
      case '4':
        if (this.dataTree.parent.level === '2') {
          this.rentalParkSpace.villageCode = this.dataTree.parent.parent.value;
          this.rentalParkSpace.villageName = this.dataTree.parent.parent.label;
          this.rentalParkSpace.regionCode = this.dataTree.parent.value;
          this.rentalParkSpace.regionName = this.dataTree.parent.label;
          this.rentalParkSpace.parkingSpaceCode = this.dataTree.value;
        } else {
          this.rentalParkSpace.villageCode = this.dataTree.parent.parent.parent.value;
          this.rentalParkSpace.villageName = this.dataTree.parent.parent.parent.label;
          this.rentalParkSpace.regionCode = this.dataTree.parent.parent.value;
          this.rentalParkSpace.regionName = this.dataTree.parent.parent.label;
          this.rentalParkSpace.buildingCode = this.dataTree.parent.value;
          this.rentalParkSpace.buildingName = this.dataTree.parent.label;
          this.rentalParkSpace.parkingSpaceCode = this.dataTree.value;
        }
        this.rentalCode = this.dataTree.label;
        break;
      default:
        break;
    }
    console.log(this.rentalParkSpace);
  }

  // 编辑租赁车位的数据
  public editRentalParkingSpaceClick(index): void {
    console.log(this.parkSpaceData[index].rentalRenewalStatus);
    this.editRentalParkspaceDataFlag = index;
    // this.parkSpaceData[index]
    this.parkSpaceData[index].parkingSpaceType = this.toolSrv.setLabelToValue(this.parkSpaceTypeOption, this.parkSpaceData[index].parkingSpaceType);
    this.parkSpaceData[index].vehicleOriginalType = this.toolSrv.setLabelToValue(this.vehicleOriginaTypeOption, this.parkSpaceData[index].vehicleOriginalType);
    this.parkSpaceData[index].licensePlateType = this.toolSrv.setLabelToValue(this.lincesePlateTypeOption, this.parkSpaceData[index].licensePlateType);
    this.parkSpaceData[index].licensePlateColor = this.toolSrv.setLabelToValue(this.lincesePlateColorOption, this.parkSpaceData[index].licensePlateColor);
    this.parkSpaceData[index].parkingSpacePlace = this.toolSrv.setLabelToValue(this.parkSpacePlaceOption, this.parkSpaceData[index].parkingSpacePlace);
    this.parkSpaceData[index].rentalRenewalStatus = this.toolSrv.setLabelToValue(this.rentalRenewalStatusOption, this.parkSpaceData[index].rentalRenewalStatus);
    if (this.parkSpaceData[index].rentalRenewalStatus === null) {
      this.rentalHiddenInfo = true;
    }else {
      this.rentalHiddenInfo = this.parkSpaceData[index].rentalRenewalStatus === '1';
    }
    for (const key in this.parkSpaceData[index]) {
      this.rentalParkSpace[key] = this.parkSpaceData[index][key];
    }
    this.paymentSrv.getRoomTree({}).subscribe(
      value => {
        // console.log(value);
        this.dataTrees = this.initializeTree(value.data, 'editparkSpace');
      }
    );
    if (this.rentalParkSpace.parkingSpaceCode !== '') {
      this.rentalCode = this.rentalParkSpace.parkingSpaceCode ;
    } else if (this.rentalParkSpace.buildingName !== '') {
      this.rentalCode = this.rentalParkSpace.buildingName ;
    } else if (this.rentalParkSpace.regionName !== '') {
      this.rentalCode = this.rentalParkSpace.regionName ;
    } else if (this.rentalParkSpace.villageName !== '') {
      this.rentalCode = this.rentalParkSpace.villageName ;
    }
    this.parkSpaceOptionDialog = true;
  }
  // 租赁车位信息确认后的按钮
  public rentalparkSpaceClick(): void {
    if (this.rentalParkSpace.rentalRenewalStatus === '1') {
      const listPark = ['licensePlateNumber', 'rentalRenewalStatus', 'datedif'];
      const passStatus = listPark.some(value => {
        return  (this.rentalParkSpace[value] === null || this.rentalParkSpace[value] === '' || this.rentalParkSpace[value] === undefined);
      });
      if (!passStatus) {
        if (this.lincePlate.test(this.rentalParkSpace.licensePlateNumber)) {
          this.setrentalParkSpaceQuest();
        } else {
          this.toolSrv.setToast('error', '错误提示', '车牌号码不符合规则');
        }
      }
    } else {
     const rentalParklist = ['licensePlateNumber', 'rentalRenewalStatus', 'datedif', 'startTime', 'parkingSpacePlace', 'parkingSpaceType'];
     const pass = rentalParklist.some(value => {
       return  (this.rentalParkSpace[value] === null || this.rentalParkSpace[value] === '' || this.rentalParkSpace[value] === undefined);
      });
      if (!pass) {
        if (this.rentalCode !== undefined && this.rentalCode !== null) {
          if (this.lincePlate.test(this.rentalParkSpace.licensePlateNumber)) {
              this.setrentalParkSpaceQuest();
          } else {
            this.toolSrv.setToast('error', '错误提示', '车牌号码不符合规则');
          }
        } else {
          this.toolSrv.setToast('error', '错误提示', '带星号的数据未选择');
        }
      } else {
        this.toolSrv.setToast('error', '错误提示', '带星号的数据未填写完整');
      }
    }
  }
  // 编辑车位数据计费请求
  public setrentalParkSpaceQuest(): void {
    for (const key in this.rentalParkSpace) {
      this.parkSpaceData[this.editRentalParkspaceDataFlag][key] = this.rentalParkSpace[key];
    }
    this.parkSpaceData[this.editRentalParkspaceDataFlag].rentalRenewalStatus = this.toolSrv.setLabelToValue(this.rentalRenewalStatusOption, this.parkSpaceData[this.editRentalParkspaceDataFlag].rentalRenewalStatus);
    this.parkSpaceData[this.editRentalParkspaceDataFlag].parkingSpaceType = this.toolSrv.setLabelToValue(this.parkSpaceTypeOption, this.parkSpaceData[this.editRentalParkspaceDataFlag].parkingSpaceType);
    this.parkSpaceData[this.editRentalParkspaceDataFlag].vehicleOriginalType = this.toolSrv.setLabelToValue(this.vehicleOriginaTypeOption, this.parkSpaceData[this.editRentalParkspaceDataFlag].vehicleOriginalType);
    this.parkSpaceData[this.editRentalParkspaceDataFlag].licensePlateType = this.toolSrv.setLabelToValue(this.lincesePlateTypeOption, this.parkSpaceData[this.editRentalParkspaceDataFlag].licensePlateType);
    this.parkSpaceData[this.editRentalParkspaceDataFlag].licensePlateColor = this.toolSrv.setLabelToValue(this.lincesePlateColorOption, this.parkSpaceData[this.editRentalParkspaceDataFlag].licensePlateColor);
    this.parkSpaceData[this.editRentalParkspaceDataFlag].parkingSpacePlace = this.toolSrv.setLabelToValue(this.parkSpacePlaceOption, this.parkSpaceData[this.editRentalParkspaceDataFlag].parkingSpacePlace);
    this.parkSpaceData[this.editRentalParkspaceDataFlag].startTime = this.datePipe.transform(this.parkSpaceData[this.editRentalParkspaceDataFlag].startTime, 'yyyy-MM-dd');
    this.parkSpaceOptionDialog = false;
    this.paymentSrv.calculateRentalPackSpaceFree({roomCode: this.paymentSelect[0].roomCode, parkingSpaceCostDetailDO: this.parkSpaceData[this.editRentalParkspaceDataFlag]}).subscribe(
      value => {
        if (value.status === '1000') {
          console.log(value.data);
          value.data.forEach(v => {
            if (v.chargeType === '5') {
              if (v.notRentedNumber < 1) {
                this.toolSrv.setConfirmationWarn('租赁车位提醒', '可出租车位数量不足, 是否继续出租', () => {
                  this.parkSpaceData = [];
                  value.data.forEach(val1 => {
                    this.parkSpaceData.push(val1);
                  });
                  this.getTotalBalaceData();
                });
              } else {
                this.parkSpaceData = [];
                value.data.forEach(val => {
                  this.parkSpaceData.push(val);
                });
                this.getTotalBalaceData();
              }
            }
          });

          this.toolSrv.setToast('success', '请求成功', value.message);
          // this.parkSpaceData[this.editRentalParkspaceDataFlag]['parkingSpaceType'] = this.toolSrv.setValueToLabel(this.parkSpaceTypeOption, this.parkSpaceData[this.editRentalParkspaceDataFlag]['parkingSpaceType']);
          // this.parkSpaceData[this.editRentalParkspaceDataFlag]['rentalRenewalStatus'] = this.toolSrv.setValueToLabel(this.rentalRenewalStatusOption, this.parkSpaceData[this.editRentalParkspaceDataFlag]['rentalRenewalStatus']);
        } else {
          this.toolSrv.setToast('error', '请求失败', value.message);
        }
      }
    );
  }

  public rentalRenewalStatusChange(e): void {
      // console.log(e);
      if (e.value === '0') {
         this.rentalHiddenInfo = false;
      } else {
        this.rentalHiddenInfo = true;
      }
  }
  // 车位信息详情
  public parkSpaceDetailClick(index): void {
    console.log(this.parkSpaceData[index]);
    this.dialogOption = {
      dialog: true,
      tableHidden: false,
      width: '1000',
      type: 1,
      title: '车位详情',
      poplist: {
        popContent: this.parkSpaceData[index],
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
  // 导入车位数据文件
  public importParkplaceFilesClick(): void {
    this.UploadFileOption.width = '800';
    this.UploadFileOption.dialog = true;
    this.UploadFileOption.files = [];
  }
  // 确认上传
  public paymentUploadSureClick(e): void {
    if (e.getAll('file').length !== 0) {
      this.paymentSrv.importFilesWithParkSpaceInfo(e).subscribe(
        (value) => {
          if (value.status === '1000') {
            this.UploadFileOption.files = [];
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
                    {field: 'contractNumber', header: '合同编号'},
                    {field: 'packingSpaceCode', header: '车位编号'},
                    {field: 'result', header: '结果'},
                    {field: 'remarks', header: '备注'},
                  ],
                  style: {background: '#F4F4F4', color: '#000', height: '6vh'}
                },
                tableContent: {
                  data: value.data.logParkingSpaceManagementInfoDOS,
                  styleone: {background: '#FFFFFF', color: '#000', height: '2vw', textAlign: 'center'},
                  styletwo: {background: '#FFFFFF', color: '#000', height: '2vw', textAlign: 'center'}
                }
              }
            };
            // this.ownerInfoDialog = true;
            this.toolSrv.setToast('success', '上传成功', value.message);
          } else {
            this.toolSrv.setToast('error', '上传失败', value.message);
          }
        }
      );
    } else {
      this.toolSrv.setToast('error', '操作失败', '请选择需要上传的文件');
    }
  }
  // 设置按钮显示权限
  public setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '物业缴费') {
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
  // 全选取消
  public itemCalClick(): void {
     console.log();
     const flag = this.deductionDamagesData.some(v => {
       return v.deductionStatus === 1;
     });
     if (flag) {
       this.deductionDamagesData.forEach(val => {
          val.deductionStatus = 0;
       });
     } else {
       this.deductionDamagesData.forEach(val => {
         val.deductionStatus = 1;
       });
     }
     this.getTotalBalaceData();
  }
  // 放大弹窗
  public dilagClickAmplificationOpen(item): void {
      if (item.dialog === 'paymentDialog') {
        this.paymentDialog = true;
      }
      // console.log(123);
  }
  // 关闭弹窗
  public dialogClose(item): void {
    this.dialogHiddenData.splice(this.dialogHiddenData.indexOf(item), 1);
    this.paymentFaleseClick();
  }
  // 缩小弹窗
  public closePaymentDialogClick(): void {
    this.paymentDialog = false;
    const listFlag =  this.dialogHiddenData.some( v => {
      return v.label === '费用添加';
    });
    if (!listFlag) {
      this.dialogHiddenData.push({label: '费用添加', dialog: 'paymentDialog'});
    }
  }
  // 租赁弹窗取消
  public  rentalParkSpaceFalse(): void {
    this.parkSpaceOptionDialog = false;
    this.rentalHiddenInfo = true;
    this.parkSpaceData[this.editRentalParkspaceDataFlag].rentalRenewalStatus = this.toolSrv.setValueToLabel(this.rentalRenewalStatusOption, this.parkSpaceData[this.editRentalParkspaceDataFlag].rentalRenewalStatus);
    this.parkSpaceData[this.editRentalParkspaceDataFlag].parkingSpaceType = this.toolSrv.setValueToLabel(this.parkSpaceTypeOption, this.parkSpaceData[this.editRentalParkspaceDataFlag].parkingSpaceType);
    this.parkSpaceData[this.editRentalParkspaceDataFlag].vehicleOriginalType = this.toolSrv.setValueToLabel(this.vehicleOriginaTypeOption, this.parkSpaceData[this.editRentalParkspaceDataFlag].vehicleOriginalType);
    this.parkSpaceData[this.editRentalParkspaceDataFlag].licensePlateType = this.toolSrv.setValueToLabel(this.lincesePlateTypeOption, this.parkSpaceData[this.editRentalParkspaceDataFlag].licensePlateType);
    this.parkSpaceData[this.editRentalParkspaceDataFlag].licensePlateColor = this.toolSrv.setValueToLabel(this.lincesePlateColorOption, this.parkSpaceData[this.editRentalParkspaceDataFlag].licensePlateColor);
    this.parkSpaceData[this.editRentalParkspaceDataFlag].parkingSpacePlace = this.toolSrv.setValueToLabel(this.parkSpacePlaceOption, this.parkSpaceData[this.editRentalParkspaceDataFlag].parkingSpacePlace);
  }
}


