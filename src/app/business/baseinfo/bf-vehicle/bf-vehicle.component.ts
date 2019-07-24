
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {BfVehicleService} from '../../../common/services/bf-vehicle.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AddVehicle, ModifyVehicle, Vehicle} from '../../../common/model/bf-vehicle.model';
import {GlobalService} from '../../../common/services/global.service';

@Component({
  selector: 'rbi-bf-vehicle',
  templateUrl: './bf-vehicle.component.html',
  styleUrls: ['./bf-vehicle.component.less']
})
export class BfVehicleComponent implements OnInit {
  @ViewChild('input') input: Input;
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
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private vehicleSrv: BfVehicleService,
    private globalSrv: GlobalService,
  ) {
  }

  ngOnInit() {
    this.vehicleInitialization();
  }

  // initialization vehicle
  public vehicleInitialization(): void {
    console.log('这里是信息的初始化');
    this.vehicleTableTitle = [
      {field: 'villageName', header: '小区名称'},
      {field: 'regionName', header: '地块名称'},
      {field: 'buildingName', header: '楼栋名称'},
      {field: 'unitName', header: '单元名称'},
      {field: 'roomCode', header: '房间编号'},
      {field: 'licensePlateNumber', header: '车牌号'},
      {field: 'licensePlateColor', header: '车牌颜色'},
      {field: 'operating', header: '操作'},
    ];
    this.loadHidden = false;
    this.vehicleSrv.queryVehicleInfoPage({pageNo: this.nowPage, pageSize: 10}).subscribe(
      value => {
        this.loadHidden = true;
        console.log(value);
        this.vehicleTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
    this.globalSrv.queryVillageInfo({}).subscribe(
      (data) => {
        console.log(data);
        data.data.forEach(v => {
          this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
          // = v.villageName;
        });
        // this.villageplaceholder =  this.SearchOption.village[0].label;
      }
    );
    this.vehicleTableTitleStyle = {background: '#282A31', color: '#DEDEDE', height: '6vh'};
    console.log(this.vehicleSelect);

  }

  // village change
  public VillageChange(e): void {
    // console.log(this.test);
    this.loadHidden = false;
    this.SearchOption.region = [];
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.vehicleAdd.villageName = e.originalEvent.target.innerText;
    // this.vehicleAdd.villageCode = e.value;
    this.vehicleModify.villageName = e.originalEvent.target.innerText;
    // this.vehicleModify.villageCode = e.value;
    this.globalSrv.queryRegionInfo({villageCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach(v => {
          this.loadHidden = true;
          this.SearchOption.region.push({label: v.regionName, value: v.regionCode});
        });
      }
    );
  }
  public regionChange(e): void {
    this.loadHidden = false;
    this.SearchOption.unit = [];
    this.vehicleAdd.regionName = e.originalEvent.target.innerText;
    // this.vehicleAdd.regionCode = e.value;
    this.vehicleModify.regionName = e.originalEvent.target.innerText;
    // this.vehicleModify.regionCode = e.value;
    console.log(e.value);
    this.globalSrv.queryBuilingInfo({regionCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach(v => {
          this.SearchOption.building.push({label: v.buildingName, value: v.buildingCode});
        });
        this.loadHidden = true;

      }
    );
  }
  public buildingChange(e): void {
    this.SearchOption.unit = [];
    this.vehicleAdd.buildingName = e.originalEvent.target.innerText;
    this.globalSrv.queryunitInfo({buildingCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach(v => {
          this.SearchOption.unit.push({label: v.unitName, value: v.unitCode});
        });
      }
    );
  }
  public unitChange(e): void {
    console.log(e.value);
    this.vehicleAdd.unitName = e.originalEvent.target.innerText;
    this.vehicleSrv.queryRoomCode({unitCode: e.value}).subscribe(
      value => {
        console.log(value);
        value.data.forEach( v => {
          this.roonCodeSelectOption.push({label: v.roomCode, value: v.roomCode});
        });
      }
    );
  }
  // condition search click
  public vehicleSearchClick(): void {
    // @ts-ignore
    console.log(this.input.nativeElement.value);
    console.log('这里是条件搜索');
  }
  // add vehicle
  public vehicleAddClick(): void {
    this.vehicleSrv.queryVehicleAllType({settingType: 'LICENSE_PLATE_COLOR'}).subscribe(
      value => {
        console.log(value);
        value.data.forEach( v => {
          // console.log();
          this.licensePlateColorOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    );
    this.vehicleSrv.queryVehicleAllType({settingType: 'LICENSE_PLATE_TYPE'}).subscribe(
      value => {
        console.log(value);
        value.data.forEach( v => {
          // console.log();
          this.licensePlateTypeOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    );
    this.vehicleSrv.queryVehicleAllType({settingType: 'VEHICLE_ORIGINA_TYPE'}).subscribe(
      value => {
        console.log(value);
        value.data.forEach( v => {
          // console.log();
          this.vehicleOriginalTypeOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    );
    // this.vehicleSrv.queryParkSpaceNatureStatus({settingType: 'CWXZ'}).subscribe(
    //   value => {
    //     this.parkSpaceNatureOption = [];
    //     value.data.forEach(v => {
    //       this.parkSpaceNatureOption.push({label: v.settingName, value: v.settingCode});
    //     });
    //   }
    // );
    // this.vehicleSrv.queryParkSpaceNatureStatus({settingType: 'CWLX'}).subscribe(
    //   value => {
    //     this.parkSpaceTypeOption = [];
    //     value.data.forEach(v => {
    //       this.parkSpaceTypeOption.push({label: v.settingName, value: v.settingCode});
    //     });
    //   }
    // );
    this.vehicleAddDialog = true;
  }
  // sure add vehicle
  public vehicleAddSureClick(): void {
    this.confirmationService.confirm({
      message: `确认要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(this.vehicleAdd);
        this.vehicleSrv.addVehicleInfo(this.vehicleAdd).subscribe(
          value => {
            if (value.status === '1000') {
              this.setToast('success', '操作成功', value.message);
              this.clearData();
              this.vehicleAddDialog = false;
              this.vehicleInitialization();
            }
          }
        );

        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
        console.log('这里是增加信息');

        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }
  //  vehicle detail
  public vehicleDetailClick(e): void {
    this.vehicleDetail = e;
    this.vehicleSrv.queryVehicleAllType({settingType: 'LICENSE_PLATE_COLOR'}).subscribe(
      value => {
        value.data.forEach( v => {
          if (this.vehicleDetail.licensePlateColor === v.settingCode) {
            this.licensePlateColorModify = v.settingName;
          }
        });
      }
    );
    this.vehicleSrv.queryVehicleAllType({settingType: 'LICENSE_PLATE_TYPE'}).subscribe(
      value => {
        value.data.forEach( v => {
          if (this.vehicleDetail.licensePlateType === v.settingCode) {
            this.licensePlateTypeModify = v.settingName;
          }
        });
      }
    );
    this.vehicleSrv.queryVehicleAllType({settingType: 'VEHICLE_ORIGINA_TYPE'}).subscribe(
      value => {
        value.data.forEach( v => {
          if (this.vehicleDetail.vehicleOriginalType === v.settingCode) {
            this.vehicleOriginalTypeModify = v.settingName;
          }
        });
      }
    );
    this.vehicleDetailDialog = true;

  }
  // vehicle select
  public  vehicleonRowSelect(e): void {
    this.vehicleModify = e.data;
  }
  // modify vehicle
  public vehicleModifyClick(): void {
    if (this.vehicleSelect === undefined || this.vehicleSelect.length === 0) {
      this.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.vehicleSelect.length === 1) {
      this.vehicleSrv.queryVehicleAllType({settingType: 'LICENSE_PLATE_COLOR'}).subscribe(
        value => {
          value.data.forEach( v => {
            // console.log();
            this.licensePlateColorOption.push({label: v.settingName, value: v.settingCode});
            if (this.vehicleModify.licensePlateColor === v.settingCode) {
              this.licensePlateColorModify = v.settingName;
            }
          });
        }
      );
      this.vehicleSrv.queryVehicleAllType({settingType: 'LICENSE_PLATE_TYPE'}).subscribe(
        value => {
          value.data.forEach( v => {
            // console.log();
            this.licensePlateTypeOption.push({label: v.settingName, value: v.settingCode});
            if (this.vehicleModify.licensePlateType === v.settingCode) {
              this.licensePlateTypeModify = v.settingName;
            }
          });
        }
      );
      this.vehicleSrv.queryVehicleAllType({settingType: 'VEHICLE_ORIGINA_TYPE'}).subscribe(
        value => {
          value.data.forEach( v => {
            // console.log();
            this.vehicleOriginalTypeOption.push({label: v.settingName, value: v.settingCode});
            if (this.vehicleModify.vehicleOriginalType === v.settingCode) {
              this.vehicleOriginalTypeModify = v.settingName;
            }
          });
        }
      );
      this.vehicleModifayDialog = true;
    } else {
      this.setToast('error', '操作错误', '只能选择一项进行修改');
    }
  }

  // sure modify vehicle
  public vehicleModifySureClick(): void {
    this.confirmationService.confirm({
      message: `确认要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.vehicleSrv.updateVehicleInfo(this.vehicleModify).subscribe(
          value => {
            if (value.status === '1000') {
              this.setToast('success', '操作成功', value.message);
              this.vehicleModifayDialog = false;
              this.clearData();
              this.vehicleInitialization();
            }
          }
        );
      },
      reject: () => {

      }
    });
  }

  // delete vehicle
  public vehicleDeleteClick(): void {
    if (this.vehicleSelect === undefined || this.vehicleSelect.length === 0) {
      this.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.confirmationService.confirm({
        message: `确认要删除这${this.vehicleSelect.length}项吗`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.vehicleSelect.forEach( v => {
            this.deleteIds.push(v.id);
          });
          this.vehicleSrv.deleteVehicleInfo({ids: this.deleteIds.join(',')}).subscribe(
            value => {
              if (value.status === '1000' ) {
                this.setToast('success', '操作成功', value.message);
                this.clearData();
                this.vehicleInitialization();
              }
            }
          );
          // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
        },
        reject: () => {
          console.log('这里是删除信息');

          // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
        }
      });
    }
  }

  public setToast(type, title, message): void {
    if (this.cleanTimer) {
      clearTimeout(this.cleanTimer);
    }
    this.messageService.clear();
    this.messageService.add({severity: type, summary: title, detail: message});
    this.cleanTimer = setTimeout(() => {
      this.messageService.clear();
    }, 3000);
  }

  public clearData(): void {
    this.vehicleAdd = new AddVehicle();
    this.vehicleModify = new ModifyVehicle();
    this.licensePlateColorModify = null;
    this.licensePlateTypeModify = null;
    this.licensePlateTypeModify = null;
    this.licensePlateColorOption = [];
    this.licensePlateTypeOption = [];
    this.vehicleOriginalTypeOption = [];
    this.vehicleSelect = [];
  }

  // 分页请求
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
