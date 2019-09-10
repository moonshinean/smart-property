import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {forEach} from '@angular/router/src/utils/collection';
import {ChargePaymentService} from '../../../common/services/charge-payment.service';
import {
  ChargeItem,
  ChargeItemData,
  ChargeItemDetail,
  ChargeItems,
  ChargePaymentAddOrder, LiquidatedDamages,
  Patyment, SearchData
} from '../../../common/model/charge-payment.model';
import {environment} from '../../../../environments/environment';
import {GlobalService} from '../../../common/services/global.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {FileOption} from '../../../common/components/basic-dialog/basic-dialog.model';

@Component({
  selector: 'rbi-chargeman-payment',
  templateUrl: './chargeman-payment.component.html',
  styleUrls: ['./chargeman-payment.component.less'],
})
export class ChargemanPaymentComponent implements OnInit {

  @ViewChild('input') input: Input;
  @ViewChild('scrollpanel') scrollpanel: ElementRef;
  // public paymentTableTitle = ;
  public optionTable: any;
  public paymentUploadFileOption: FileOption = new FileOption();
  public uploadedFiles: any[] = [];
  // 上传详情记录相关
  public fileRecordoption: any;
  // public paymentTableContent: any;
  // public paymentTableTitleStyle: any;
  public paymentDialogTableTitle = [
    {field: 'chargeName', header: '项目名称'},
    {field: 'chargeStandard', header: '标准单价'},
    {field: 'datedif', header: '月/张数'},
    {field: 'discount', header: '折扣'},
    {field: 'startTime', header: '开始期间'},
    {field: 'dueTime', header: '结束期间'},
    {field: 'amountReceivable', header: '应收金额'},
    {field: 'actualMoneyCollection', header: '实收金额'},
    // {field: 'totle', header: '合计'},
  ];
  // 违约金信息列表
  public liquidatedDamagesTitle = [
    {field: 'dueTimeFront', header: '季度初'},
    {field: 'dueTimeAfter', header: '季度末'},
    {field: 'days', header: '欠费天数'},
    {field: 'amountMoney', header: '金额'},
  ];
  // 违约金信息列表内容
  public liquidatedDamagesData: any;
  public liquidatedDamagesStatus: any;
  public liquidatedDamagesStyle: any;
  public addPayProject = false;
  public paymentSelect: Patyment[];
  // 详情相关
  public dialogOption: any;
  // 收费项目选择确认查找详细数据
  public payItemDetail: ChargeItemData = new ChargeItemData();
  // public payItem: ChargeItems[] = [];
  public  SearchOption = {
    village: [],
    region: [],
    building: [],
  };
  public chargeScrollPanelStyle: any;
  public SearchData: SearchData = new SearchData();
  // 缴费相关
  public projectSelectDialog: boolean;
  public paymentDialog: boolean;
  public paymentTotle = 0; // 总计金额
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
  ];
  public searchOption = [
    {label: '全部', value: 1},
    {label: '手机号', value: 2},
    {label: '房间号', value: 3},
  ];
  public searchType: any;
  public searchData: any;
  public optonDialog = [];
  public nowPage = 1;
  public paymentOrderAdd: ChargePaymentAddOrder  = new ChargePaymentAddOrder();
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  public phoneErrorToast = true;
  public loadHidden = true;
  // ccRegex: RegExp = /[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private paymentSrv: ChargePaymentService,
    private confirmationService: ConfirmationService,
    private globalSrv: GlobalService,
    private  toolSrv: PublicMethedService
  ) { }
  ngOnInit() {
    this.SearchData.buildingCode = '';
    this.SearchData.pageNo = 1;
    this.SearchData.pageSize = 10;
    this.SearchData.mobilePhone = '';
    this.SearchData.roomCode = '';
    this.SearchData.regionCode = '';
    this.SearchData.villageCode = '';
    this.SearchData.unitCode = '';
    this.paymentInitialization();
  }
  // Initialize the charge record（初始化收费记录）
  public  paymentInitialization(): void {
    this.loadHidden = false;
    // this.paymentTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
    this.queryDataPage();
  }
  // condition search 条件搜索）
  public  paymentSearchClick(): void {
    if (this.searchType === undefined) {
      this.queryData(this.SearchData);
    } else if (this.searchType === 2) {
      this.SearchData.roomCode = '';
      this.SearchData.mobilePhone = this.searchData;
      this.loadHidden = false;
      // this.SearchOption = {}
      this.queryData(this.SearchData);
    } else if (this.searchType === 3) {
      this.SearchData.pageNo = 1;
      this.SearchData.pageSize = 10;
      this.SearchData.roomCode = this.searchData;
      this.SearchData.mobilePhone = '';
      this.loadHidden = false;
      this.queryData(this.SearchData);
    } else {
      this.SearchOption.region = [];
      this.SearchOption.building = [];
      this.SearchOption.village = [];
      this.queryDataPage();
    }
  }
  // select village  (选择小区)
  public  VillageChange(e): void {
    this.SearchData.buildingCode = '';
    this.SearchData.regionCode = '';
    this.SearchOption.building = [];
    this.SearchData.villageCode = e.value;
    this.SearchOption.region = [];
    this.loadHidden = false;
    this.globalSrv.queryRegionInfo({villageCode: e.value}).subscribe(
      (value) => {
        value.data.forEach( v => {
          this.loadHidden = true;
          this. SearchOption.region.push({label: v.regionName, value: v.regionCode});
        });
      }
    );
  }
  // select region (选择地块)
  public  regionChange(e): void {
    this.loadHidden = false;
    this.SearchData.regionCode = e.value;
    this.SearchData.buildingCode = '';
    this.SearchOption.building = [];
    // this.SearchOption.unit = [];
    this.globalSrv.queryBuilingInfo({regionCode: e.value}).subscribe(
      (value) => {
        value.data.forEach( v => {
          this. SearchOption.building.push({label: v.buildingName, value: v.buildingCode});
        });
        this.loadHidden = true;

      }
    );
  }
  // select building (选择楼栋)
  public  buildingChange(e): void {
    // this.SearchData.buildingCode = '';
    // this.SearchData.unitCode = '';
    // this.SearchData.buildingCode
    // this.SearchOption.unit = [];
    this.SearchData.buildingCode = e.value;
    // this.globalSrv.queryunitInfo({buildingCode: e.value}).subscribe(
    //   (value) => {
    //     value.data.forEach( v => {
    //       this. SearchOption.unit.push({label: v.unitName, value: v.unitCode});
    //     });
    //   }
    // );
  }
  // // select unit
  // public  unitChange(e): void {
  //   this.SearchData.roomCode = '';
  //   this.SearchData.unitCode = e.value;
  //   this.globalSrv.queryRoomCode({unitCode: e.value}).subscribe(
  //     (value) => {
  //       value.data.forEach( v => {
  //         this. SearchOption.room.push({label: v.roomCode, value: v.roomCode});
  //       });
  //     }
  //   );
  // }
  // sure selectPreject payment （选择项目确认）
  public  paymentProjectSureClick(): void {
    let monthStatus = true;
    let monthCheckStatus = false;
    // Judge whether to choose（判断是否选择收费项）
    this.paymentProject.forEach(v => {
      if (v.check === 1) {
        monthCheckStatus = true;
      }
    });
    // Determine if the month is empty(判断月份是否为空)
    this.paymentProject.forEach(v => {
      if (v.check === 1) {
        if (v.chargeWay === 1) {
          if (v.datedif === '' || v.datedif === null) {
            this.toolSrv.setToast('error', '操作错误', '请选择月份' );
            monthStatus = false;
          }
        }
      }
    });

    if (!monthCheckStatus) {
      this.projectSelectDialog = true;
      this.toolSrv.setToast('error', '操作错误', '请选择收费项目' );
    } else {
      if (monthStatus) {
        this.loadHidden = false;
        this.optonDialog = [];
        this.toolSrv.getAdminStatus('PAYMENT_METHOD', (data) => {
          data.forEach(v => {
            this.optonDialog.push({label: v.settingName, value: v.settingCode});
          });
        });
        // console.log(this.paymentProject);
        this.paymentAddTitle.forEach(item => {
            item.value = this.paymentSelect[0][item.label];
          }
        );
        this.payItemDetail.dueTime = this.paymentSelect[0].dueTime;
        this.payItemDetail.roomSize = this.paymentSelect[0].roomSize;
        this.payItemDetail.roomCode = this.paymentSelect[0].roomCode;
        // this.payItemDetail.liquidatedDamages = this.liquidatedDamagesData;
        this.payItemDetail.chargeItem = [];
        this.paymentProject.forEach(value => {
          if (value.check === 1) {
            this.payItemDetail.chargeItem.push({chargeCode: value.chargeCode, chargeName: value.chargeName, chargeType: value.chargeType, datedif: value.datedif});
          }
        });
        this.paymentSrv.searchChargeItemDetail(this.payItemDetail).subscribe(
          (value) => {
            if (value.status === '1000') {
              this.paymentItemData = value.data.cost;
              if (value.data.cost.length > 4) {
                this.chargeScrollPanelStyle = {width: '100%', height: '20vh'};
              } else  {
                this.chargeScrollPanelStyle = {width: '100%'};
              }
              this.liquidatedDamagesStatus = value.data.lateFeeStatus;
              if (value.data.lateFeeStatus === 1) {
                if (value.data.lateFeeStatus > 4) {
                  this.liquidatedDamagesStyle = {width: '100%', height: '20vh'};
                } else {
                  this.chargeScrollPanelStyle = {width: '100%'};
                }
                this.liquidatedDamagesData = value.data.lateFee;
              }
              this.loadHidden = true;
              this.paymentTotle = 0;
              this.paymentItemData.forEach( v => {
                this.paymentTotle = this.paymentTotle + v.actualMoneyCollection;
                this.paymentActualTotal = this.paymentActualTotal + v.amountReceivable;
              });
              this.paymentTotle = Number(this.paymentTotle.toFixed(2));
              this.paymentMoney = this.paymentTotle;
            } else {
              this.toolSrv.setToast('error', '操作错误', value.message);
            }
          }
        );
        this.paymentDialog = true;
        this.projectSelectDialog = false;
      }
    }
  }
  // sure  payment (缴费确认)
  public  paymentSureClick(): void {
    if (this.paymentOrderAdd.paymentMethod === undefined || this.paymentOrderAdd.payerName === undefined || this.paymentOrderAdd.payerPhone === undefined) {
        this.toolSrv.setToast('error', '填写错误', '有数据没填写或者选择');
    } else {
      if (this.phoneErrorToast) {
        this.loadHidden = false;
        // this.paymentOrderAdd.roomSize = this.paymentSelect[0].roomSize;
        this.paymentOrderAdd.organizationId = this.paymentSelect[0].organizationId;
        this.paymentOrderAdd.organizationName = this.paymentSelect[0].organizationName;
        this.paymentOrderAdd.villageName = this.paymentSelect[0].villageName;
        this.paymentOrderAdd.villageCode = this.paymentSelect[0].villageCode;
        this.paymentOrderAdd.villageName = this.paymentSelect[0].villageName;
        this.paymentOrderAdd.regionCode = this.paymentSelect[0].regionCode;
        this.paymentOrderAdd.regionName = this.paymentSelect[0].regionName;
        this.paymentOrderAdd.buildingCode = this.paymentSelect[0].buildingCode;
        this.paymentOrderAdd.buildingName = this.paymentSelect[0].buildingName;
        this.paymentOrderAdd.unitCode = this.paymentSelect[0].unitCode;
        this.paymentOrderAdd.unitName = this.paymentSelect[0].unitName;
        this.paymentOrderAdd.roomCode = this.paymentSelect[0].roomCode;
        this.paymentOrderAdd.roomSize = this.paymentSelect[0].roomSize;
        this.paymentOrderAdd.surname = this.paymentSelect[0].surname;
        this.paymentOrderAdd.mobilePhone = this.paymentSelect[0].mobilePhone;
        this.paymentOrderAdd.amountTotalReceivable = this.paymentActualTotal;
        this.paymentOrderAdd.actualTotalMoneyCollection = this.paymentTotle;
        this.paymentOrderAdd.userId = this.paymentSelect[0].userId;
        this.paymentOrderAdd.chargeItemCostDTO = this.paymentItemData;
        this.paymentOrderAdd.surplus = this.Balance;
        this.paymentOrderAdd.surplus = this.Balance;
        this.paymentOrderAdd.liquidatedDamages = this.liquidatedDamagesData;
        console.log(this.paymentOrderAdd);
        this.paymentSrv.addPayOrder(this.paymentOrderAdd).subscribe(
          (value) => {
            this.loadHidden = true;
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
      } else {
        this.toolSrv.setToast('error', '手机号码格式错误', '请重新输入11位手机号码');
      }
    }
  }
  // Display charging items selection pop-up window (展示项目选择弹窗)
  public  paymentClick(): void {
    if (this.paymentSelect === undefined || this.paymentSelect.length === 0 ) {
      this.toolSrv.setToast('error', '请求错误', '请选择需要缴费的项');
    } else if (this.paymentSelect.length === 1) {
      this.loadHidden = false;
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
                if ( v.chargeType === '1' || v.chargeType === '2' || v.chargeType === '3') {
                  if (this.paymentSelect[0].minMonth === 0) {
                    this.paymentProject.push({chargeCode: v.chargeCode, chargeName: v.chargeName, chargeType: v.chargeType, datedif: this.paymentSelect[0].minMonth + 1, chargeWay: v.chargeWay, check: 0, minMonth: this.paymentSelect[0].minMonth});
                  }else {
                    this.paymentProject.push({chargeCode: v.chargeCode, chargeName: v.chargeName, chargeType: v.chargeType, datedif: this.paymentSelect[0].minMonth, chargeWay: v.chargeWay, check: 0, minMonth: this.paymentSelect[0].minMonth});
                  }
                } else {
                  this.paymentProject.push({chargeCode: v.chargeCode, chargeName: v.chargeName, chargeType: v.chargeType, datedif: 1, chargeWay: v.chargeWay, check: 0, minMonth: 1});
                }
              }
            }
          );
          this.projectSelectDialog = true;
          this.loadHidden = true;
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
    this.loadHidden = false;
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
            if ( v.chargeType === '1' || v.chargeType === '2' || v.chargeType === '3') {
              this.paymentProject.push({chargeCode: v.chargeCode, chargeName: v.chargeName, chargeType: v.chargeType, datedif: this.paymentSelect[0].minMonth, chargeWay: v.chargeWay, check: 0, minMonth: this.paymentSelect[0].minMonth });
            } else {
              this.paymentProject.push({chargeCode: v.chargeCode, chargeName: v.chargeName, chargeType: v.chargeType, datedif: 1, chargeWay: v.chargeWay, check: 0, minMonth: 1});
            }
          }
          this.loadHidden = true;
        }
       );
      }
    );
    // this.paymentDialog = true;
  }
  // Cancel payment
  public  paymentFaleseClick(): void {
    this.paymentDialog = false;
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
      this.loadHidden = false;
      this.projectSelectDialog = false;
    }
  }
  // paging query
  public  nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.queryDataPage();
    this.paymentSelect = [];
  }
  // Mobile phone number format judgment （手机号格式判断）
  public paymentPhoneChange(e): void {
    if (!/^1[37458]\d{9}$/.test(e)) {
      this.toolSrv.setToast('error', '手机号码格式错误', '请重新输入11位手机号码');
      this.phoneErrorToast = false;
      // return false;
    } else {
      this.phoneErrorToast = true;
    }
  }
  // Reset data (重置数据)
  public  InitializationAllpayData(): void {
    this.paymentItemData = [];
    // this.paymentDialog = false;
    this.paymentTotle = 0;
    this.payItemDetail = new ChargeItemData();
    this.paymentOrderAdd = new ChargePaymentAddOrder();
    this.Balance = 0;
    this.paymentSelect = [];
    this.paymentInitialization();
    this.payItemDetail = new ChargeItemData();
    this.paymentProject = [];
  }
  // query data （搜索条件的搜索数据）
  public  queryData(searData): void {
    this.toolSrv.getAdminStatus('SEX', (data) => {
      // console.log(data);
      this.toolSrv.getAdminStatus('ROOM_TYPE', (value) => {
        // console.log(value);
        this.paymentSrv.searchPaymentData(searData).subscribe(
          (val) => {
            if (val.status === '1000') {
              this.loadHidden = true;
              if (val.data.contents) {
                val.data.contents.forEach( total => {
                  total.sex = this.dataConversion(data, total.sex);
                  total.roomType = this.dataConversion(value, total.roomType);
                });
                this.setTableOption(val.data.contents);
                // }
                this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};
              } else {
                this.toolSrv.setToast('success', '搜索成功', '数据为空');
              }
            } else {
              this.toolSrv.setToast('error', '搜索失败', value.message);

            }
          }
        );
      });
    });
    // this.globalSrv.queryVillageInfo({}).subscribe(
    //   (data) => {
    //     this.SearchOption = {
    //       village: [],
    //       region: [],
    //       building: [],
    //     };
    //     data.data.forEach( v => {
    //       this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
    //     });
    //   }
    // );
  }
  // Paging query data （分页查询数据）
  public   queryDataPage(): void {
    this.toolSrv.getAdminStatus('SEX', (data) => {
      // console.log(data);
      this.toolSrv.getAdminStatus('ROOM_TYPE', (value) => {
        // console.log(value);
        this.paymentSrv.searchPaymentData({pageNo: this.nowPage , pageSize: 10}).subscribe(
          (val) => {
            if (val.status === '1000') {
              this.loadHidden = true;
              val.data.contents.forEach( total => {
                total.sex = this.dataConversion(data, total.sex);
                total.roomType = this.dataConversion(value, total.roomType);
              });
              this.setTableOption(val.data.contents);
              // }
              this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};
            } else {
              this.toolSrv.setToast('error', '请求错误', val.message);
            }
          }
        );
      });
    });
    this.globalSrv.queryVillageInfo({}).subscribe(
      (data) => {
        data.data.forEach( v => {
          this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
        });
      }
    );
  }
  // set table data （设置列表数据）
  public  setTableOption(data): void {
    this.optionTable = {
      width: '101.5%',
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
          {field: 'operating', header: '操作'}],
        style: {background: '#282A31', color: '#DEDEDE', height: '6vh'}
      },
      Content: {
        data: data,
        styleone: {background: '#33353C', color: '#DEDEDE', textAlign: 'center', height: '2vw'},
        styletwo: {background: '#2E3037', color: '#DEDEDE', textAlign: 'center', height: '2vw'},
      },
      type: 3,
      tableList:  [{label: '详情', color: '#6A72A1'}]
    };
  }
  // set data coversion （数据类型转换）
  public  dataConversion(data, label): any {
     data.forEach( v => {
       if (label.toString() === v.settingCode) {
         label = v.settingName;
       }
     });
     return label;
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
          {field: 'minMonth', header: '欠费月数'},
        ],
      }
    };
  }
  // select data （选择数据）
  public  selectData(e): void {
      this.paymentSelect = e;
  }

  // // show upload file dialog
  // public  uploadFile(): void {
  //   this.paymentUploadFileOption.dialog = true;
  //   this.paymentUploadFileOption.files = this.uploadedFiles;
  //   this.paymentUploadFileOption.width = '800';
  // }
  // sure upload file (确定上传文件)
  // public  uploadFileSureClick(e): void {
  //   this.loadHidden = false;
  //   this.paymentSrv.importOldBills(e).subscribe(
  //     value => {
  //       this.loadHidden = true;
  //       this.toolSrv.setQuestJudgment(value.status, value.message, () => {
  //        this.paymentUploadFileOption.files = [];
  //         this.fileRecordoption = {
  //           width: '900',
  //             dialog: true,
  //           title: '上传记录',
  //           totalNumber: value.data.totalNumber,
  //           realNumber: value.data.realNumber,
  //           uploadOption: {
  //           width: '102%',
  //             tableHeader: {
  //             data: [
  //               {field: 'orderId', header: '导入编号'},
  //               {field: 'code', header: '编号'},
  //               {field: 'roomCode', header: '房间号'},
  //               {field: 'result', header: '结果'},
  //               {field: 'remark', header: '备注'},
  //             ],
  //               style: { background: '#F4F4F4', color: '#000', height: '6vh'}
  //           },
  //           tableContent: {
  //             data: value.data.logOldBillsDOS,
  //               styleone: { background: '#FFFFFF', color: '#000', height: '2vw', textAlign: 'center'},
  //             styletwo: { background: '#FFFFFF', color: '#000', height: '2vw', textAlign: 'center'}
  //           }
  //         }
  //         };
  //       });
  //     }
  //   );
  // }
}

