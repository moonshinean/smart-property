import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService} from 'primeng/api';
import {ChargePaymentService} from '../../../common/services/charge-payment.service';
import {
  ChargeItem, ChargeItemData, ChargeItemDetail, ChargeItems, ChargePaymentAddOrder, CostSplitData, Patyment, SearchData
} from '../../../common/model/charge-payment.model';
import {GlobalService} from '../../../common/services/global.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {SharedServiceService} from '../../../common/public/shared-service.service';
import {Subscription} from 'rxjs';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'rbi-chargeman-payment',
  templateUrl: './chargeman-payment.component.html',
  styleUrls: ['./chargeman-payment.component.less'],
})
export class ChargemanPaymentComponent implements OnInit, OnDestroy {
  public optionTable: any;
  public roomTypeOption: any[] = [];
  public paymentMethodOption: any[] = [];
  public sexOption: any[] = [];
  // public stateOfArrearChecked = false;
  // 缴费项目选则
  public selectCheckChargeItemList: any[] = [];
  // 上传详情记录相关
  public fileRecordoption: any;

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
    // {field: 'totle', header: '合计'},
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
  // 违约金信息列表内容
  public  deductionDamagesData: any;
  public  deductionDamagesStatus: any;
  public  deductionDamagesSelect: any[];
  public addPayProject = false;
  public paymentSelect: Patyment[];
  // 详情相关
  public dialogOption: any;
  // 收费项目选择确认查找详细数据
  public payItemDetail: ChargeItemData = new ChargeItemData();
  // public payItem: ChargeItems[] = [];

  public chargeScrollPanelStyle: any;
  public SearchData: SearchData = new SearchData();
  // 缴费相关
  public projectSelectDialog: boolean;
  public paymentDialog: boolean;
  public paymentTotle =  0; // 总计金额
  public paymentActualTotal = 0; // 实收总计
  public paymentMoney = 0; //
  public Balance = 0;
  // public paymentTotle = 0;
  // 初始化项目
  public paymentProject: ChargeItem[] = [];
  public paymentItemData: ChargeItemDetail[] = [];
  public paymentAddTitle =  [
    {name: '房间代码', value: '', label: 'roomCode'},
    {name: '建筑面积', value: '', label: 'roomSize'},
    {name: '客户名称', value: '', label: 'surname'},
    {name: '手机号码', value: '', label: 'mobilePhone'},
    {name: '物业费到期时间', value: '', label: 'dueTime'},
    {name: '账户余额', value: '', label: 'surplus'},
  ];
  public searchOption = [
    {label: '全部', value: 1},
    {label: '手机号', value: 2},
    {label: '姓名', value: 3},
    {label: '身份证号', value: 4},
  ];
  public searchType: any;
  public searchData: any;
  public nowPage = 1;
  public paymentOrderAdd: ChargePaymentAddOrder  = new ChargePaymentAddOrder();
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  public phoneErrorToast = true;
  public esDate: any;
  // ccRegex: RegExp = /[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/;
  // public msgs: Message[] = []; // 消息弹窗
  public paymentItemListIndex: any;
  // 费用拆分
  public ownerOption: any[] = [];
  public ownerList: any[] = [];
  public costSplitDialog: boolean;
  public minDate: Date = new Date();
  public maxDate: Date = new Date();
  public costSplitData: CostSplitData =  new CostSplitData();
  public paymentSub: Subscription;
  constructor(
    private paymentSrv: ChargePaymentService,
    private confirmationService: ConfirmationService,
    private globalSrv: GlobalService,
    private  toolSrv: PublicMethedService,
    private datePipe: DatePipe,
    private  sharedSrv: SharedServiceService
  ) {}
  ngOnInit() {
    this.paymentSub = this.sharedSrv.changeEmitted$.subscribe(
      value => {
        console.log(value);
      }
    );

    this.SearchDataClear();
    this.SearchData.mobilePhone = '';
    this.SearchData.roomCode = '';
    this.SearchData.pageNo = 1;
    this.SearchData.pageSize = 10;
    this.paymentInitialization();
  }
  ngOnDestroy(): void {
    // 取消订阅
    this.paymentSub.unsubscribe();
  }

  // Initialize the charge record（初始化收费记录）
  public  paymentInitialization(): void {
     this.esDate = this.toolSrv.esDate;
     this.toolSrv.getAdmStatus([{settingType: 'PAYMENT_METHOD'},
      {settingType: 'ROOM_TYPE'}, {settingType: 'SEX'}], (data) => {
       console.log(data);
       this.roomTypeOption = this.toolSrv.setListMap(data.ROOM_TYPE);
       this.paymentMethodOption = this.toolSrv.setListMap(data.PAYMENT_METHOD);
       this.sexOption = this.toolSrv.setListMap(data.SEX);
       this.queryPaymentPage();
    });
    // this.paymentTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
  }
  // condition search 条件搜索）
  public  paymentSearchClick(): void {
    if (this.searchType === undefined) {
      if (this.SearchData.villageCode !== '') {
        // this.queryData(this.SearchData);
      } else {
        this.toolSrv.setToast('error', '操作错误', '请选择搜索方式');
      }
    } else if (this.searchType === 2) {
      this.SearchDataClear();
      this.SearchData.mobilePhone = this.searchData;
      // this.SearchOption = {}
      // this.queryData(this.SearchData);
    } else if (this.searchType === 3) {
      this.SearchDataClear();
      this.SearchData.roomCode = this.searchData;
      this.SearchData.mobilePhone = '';
      // this.queryData(this.SearchData);
    } else {
      this.nowPage = 1;
      this.searchData = '';
      this.queryPaymentPage();
    }
  }
  //
   public  SearchDataClear(): void {
     this.SearchData.pageNo = 1;
     this.SearchData.pageSize = 10;
     this.SearchData.buildingCode = '';
     this.SearchData.regionCode = '';
     this.SearchData.villageCode = '';
   }
  // sure selectPreject payment （选择项目确认）
  public  paymentProjectSureClick(): void {
    // 获取选中的收费项目
    const list  = this.paymentProject.filter( v => {
      return v.check === 1;
    });
    if (list.length > 0 ) {
      // 组装请求参数
      const keyList = ['roomSize', 'roomCode', 'customerUserId', 'dueTime', 'surplus'];
      for (const key of keyList) {
        this.payItemDetail[key] = this.paymentSelect[0][key];
      }
      this.payItemDetail.chargeItem = list.map( v => {
         return {chargeCode: v.chargeCode, chargeName: v.chargeName, chargeType: v.chargeType,
           datedif: v.datedif, chargeStandard: v.chargeStandard};
      });
      // 查询拆分业主
      this.paymentSrv.getUserInfoByRoomCode({roomCode: this.paymentSelect[0].roomCode}).subscribe(
        value => {
          console.log(value);
          if (value.status === '1000') {
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
          console.log(value);
          if (value.status === '1000') {
            // 费用明细的列表
            this.paymentItemData = value.data.billDetailedDOArrayList.map( v => {
                v.stateOfArrears = v.stateOfArrears !== 0;
                return v;
            });
            this.deductionDamagesData = value.data.costDeduction;
            // 获取抵扣项目勾选中的抵扣项目
            this.deductionDamagesSelect = value.data.costDeduction.filter(v => {
               return v.deductionStatus === 1;
            });
            // console.log(this.deductionDamagesSelect);
            this.paymentAddTitle.forEach(v => {
               v.value = this.paymentSelect[0][v.label];
            });
            this.paymentTotle = value.data.amountTotalReceivable;
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
  // sure  payment (缴费确认)
  public  paymentSureClick(): void {
    if (this.paymentOrderAdd.paymentMethod === undefined) {
        this.toolSrv.setToast('error', '填写错误', '有数据没填写或者选择');
    } else {
        const listKey = ['organizationId', 'villageName',
          'villageCode', 'regionCode', 'regionName', 'buildingCode', 'buildingName', 'unitCode',
          'unitName', 'roomCode', 'roomSize', 'surname', 'mobilePhone', 'idNumber',
          'customerUserId'];
        for (const key of listKey) {
          this.paymentOrderAdd[key] = this.paymentSelect[0][key];
        }
        this.paymentOrderAdd.payerPhone = this.paymentOrderAdd.payerPhone === undefined ? '' : this.paymentOrderAdd.payerPhone;
        this.paymentOrderAdd.payerName = this.paymentOrderAdd.payerName === undefined ? '' : this.paymentOrderAdd.payerName;
        this.paymentOrderAdd.remark = this.paymentOrderAdd.remark === undefined ? '' : this.paymentOrderAdd.remark;
        this.paymentOrderAdd.amountTotalReceivable = this.paymentActualTotal;
        this.paymentOrderAdd.actualTotalMoneyCollection = this.paymentTotle;
        // this.paymentOrderAdd.
        this.paymentOrderAdd.billDetailedDOArrayList = this.paymentItemData.map( v => {
          v.stateOfArrears = v.stateOfArrears === false ? 0 : 1;
          return v;
        });
        this.paymentOrderAdd.costDeduction = this.deductionDamagesData;
        this.paymentOrderAdd.correctedAmount = this.Balance;
        console.log(this.paymentOrderAdd);
        this.paymentSrv.addPayOrder(this.paymentOrderAdd).subscribe(
          (value) => {
            if (value.status === '1000') {
              this.confirmationService.confirm({
                message: `是否打印单据吗？`,
                header: '缴费成功',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                  this.paymentSrv.getPayDocument({orderId: value.data.orderId, organizationId: value.data.organizationId}).subscribe(
                    (data) => {
                      if (data.data !== '') {
                        this.paymentDialog = false;
                        this.InitializationAllpayData();
                        window.open(data.data);
                      } else {
                        this.toolSrv.setToast('error', '操作失败', data.message);
                      }
                    }
                  );
                },
                reject: () => {
                  this.paymentDialog = false;
                  this.InitializationAllpayData();
                }
              });
            } else {
              this.toolSrv.setToast('error', '请求错误', value.message);
            }
          }
        );
      // } else {
      //   this.toolSrv.setToast('error', '手机号码格式错误', '请重新输入11位手机号码');
      // }
    }
  }
  // Display charging items selection pop-up window (展示项目选择弹窗)
  public  paymentClick(): void {
    if (this.paymentSelect === undefined || this.paymentSelect.length === 0 ) {
      this.toolSrv.setToast('error', '请求错误', '请选择需要缴费的项');
    } else if (this.paymentSelect.length === 1) {
      console.log(this.paymentSelect);
      this.paymentSrv.searchChargeItem({roomCode: this.paymentSelect[0].roomCode}).subscribe(
        (value) => {
          value.data.forEach( v => {
            if (v.chargeWay === 4) {
              this.selectCheckChargeItemList.push(v.chargeName);
              this.paymentProject.push({chargeCode: v.chargeCode, chargeName: v.chargeName,
                chargeType: v.chargeType, datedif: 1, chargeWay: v.chargeWay, check: 1, minMonth: 1,
                chargeStandards: JSON.parse(v.chargeStandards), chargeStandard: v.chargeStandard});
            } else  if (v.chargeWay === 3) {
              this.paymentProject.push({chargeCode: v.chargeCode, chargeName: v.chargeName,
                chargeType: v.chargeType, datedif: 0, chargeWay: v.chargeWay, check: 0, minMonth: 1,
                chargeStandards: JSON.parse(v.chargeStandards), chargeStandard: JSON.parse(v.chargeStandards)[0].value});
            } else  {
              this.paymentProject.push({chargeCode: v.chargeCode, chargeName: v.chargeName,
                chargeType: v.chargeType, datedif: 1, chargeWay: v.chargeWay, check: 0, minMonth: 1,
                chargeStandards: JSON.parse(v.chargeStandards), chargeStandard: v.chargeStandard});
            }
            }
          );
          this.projectSelectDialog = true;
        }
      );
    } else {
      this.toolSrv.setToast('error', '请求错误', '只能选择一项进行缴费');
    }
  }
  // Charge item selection switch (收费项目选择切换)
  public  projectChange(i): void {
    if (this.paymentProject[i].check === 0) {
      this.paymentProject[i].check = 1;
    } else {
      this.paymentProject[i].check = 0;
    }
  }
  // add payment Project
  public  paymentAddProjectClick(): void {
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
              this.paymentProject.push({
                chargeCode: v.chargeCode,
                chargeName: v.chargeName,
                chargeType: v.chargeType,
                datedif: this.paymentSelect[0].minMonth,
                chargeWay: v.chargeWay,
                check: 0,
                minMonth: this.paymentSelect[0].minMonth
              });
            } else {
              this.paymentProject.push({
                chargeCode: v.chargeCode,
                chargeName: v.chargeName,
                chargeType: v.chargeType,
                datedif: 1,
                chargeWay: v.chargeWay,
                check: 0,
                minMonth: 1
              });
            }
          }
        }
       );
      }
    );
    // this.paymentDialog = true;
  }
  // Cancel payment
  public  paymentFaleseClick(): void {
    this.paymentDialog = false;
    this.ownerList = [];
    this.selectCheckChargeItemList = [];
    this.deductionDamagesSelect = [];
    this.InitializationAllpayData();

  }
  // select pay type
  public  payTypeChage(e): void {
      // console.log(e);
      this.paymentOrderAdd.paymentMethod = e.value;
  }
  // Calculated amount (计算金额)
  public  getBalance(e): void {
    if (e.target.value >= this.paymentTotle) {
      this.Balance = parseFloat(( e.target.value - this.paymentTotle).toFixed(2));
    }
  }
  // cancel select charging items
  public  payProjectFalseClick(): void {
    if (this.addPayProject) {
      this.addPayProject = false;
      this.projectSelectDialog = false;

    } else {
      this.InitializationAllpayData();
      this.projectSelectDialog = false;
    }
  }
  // paging query
  public  nowpageEventHandle(event: any): void {
    this.nowPage = event;
    this.SearchData.pageNo = event;
    if (this.searchType === undefined) {
      // this.queryData(this.SearchData);
    } else {
      // this.queryDataPage();
    }
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
  public  InitializationAllpayData(): void {
    this.paymentItemData = [];
    this.paymentTotle = 0;
    this.payItemDetail = new ChargeItemData();
    this.paymentOrderAdd = new ChargePaymentAddOrder();
    this.Balance = 0;
    this.paymentSelect = [];
    // this.paymentInitialization();
    this.payItemDetail = new ChargeItemData();
    this.paymentProject = [];
    this.deductionDamagesSelect = [];
    this.deductionDamagesData = [];
  }
  // query data （搜索条件的搜索数据）
  // public  queryData(searData): void {
  //   // this.paymentSrv.searchPaymentData(searData).subscribe(
  //   //   (val) => {
  //   //     if (val.status === '1000') {
  //   //       if (val.data.contents) {
  //   //         val.data.contents.forEach( t => {
  //   //           t.sex = this.toolSrv.setValueToLabel(this.sexOption, t.sex);
  //   //           t.roomType = this.toolSrv.setValueToLabel(this.roomTypeOption, t.roomType);
  //   //         });
  //   //         this.setTableOption(val.data.contents);
  //   //         // }
  //   //         this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};
  //   //       } else {
  //   //         this.toolSrv.setToast('success', '搜索成功', '数据为空');
  //   //       }
  //   //     } else {
  //   //       this.toolSrv.setToast('error', '搜索失败', val.message);
  //   //
  //   //     }
  //   //   }
  //   // );
  // }
  // Paging query data （分页查询数据）
  public   queryPaymentPage(): void {
    this.paymentSrv.searchPaymentData(this.SearchData).subscribe(
      (val) => {
        console.log(val);
        if (val.status === '1000') {
          val.data.contents.forEach( t => {
            t.sex = this.toolSrv.setValueToLabel(this.sexOption, t.sex);
            t.roomType = this.toolSrv.setValueToLabel(this.roomTypeOption, t.roomType);
            // t.surplus  = '￥' + t.surplus;
          });
          this.setTableOption(val.data.contents);
          this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};
        } else {
          this.toolSrv.setToast('error', '请求错误', val.message);
        }
      }
    );
  }
  // set table data （设置列表数据）
  public  setTableOption(data1): void {
    this.optionTable = {
      width: '100%',
      header: {
        data:  [
          {field: 'buildingName', header: '楼栋名称'},
          {field: 'roomCode', header: '房间编号'},
          // {field: 'roomCode', header: '房间号'},
          {field: 'roomSize', header: '建筑面积'},
          {field: 'roomType', header: '房间类型'},
          {field: 'surname', header: '客户名称'},
          {field: 'sex', header: '客户性别'},
          {field: 'mobilePhone', header: '客户电话'},
          {field: 'dueTime', header: '物业费到期时间'},
          {field: 'minMonth', header: '欠费月数'},
          {field: 'surplus', header: '账户余额'},
          {field: 'operating', header: '操作'}],
        style: {background: '#282A31', color: '#DEDEDE', height: '6vh', marginRight: '0'}
      },
      Content: {
        data: data1,
        styleone: {background: '#33353C', color: '#DEDEDE', textAlign: 'center', height: '2vw'},
        styletwo: {background: '#2E3037', color: '#DEDEDE', textAlign: 'center', height: '2vw'},
      },
      type: 3,
      tableList:  [{label: '详情', color: '#6A72A1'}]
    };
  }
  // show detail dialog (展示详情弹窗)
  public  detailClick(e): void {
    this.dialogOption = {
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
          {field: 'buildingName', header: '楼栋名称'},
          {field: 'unitName', header: '单元名称'},
          {field: 'roomCode', header: '房间编号'},
          {field: 'roomSize', header: '建筑面积'},
          {field: 'roomType', header: '房间类型'},
          {field: 'surname', header: '客户名称'},
          {field: 'sex', header: '客户性别'},
          {field: 'mobilePhone', header: '客户电话'},
          {field: 'dueTime', header: '物业费到期时间'},
          {field: 'surplus', header: '账户余额'},
          {field: 'minMonth', header: '欠费月数'},
        ],
      }
    };
  }
  // select data （选择数据）
  public  selectData(e): void {
      this.paymentSelect = e;
  }

  public  stateOfArrearChange(value, index): void {
    this.paymentItemData[index].stateOfArrears = (value === true);
    this.getTotalBalaceData();
  }
  public  costSplitClick(e, index): void {
      this.paymentItemListIndex = index;
      this.costSplitData = e;
      this.costSplitData.spiltTime = e.startTime;
      this.setDate(e.startTime, this.minDate);
      this.setDate(e.dueTime, this.maxDate);
      this.costSplitDialog = true;
  }
  public  costSplitSure(): void {
    this.costSplitData.spiltTime = this.datePipe.transform(this.costSplitData.spiltTime, 'yyyy-MM-dd');
    this.costSplitData.stateOfArrears = this.costSplitData.stateOfArrears === true ? 1 : 0 ;
    console.log(this.costSplitData);
    this.paymentSrv.getCostSplitBill(this.costSplitData).subscribe(
      value => {
        console.log(value);
        if (value.status === '1000') {
          this.paymentItemData.splice( this.paymentItemListIndex, 1);
          console.log(this.paymentItemData);
          const costSplitList = value.data.map( v => {
            v.stateOfArrears = v.stateOfArrears !== 0;
            v.ownerSelection = this.ownerOption;
            return v;
         });
          // this.paymentItemData = this.paymentItemData.concat(costSplitList);
          this.paymentItemData.unshift(...costSplitList);
          console.log(this.paymentItemData);
        }
      }
    );
  }
  // 设置最大时间和最小时间
  public  setDate(data, time): void {
    const Year = data.slice(0, data.indexOf('-'));
    const Month = data.slice(data.indexOf('-') + 1, data.lastIndexOf('-'));
    const Day = data.slice(data.lastIndexOf('-') + 1, data.length);
    time.setFullYear(Number(Year));
    time.setMonth(Number(Month) - 1);
    time.setDate(Number(Day));
  }

  public  changeSurname(name, index): void {
    this.ownerList.forEach(v => {
      if (name === v.surname) {
        this.paymentItemData[index].payerPhone = v.mobilePhone;
        this.paymentItemData[index].customerUserId = v.customerUserId;
      }
    });
  }

  public  checkClickData(index): void {
      console.log(index);
      this.deductionDamagesData[index].deductionStatus =  this.deductionDamagesData[index].deductionStatus === 0 ? 1 : 0;
      this.getTotalBalaceData();
      // this.deductionDamagesSelect = [];
  }
  public  getTotalBalaceData(): void {
    this.paymentItemData =  this.paymentItemData.map( v => {
      v.stateOfArrears = v.stateOfArrears === false ? 0 : 1;
      return v;
    });
    console.log(this.deductionDamagesData);
    this.paymentSrv.getTotalBalace({costDeduction: this.deductionDamagesData, billDetailedDOArrayList: this.paymentItemData, actualTotalMoneyCollection: this.paymentMoney}).subscribe(
      value => {
        console.log(value);
        if (value.status === '1000') {
          // 费用明细的列表
          // this.deductionDamagesSelect = [];
          this.paymentItemData = value.data.billDetailedDOArrayList.map( v => {
            v.stateOfArrears = v.stateOfArrears !== 0;
            return v;
          });
          this.deductionDamagesData = value.data.costDeduction;
          // 获取抵扣项目勾选中的抵扣项目
          this.deductionDamagesSelect = value.data.costDeduction.filter(v => {
            return v.deductionStatus === 1;
          });
          // console.log(this.deductionDamagesSelect);
          this.paymentAddTitle.forEach(v => {
            v.value = this.paymentSelect[0][v.label];
          });
          this.paymentMoney = value.data.actualTotalMoneyCollection;
        } else {

        }
      }
    );
  }
}

