
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {BfVehicleService} from '../../../common/services/bf-vehicle.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AddVehicle, ModifyVehicle, Vehicle} from '../../../common/model/bf-vehicle.model';
import {GlobalService} from '../../../common/services/global.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';

@Component({
  selector: 'rbi-bf-vehicle',
  templateUrl: './bf-vehicle.component.html',
  styleUrls: ['./bf-vehicle.component.less']
})
export class BfVehicleComponent implements OnInit {
  public vehicleTableTitle: any;
  public vehicleTableContent: any[];
  public vehicleTableTitleStyle: any;
  public vehicleSelect: any[];
  // 添加相关
  public vehicleAddDialog: boolean;
  public vehicleAdd: AddVehicle = new AddVehicle();
  public  licensePlateColorOption: any[] = [];
  public  licensePlateTypeOption: any[] = [];
  public  vehicleOriginalTypeOption: any[] = [];
  // 修改相关
  public vehicleModifayDialog: boolean;
  public vehicleModify: ModifyVehicle = new ModifyVehicle();
  public licensePlateColorModify: any;
  public licensePlateTypeModify: any;
  public vehicleOriginalTypeModify: any;
  // 详情相关
  public vehicleDetailDialog: boolean;
  public vehicleDetail: Vehicle = new Vehicle();

  // public msgs: Message[] = []; // 消息弹窗
  public SearchOption = {
    village: [],
    region: [],
    building: [],
    unit: []
  };
  public deleteIds: any[] = [];
  public option: any;
  public loadHidden = true;
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public nowPage = 1;
  public roonCodeSelectOption: any[] = [];

  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private toolSrv: PublicMethedService,
    private vehicleSrv: BfVehicleService,
    private globalSrv: GlobalService,
  ) {
  }

  ngOnInit() {
    this.vehicleInitialization();
  }

  // initialization vehicle
  public vehicleInitialization(): void {
    this.vehicleTableTitle = [
      {field: 'villageName', header: '小区名称'},
      {field: 'regionName', header: '地块名称'},
      {field: 'buildingName', header: '楼栋名称'},
      {field: 'unitName', header: '单元名称'},
      {field: 'roomCode', header: '房间编号'},
      {field: 'licensePlateNumber', header: '车牌号'},
      {field: 'operating', header: '操作'},
    ];
    this.loadHidden = false;
    this.vehicleSrv.queryVehicleInfoPage({pageNo: this.nowPage, pageSize: 10}).subscribe(
      value => {
        this.loadHidden = true;
        this.vehicleTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
    this.globalSrv.queryVillageInfo({}).subscribe(
      (data) => {
        data.data.forEach(v => {
          this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
          // = v.villageName;
        });
      }
    );
    this.vehicleTableTitleStyle = {background: '#282A31', color: '#DEDEDE', height: '6vh'};

  }
  // select village
  public VillageChange(e): void {
    // console.log(this.test);
    this.loadHidden = false;
    this.SearchOption.region = [];
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.vehicleAdd.villageName = e.originalEvent.target.innerText;
    this.vehicleModify.villageName = e.originalEvent.target.innerText;
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
    this.vehicleAdd.regionName = e.originalEvent.target.innerText;
    this.vehicleModify.regionName = e.originalEvent.target.innerText;
    this.globalSrv.queryBuilingInfo({regionCode: e.value}).subscribe(
      (value) => {
        value.data.forEach(v => {
          this.SearchOption.building.push({label: v.buildingName, value: v.buildingCode});
        });
        this.loadHidden = true;

      }
    );
  }
  // select building
  public buildingChange(e): void {
    this.SearchOption.unit = [];
    this.vehicleAdd.buildingName = e.originalEvent.target.innerText;
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
    this.vehicleAdd.unitName = e.originalEvent.target.innerText;
    this.vehicleSrv.queryRoomCode({unitCode: e.value}).subscribe(
      value => {
        value.data.forEach( v => {
          this.roonCodeSelectOption.push({label: v.roomCode, value: v.roomCode});
        });
      }
    );
  }
  // condition search click
  public vehicleSearchClick(): void {
    // @ts-ignore
  }
  // Show add vehicle dialog
  public vehicleAddClick(): void {
    this.getCarInfo('', '', '');
    this.vehicleAddDialog = true;
  }
  // sure add vehicle
  public vehicleAddSureClick(): void {
    this.toolSrv.setConfirmation('增加', '增加', () => {
      this.vehicleSrv.addVehicleInfo(this.vehicleAdd).subscribe(
        value => {
          if (value.status === '1000') {
            this.toolSrv.setToast('success', '操作成功', value.message);
            this.clearData();
            this.vehicleAddDialog = false;
            this.vehicleInitialization();
          }
        }
      );
    });
  }
  //  show vehicle detail dialog
  public vehicleDetailClick(e): void {
    this.vehicleDetail = e;
    this.getCarInfo(this.vehicleDetail.licensePlateColor, this.vehicleDetail.licensePlateType, this.vehicleDetail.vehicleOriginalType);
    this.vehicleDetailDialog = true;
  }
  // vehicle select
  public  vehicleonRowSelect(e): void {
    this.vehicleModify = e.data;
  }
  // Show modify vehicle dialog
  public vehicleModifyClick(): void {
    if (this.vehicleSelect === undefined || this.vehicleSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.vehicleSelect.length === 1) {
      this.getCarInfo(this.vehicleModify.licensePlateColor, this.vehicleModify.licensePlateType, this.vehicleModify.vehicleOriginalType);
      this.vehicleModifayDialog = true;
    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行修改');
    }
  }
  // sure modify vehicle
  public vehicleModifySureClick(): void {
    this.toolSrv.setConfirmation('修改', '修改' , () => {
      this.vehicleSrv.updateVehicleInfo(this.vehicleModify).subscribe(
        value => {
          if (value.status === '1000') {
            this.toolSrv.setToast('success', '操作成功', value.message);
            this.vehicleModifayDialog = false;
            this.clearData();
            this.vehicleInitialization();
          }
        }
      );
    });
  }
  // delete vehicle
  public vehicleDeleteClick(): void {
    if (this.vehicleSelect === undefined || this.vehicleSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.toolSrv.setConfirmation('删除', `删除这${this.vehicleSelect.length}项`, () => {
        this.vehicleSelect.forEach( v => {
          this.deleteIds.push(v.id);
        });
        this.vehicleSrv.deleteVehicleInfo({ids: this.deleteIds.join(',')}).subscribe(
          value => {
            if (value.status === '1000' ) {
              this.toolSrv.setToast('success', '操作成功', value.message);
              this.clearData();
              this.vehicleInitialization();
            }
          }
        );
      });
    }
  }
  // Reset data
  public clearData(): void {
    this.vehicleAdd = new AddVehicle();
    this.vehicleModify = new ModifyVehicle();
    this.licensePlateColorModify = null;
    this.licensePlateTypeModify = null;
    this.vehicleOriginalTypeModify = null;
    this.licensePlateColorOption = [];
    this.licensePlateTypeOption = [];
    this.vehicleOriginalTypeOption = [];
    this.vehicleSelect = [];
  }
  // get car info
  public  getCarInfo(color, type, OriginalType): void {
    this.toolSrv.getNativeStatus('LICENSE_PLATE_COLOR', (data) => {
      if (data.length > 0) {
        this.toolSrv.setDataFormat(data, color, (list, dataName) => {
          this.licensePlateColorOption = list;
          this.licensePlateColorModify = dataName;
        });
      }
    });
    this.toolSrv.getNativeStatus('LICENSE_PLATE_TYPE', (data) => {
      if (data.length > 0) {
        this.toolSrv.setDataFormat(data, type, (list, dataName) => {
          this.licensePlateTypeOption = list;
          this.licensePlateTypeModify = dataName;
        });
      }
    });
    this.toolSrv.getNativeStatus('VEHICLE_ORIGINA_TYPE', (data) => {
      if (data.length > 0) {
        this.toolSrv.setDataFormat(data, OriginalType, (list, dataName) => {
          this.vehicleOriginalTypeOption = list;
          this.vehicleOriginalTypeModify = dataName;
        });
      }
    });
  }
  // paging query
  public nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.vehicleSrv.queryVehicleInfoPage({pageNo: this.nowPage, pageSize: 10}).subscribe(
      value => {
        this.loadHidden = true;
        this.vehicleTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
  }
}
