import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ChargeParkspaceService} from '../../../common/services/charge-parkspace.service';
import {GlobalService} from '../../../common/services/global.service';
import { CalculateCostData, ChargeParkSpaceModel} from '../../../common/model/charge-parkSpace.model';
import {PublicMethedService} from '../../../common/public/public-methed.service';

@Component({
  selector: 'rbi-charge-parkspace',
  templateUrl: './charge-parkspace.component.html',
  styleUrls: ['./charge-parkspace.component.less']
})
export class ChargeParkspaceComponent implements OnInit {

  public parkspaceTableTitle: any;
  public parkspaceTableContent: any[];
  public parkspaceTableTitleStyle: any;
  public parkspaceSelect: any;
  // 添加相关
  public parkspaceAddDialog: boolean;
  public parkspaceAdd: ChargeParkSpaceModel = new ChargeParkSpaceModel();
  // 收费
  public ChargeSelectOption = [];
  public ChargeOption: any[] = [];
  public ChargetTypeName: any[] = [];
  // 车辆
  public carOption: any[] = [];
  public carOptions: any[] = [];
  public licenseColor: any;
  public licenseType: any;
  public carType: any;
  // 车位
  public parkSpaceOption: any[] = [];
  public parkSpaceOptions: any[] = [];
  public parkSpaceTime: any;
  public parkSpaceType: any;
  public parkSpaceNature: any;
  public monthOption: any[] = [];
  public sureName = true;
  public chargeCureName = false;
  public paymentMethed: any;
  // 续租状态
  public rentalRenewalStatusOption = [
    {label: '否', value: 0},
    {label: '是', value: 1},
  ];
  // 计费返回数据
  public ChageData: any[] = [];
  // 支付方式
  public paymentSelectOption: any[] = [];
  // 计算费用
  public calculationCharge: CalculateCostData = new CalculateCostData();
  // public msgs: Message[] = []; // 消息弹窗
  public SearchOption = {
    village: [],
    region: [],
    building: [],
    unit: [],
    room: [],
  };
  public esDate: any;
  public option: any;
  public loadHidden = true;
  // 详情
  public parkspaceDetailDialog: boolean;
  public parkspaceDetail: ChargeParkSpaceModel = new ChargeParkSpaceModel();

  // 其他相关
  public cleanTimer: any; // 清除时钟
  public nowPage = 1;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private chargeParkspaceSrv: ChargeParkspaceService,
    private toolSrv: PublicMethedService,
    private globalSrv: GlobalService,
  ) { }
  ngOnInit() {
    this.parkspaceInitialization();
  }

  // initialization parkspace
  public  parkspaceInitialization(): void {
    this.parkspaceAdd.rentalRenewalStatus = 0;
    this.parkspaceTableTitle = [
      {field: 'villageName', header: '小区名称'},
      {field: 'regionName', header: '地块名称'},
      {field: 'buildingName', header: '楼栋名称'},
      {field: 'unitName', header: '单元名称'},
      {field: 'roomCode', header: '房间编号'},
      {field: 'operating', header: '操作'},

    ];
    this.esDate = this.toolSrv.esDate;
    this.loadHidden = false;
    this.chargeParkspaceSrv.queryChargeParkSpacePageInfo({pageNo: this.nowPage, pageSize: 10 }).subscribe(
      value => {
        this.loadHidden = true;
        this.parkspaceTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
    this.parkspaceTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
    this.globalSrv.queryVillageInfo({}).subscribe(
      (data) => {
        data.data.forEach(v => {
          this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
          // = v.villageName;
        });
      }
    );

  }
  // select village
  public VillageChange(e): void {
    // console.log(this.test);
    this.loadHidden = false;
    this.SearchOption.region = [];
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.parkspaceAdd.villageName = e.originalEvent.target.innerText;
    this.globalSrv.queryRegionInfo({villageCode: e.value}).subscribe(
      (value) => {
        value.data.forEach(v => {
          this.loadHidden = true;
          this.SearchOption.region.push({label: v.regionName, value: v.regionCode});
        });
      }
    );
  }
  // select region
  public regionChange(e): void {
    this.loadHidden = false;
    this.SearchOption.unit = [];
    this.parkspaceAdd.regionName = e.originalEvent.target.innerText;
    this.globalSrv.queryBuilingInfo({regionCode: e.value}).subscribe(
      (value) => {
        value.data.forEach(v => {
          this.SearchOption.building.push({label: v.buildingName, value: v.buildingCode});
        });
        this.loadHidden = true;

      }
    );
    this.chargeParkspaceSrv.queryParkSpaceCodeByRegionCode({regionCode: e.value}).subscribe(
      value => {
        if (value.status === '1000') {
          value.data.forEach( v => {
            this.parkSpaceOptions.push({parkingSpaceCode: v.parkingSpaceCode, parkingSpaceNature: v.parkingSpaceNature, parkingSpaceArea: v.parkingSpaceArea, parkingSpaceType: v.parkingSpaceType});
            this.parkSpaceOption.push({label: v.parkingSpaceCode, value: v.parkingSpaceCode});
          });
        }
      }
    );
  }
  // select building
  public buildingChange(e): void {
    this.SearchOption.unit = [];
    this.parkspaceAdd.buildingName = e.originalEvent.target.innerText;
    this.globalSrv.queryunitInfo({buildingCode: e.value}).subscribe(
      (value) => {
        value.data.forEach(v => {
          this.SearchOption.unit.push({label: v.unitName, value: v.unitCode});
        });
      }
    );
  }
  // select unit
  public unitChange(e): void {
    this.parkspaceAdd.unitName = e.originalEvent.target.innerText;
    this.globalSrv.queryRoomCode({unitCode: e.value}).subscribe(
      value => {
        value.data.forEach( v => {
          this.SearchOption.room.push({label: v.roomCode, value: v.roomCode});
        });
      }
    );
  }
  // select roomCode
  public roomCodeChange(e): void {
      this.chargeParkspaceSrv.queryCarInfoByRoomCode({roomCode: e.value}).subscribe(
        value => {
          if (value.status === '1000') {
            value.data.forEach( v => {
              this.carOptions.push({vehicleOriginalType: v.vehicleOriginalType, licensePlateNumber: v.licensePlateNumber, licensePlateColor: v.licensePlateColor, licensePlateType: v.licensePlateType });
              this.carOption.push({label: v.licensePlateNumber, value: v.licensePlateType });
            });
          }
        }
      );
  }
  // search userInfo
  public getUserInfo(): void {
    if (this.parkspaceAdd.mobilePhone !== null) {
      this.chargeParkspaceSrv.quertyUserInfo({mobilePhone: this.parkspaceAdd.mobilePhone}).subscribe(
        value => {
          if (value.status === '1000') {
            if (value.data !== null) {
              this.parkspaceAdd.surname = value.data.surname;
              this.parkspaceAdd.userId = value.data.userId;
            } else {
              this.toolSrv.setToast('error', '操作错误', '手机号不存在,请重新输入');
            }
          }
        }
      );
    }
  }
  // Vehicle selection
  public  carSelectChange(e): void {
    this.carOptions.forEach( v => {
      if (e.value === v.licensePlateType) {
        this.parkspaceAdd.licensePlateColor = v.licensePlateColor;
        this.parkspaceAdd.licensePlateType = v.licensePlateType;
        this.parkspaceAdd.vehicleOriginalType = v.vehicleOriginalType;
      }
    });
    this.getCarInfo();
  }
  // Parking space selection
  public  parkSpaceChange(e): void {
    this.parkSpaceOptions.forEach( v => {
          if (e.value === v.parkingSpaceCode) {
            this.parkspaceAdd.parkingSpaceType = v.parkingSpaceType;
            this.parkspaceAdd.parkingSpaceNature = v.parkingSpaceNature;
            this.parkspaceAdd.parkingSpaceArea = v.parkingSpaceArea;
          }
        });
    this.getParkingInfo();
    this.chargeParkspaceSrv.queryParkSpaceExpireDate({roomCode: this.parkspaceAdd.roomCode,parkingSpaceCode: this.parkspaceAdd.parkingSpaceCode, mobilePhone: this.parkspaceAdd.mobilePhone}).subscribe(
      value =>  {
        if (value.data !== null) {
          this.parkspaceAdd.dueTime = value.data;
        } else {
          this.parkspaceAdd.dueTime = '首次租车位';
        }
      }
    );
  }
  // Select charging item
  public  chargeSelectChange(e): void {
    this.parkspaceAdd.chargeCode = e.value;
    this.ChargeOption.forEach( v => {
      if (e.value === v.value) {
        this.parkspaceAdd.chargeName = v.label;
        this.parkspaceAdd.chargeUnit = v.chargeUnit;
        this.parkspaceAdd.chargeType = v.chargeType;
        this.parkspaceAdd.chargeStandard = v.chargeStandard;
      }
    });
    this.getChargeItemInfo();
  }
  // condition search click
  public  parkspaceSearchClick(): void {
    // @ts-ignore
    // console.log(this.input.nativeElement.value);
    // console.log('这里是条件搜索');
  }
  // show add the parking bill dialog
  public  parkspaceAddClick(): void {
    this.chargeParkspaceSrv.quertyChargeInfo({}).subscribe(
      value => {
        if (value.data.length !== 0) {
          value.data.forEach(v => {
            this.ChargeOption.push({label: v.chargeName, value: v.chargeCode, chargeUnit: v.chargeUnit, chargeType: v.chargeType, chargeStandard: v.chargeStandard, refund: v.refund });
            this.ChargeSelectOption.push({label: v.chargeName, value: v.chargeCode});
          });
        }
      }
    );
    this.toolSrv.getAdminStatus( 'PAYMENT_METHOD', (data) => {
      if (data.length > 0) {
        data.forEach( v => {
          this.paymentSelectOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    });
    this.parkspaceAddDialog = true;
  }
  // Parking space billing
  public  parkspaceBillClick(): void {
    this.calculationCharge.chargeCode = this.parkspaceAdd.chargeCode;
    this.calculationCharge.chargeName = this.parkspaceAdd.chargeName;
    this.calculationCharge.chargeType = this.parkspaceAdd.chargeType;
    this.calculationCharge.parkingSpaceNature = this.parkspaceAdd.parkingSpaceNature;
    this.calculationCharge.parkingSpaceType = this.parkspaceAdd.parkingSpaceType;
    this.calculationCharge.datedif = this.parkspaceAdd.datedif;
    this.calculationCharge.dueTime = this.parkspaceAdd.dueTime;
    this.calculationCharge.rentalRenewalStatus = this.parkspaceAdd.rentalRenewalStatus;
    let pass = true;
    for (const key in this.calculationCharge) {
       if (this.calculationCharge[key] === null || this.calculationCharge[key] === undefined) {
         pass = false;
       }
     }
    if (pass) {
      this.chargeParkspaceSrv.calculateCost(this.calculationCharge).subscribe(
         value => {
           if (value.status === '1000') {
           this.ChageData = [
               {label: '应收金额', code: 'amountReceivable', value: ''},
               {label: '实收金额', code: 'actualMoneyCollection', value: ''},
               {label: '优惠金额', code: 'preferentialAmount', value: ''},
               {label: '项目收费单价', code: 'chargeStandard', value: ''},
               {label: '开始时间', code: 'startTime', value: ''},
               {label: '结束时间', code: 'dueTime', value: ''},
           ];
           this.ChageData.forEach(v => {
             v.value = value.data[v.code];
             this.parkspaceAdd[v.code] = value.data[v.code];
           });
           this.parkspaceAdd.paymentType = this.parkspaceAdd.chargeType;
           this.toolSrv.setToast('success', '操作成功', '计费成功');
           this.sureName = false;
           this.chargeCureName = true;
           }
         }
       );
     } else {
       this.toolSrv.setToast('error', '操作错误', '请选择完整数据');
     }
  }
  // sure add parkspace
  public  parkspaceAddSureClick(): void {
    this.toolSrv.setConfirmation('增加', '增加', () => {
      this.chargeParkspaceSrv.addChargeParkSpaceTolList(this.parkspaceAdd).subscribe(
        value => {
          if (value.status === '1000') {
            this.toolSrv.setToast('success', '操作成功', '缴单添加成功');
            this.parkspaceAddDialog = false;
            this.sureName = true;
            this.chargeCureName = false;
            this.parkspaceInitialization();
          }
        }
      );
    });
  }

  // Parking fee details
  public  parkSpaceDetailClick(e): void {
    this.parkspaceDetail = e;
    this.getChargeItemInfo();
    this.getCarInfo();
    this.toolSrv.getAdminStatus('PAYMENT_METHOD', (data) => {
      if (data.length > 0) {
        this.toolSrv.setDataFormat(data, this.parkspaceDetail.paymentMethod, (list, dataName) =>{
          this.paymentMethed = dataName;
        });
      }
    });
    this.parkspaceDetailDialog = true;
  }
  // select parkspace
  public clearData(): void {
    this.parkspaceAdd = new ChargeParkSpaceModel();
    this.ChargeSelectOption = [];
    this.ChargeOption = [];
    this.ChargetTypeName = [];
    // 车辆
    this.carOption = [];
    this.carOptions = [];
    this.licenseColor = null;
    this.licenseType = null;
    this.carType = null;
    // 车位
    this.parkSpaceOption = [];
    this.parkSpaceOptions = [];
    this.parkSpaceTime = null;
    this.parkSpaceType = null;
    this.parkSpaceNature = null;
    this.monthOption = [];
    this.paymentSelectOption = [];
    this.ChageData = [];
    this.calculationCharge = new CalculateCostData();
    for (const searchOptionKey in this.SearchOption) {
         if (searchOptionKey !== 'village') {
           this.SearchOption[searchOptionKey] = [];
         }
    }
    this.paymentMethed = null;
  }
  // get car info
  public getCarInfo(): void {
    this.toolSrv.getNativeStatus('LICENSE_PLATE_COLOR', (data) => {
      if (data.length > 0) {
        this.toolSrv.setDataFormat(data, this.parkspaceAdd.licensePlateColor, (list, dataName) => {
          this.licenseColor = dataName;
        });
      }
    });
    this.toolSrv.getNativeStatus('LICENSE_PLATE_TYPE', (data) => {
      if (data.length > 0) {
        this.toolSrv.setDataFormat(data, this.parkspaceAdd.licensePlateType, (list, dataName) => {
          this.licenseType = dataName;
        });
      }
    });
    this.toolSrv.getNativeStatus('VEHICLE_ORIGINA_TYPE', (data) => {
      if (data.length > 0) {
        this.toolSrv.setDataFormat(data, this.parkspaceAdd.vehicleOriginalType, (list, dataName) => {
          this.carType = dataName;
        });
      }
    });
  }
  // get parking info
  public  getParkingInfo(): void {
    this.toolSrv.getNativeStatus('CWXZ', (data) => {
      if (data.length > 0) {
        this.toolSrv.setDataFormat(data, this.parkspaceAdd.parkingSpaceNature, (list, dataName) => {
          this.parkSpaceNature = dataName;
        });
      }
    });
    this.toolSrv.getNativeStatus('CWLX', (data) => {
      if (data.length > 0) {
        this.toolSrv.setDataFormat(data, this.parkspaceAdd.parkingSpaceType, (list, dataName) => {
          this.parkSpaceType = dataName;
        });
      }
    });
  }
  // get ChargeItem Info
  public  getChargeItemInfo(): void {
    this.toolSrv.getAdminStatus('CHARGE_TYPE', (data) => {
      if (data.length > 0) {
        this.toolSrv.setDataFormat(data, this.parkspaceAdd.chargeType, (list, dataName) => {
          this.ChargetTypeName = dataName;
        });
      }
    });
    this.toolSrv.getAdminStatus('DATEDIF', (data) => {
      if (data.length > 0) {
        data.forEach( v => {
          this.monthOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    });
  }
  // paging query
  public nowpageEventHandle(event): void {
    this.nowPage = event;
    this.loadHidden = false;
    this.chargeParkspaceSrv.queryChargeParkSpacePageInfo({pageNo: this.nowPage, pageSize: 10 }).subscribe(
      value => {
        this.loadHidden = true;
        this.parkspaceTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
  }
}
