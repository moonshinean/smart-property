
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {BfVehicleService} from '../../../common/services/bf-vehicle.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AddVehicle, ModifyVehicle, Vehicle} from '../../../common/model/bf-vehicle.model';
import {GlobalService} from '../../../common/services/global.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {DialogModel, FormValue} from '../../../common/components/basic-dialog/dialog.model';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'rbi-bf-vehicle',
  templateUrl: './bf-vehicle.component.html',
  styleUrls: ['./bf-vehicle.component.less']
})
export class BfVehicleComponent implements OnInit {
  public vehicleTableTitle: any;
  public vehicleTableTitleStyle: any;
  public vehicleSelect: any[] = [];
  public tableOption: any;
  public detailOption: any;

  public optionDialog: DialogModel = new DialogModel();
  public form: FormValue[] = [];
  public formgroup: FormGroup;
  public formdata: any[];
  public roomtree: any;

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
    this.queryVehicleQuerydata(1);
    this.globalSrv.queryVillageInfo({}).subscribe(
      (data) => {
        data.data.forEach(v => {
          this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
          // = v.villageName;
        });
      }
    );
    this.globalSrv.queryTVillageTree().subscribe(
      value => {
        console.log(value);
        if (value.status === '1000') {
          this.roomtree = value.data;
        }
      }
    );
    this.getCarInfo();
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
    this.optionDialog = {
      type: 'add',
      title: '添加信息',
      width: '800',
      dialog: true
    };
    const list = ['villageCode', 'villageName', 'regionCode', 'regionName', 'buildingCode', 'buildingName', 'unitCode', 'unitName',
      'roomCode', 'licensePlateNumber', 'licensePlateColor', 'licensePlateType', 'vehicleOriginalType'];
    list.forEach(val => {
      this.form.push({key: val, disabled: false, required: true, value: ''});
    });
    this.formgroup = this.toolSrv.setFormGroup(this.form);
    this.formdata = [
      {label: '房间号', type: 'tree', name: 'roomCode', option: '', placeholder: '请选择房间'},
      {label: '车牌号', type: 'input', name: 'licensePlateNumber', option: '', placeholder: '请选择房间'},
      {label: '车牌颜色', type: 'dropdown', name: 'licensePlateColor', option: this.licensePlateColorOption, placeholder: '请选择车牌颜色'},
      {label: '车牌类型', type: 'dropdown', name: 'licensePlateType', option: this.licensePlateTypeOption, placeholder: '请选择车牌类型'},
      {label: '原始车辆类型', type: 'dropdown', name: 'vehicleOriginalType', option: this.vehicleOriginalTypeOption, placeholder: '请选择原始车辆类型'},
    ];
  }
  // sure add vehicle
  public vehicleAddSureClick(data): void {
    this.toolSrv.setConfirmation('增加', '增加', () => {
      this.vehicleSrv.addVehicleInfo(data).subscribe(
        value => {
          if (value.status === '1000') {
            this.toolSrv.setToast('success', '操作成功', value.message);
            this.clearData();
            this.optionDialog.dialog = false;
            this.vehicleInitialization();
          }
        }
      );
    });
  }
  //  show vehicle detail dialog
  public vehicleDetailClick(e): void {
    e.licensePlateColor = this.setDataName(this.licensePlateColorOption, e.licensePlateColor);
    e.licensePlateType = this.setDataName(this.licensePlateTypeOption, e.licensePlateType);
    e.vehicleOriginalType = this.setDataName(this.vehicleOriginalTypeOption, e.vehicleOriginalType);
    this.detailOption = {
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
          {field: 'licensePlateNumber', header: '车牌号'},
          {field: 'licensePlateType', header: '车牌类型'},
          {field: 'licensePlateColor', header: '车牌颜色'},
          {field: 'vehicleOriginalType', header: '原始车辆类型'},
        ],
      }
    };
  }
  // Show modify vehicle dialog
  public vehicleModifyClick(): void {
    if (this.vehicleSelect === undefined || this.vehicleSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.vehicleSelect.length === 1) {
      this.vehicleModify = this.vehicleSelect[0];
      this.optionDialog = {
        type: 'add',
        title: '修改信息',
        width: '800',
        dialog: true
      };
      const list = ['villageCode', 'villageName', 'regionCode', 'regionName', 'buildingCode', 'buildingName', 'unitCode', 'unitName',
        'roomCode', 'licensePlateNumber', 'licensePlateColor', 'licensePlateType', 'vehicleOriginalType'];
      list.forEach(val => {
        this.form.push({key: val, disabled: false, required: true, value: this.vehicleSelect[0][val]});
      });
      this.formgroup = this.toolSrv.setFormGroup(this.form);
      this.formdata = [
        {label: '房间号', type: 'tree', name: 'roomCode', option: '', placeholder: '请选择房间'},
        {label: '车牌号', type: 'input', name: 'licensePlateNumber', option: '', placeholder: '请选择房间'},
        {label: '车牌颜色', type: 'dropdown', name: 'licensePlateColor', option: this.licensePlateColorOption, placeholder: '请选择车牌颜色'},
        {label: '车牌类型', type: 'dropdown', name: 'licensePlateType', option: this.licensePlateTypeOption, placeholder: '请选择车牌类型'},
        {label: '原始车辆类型', type: 'dropdown', name: 'vehicleOriginalType', option: this.vehicleOriginalTypeOption, placeholder: '请选择原始车辆类型'},
      ];
    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行修改');
    }
  }
  // sure modify vehicle
  public vehicleModifySureClick(data): void {
    this.toolSrv.setConfirmation('修改', '修改' , () => {
      this.vehicleSrv.updateVehicleInfo(data).subscribe(
        value => {
          console.log(value);
          if (value.status === '1000') {
            this.toolSrv.setToast('success', '操作成功', value.message);
            this.optionDialog.dialog = false;
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
  public  getCarInfo(): void {
    this.toolSrv.getNativeStatus('LICENSE_PLATE_COLOR', (data) => {
      if (data.length > 0) {
         data.forEach( v => {
           this.licensePlateColorOption.push({label: v.settingName, value: v.settingCode});
         });
      }
      this.toolSrv.getNativeStatus('LICENSE_PLATE_TYPE', (val) => {
          if (val.length > 0) {
            val.forEach( v => {
              this.licensePlateTypeOption.push({label: v.settingName, value: v.settingCode});
            });
            this.toolSrv.getNativeStatus('VEHICLE_ORIGINA_TYPE', (value) => {
              if (value.length > 0) {
                value.forEach( v => {
                  this.vehicleOriginalTypeOption.push({label: v.settingName, value: v.settingCode});
                });
              }
            });
          }
        });
    });
  }
  // paging query
  public nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.queryVehicleQuerydata(event);
  }

  // select data (选择数据)
  public  selectData(e): void {
      this.vehicleSelect = e;
  }
  // set table data （设置列表数据）
  public  setTableOption(data1): void {
    this.tableOption = {
      width: '101.4%',
      header: {
        data:  this.vehicleTableTitle,
        style: {background: '#282A31', color: '#DEDEDE', height: '6vh'}
      },
      Content: {
        data: data1,
        styleone: {background: '#33353C', color: '#DEDEDE', textAlign: 'center', height: '2vw'},
        styletwo: {background: '#2E3037', color: '#DEDEDE', textAlign: 'center', height: '2vw'},
      },
      type: 2,
      tableList:  [{label: '详情', color: '#6A72A1'}]
    };
  }
  // query Data (查询数据)
  public  queryVehicleQuerydata(page): void {
    this.vehicleSrv.queryVehicleInfoPage({pageNo: page, pageSize: 10}).subscribe(
      value => {
        this.toolSrv.setQuestJudgment(value.status, value.message,
          () => {
          console.log(value);
          this.loadHidden = true;
          this.setTableOption(value.data.contents);
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        });
      }
    );
  }

  // Convert status values to Chinese names  （状态值转换为中文名）
  public setDataName(list, label): any {
    list.forEach( v => {
      if ( label === v.value ) {
        label = v.label;
      }
    });
    return label;
  }
  // Chinese name converted to status value （中文名转换为状态值）
  public setDataValue(list, label): any {
    list.forEach( v => {
      if ( label === v.label) {
        label = v.value;
      }
    });
    return label;
  }

  // Popup event （弹窗事件）
  public  eventClick(e): void {
    console.log(e);
    if (e === 'false') {  // 取消关闭弹窗
      this.optionDialog.dialog = false;
      this.vehicleSelect = [];
    } else {  // 确认 提交数据
      if (e.invalid) { // 判断必填信息是否填满
        if (e.type === '添加信息') {
          for (const key in e.value.value) {
            this.vehicleAdd[key] = e.value.value[key];
          }
          // console.log(this.couponAdd);
          this.vehicleAddSureClick(this.vehicleAdd);
        } else {
          for (const key in e.value.value) {
            this.vehicleModify[key] = e.value.value[key];
          }
          this.vehicleModifySureClick(this.vehicleModify);
        }
      } else {
        this.toolSrv.setToast('error', '操作错误', '请填写完整信息');
      }
      // if ()
    }
  }
}
