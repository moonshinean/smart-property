import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AddParkingspace, ModifyParkingspace, Parkingspace} from '../../../common/model/bf-parkingspace.model';
import {BfParkingSpaceService} from '../../../common/services/bf-parking-space.service';
import {GlobalService} from '../../../common/services/global.service';

@Component({
  selector: 'rbi-bf-parkingspace',
  templateUrl: './bf-parkingspace.component.html',
  styleUrls: ['./bf-parkingspace.component.less']
})
export class BfParkingspaceComponent implements OnInit {

  @ViewChild('input') input: Input;
  public parkingspaceTableTitle: any;
  public parkingspaceTableContent: any[];
  public parkingspaceTableTitleStyle: any;
  public parkingspaceSelect: any[];
  // 添加相关
  public parkingspaceAddDialog: boolean;
  public parkingspaceAdd: AddParkingspace = new AddParkingspace();
  // 修改相关
  public parkingspaceModifayDialog: boolean;
  public parkingspaceModify: ModifyParkingspace = new ModifyParkingspace();
  public parkSpaceNatureOption: any[] = [];
  public parkSpaceTypeOption: any[] = [];
  public parkSpaceTypemodify: any;
  public parkSpaceNaturemodify: any;
  // 详情相关
  public parkingspaceDetailDialog: boolean;
  public parkingspaceDetail: Parkingspace = new Parkingspace();

  // public msgs: Message[] = []; // 消息弹窗
  public SearchOption = {
    village: [],
    region: [],
    building: [],
    unit: []
  };
  public deleteIds: any[] = [];
  public moreTollMoreTitle = [
    {field: 'parkigCode', header: '车位编号'},
    {field: 'parkigNature', header: '车位性质'},
    {field: 'parkigCharge', header: '车位收费标准'},
    {field: 'parkigUseTime', header: '租用车位时间'},
    {field: 'parkigAmount', header: '金额'},
    {field: 'parkigNumberPlate', header: '车牌号'},
    {field: 'operating', header: '操作'},
  ]; // 数据
  public option: any;
  public loadHidden = true;
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public nowPage = 1;

  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private parkingSpaceSrv: BfParkingSpaceService,
    private globalSrv: GlobalService,
  ) {
  }

  ngOnInit() {
    this.parkingspaceInitialization();
  }

  // initialization parkingspace
  public parkingspaceInitialization(): void {
    console.log('这里是信息的初始化');
    this.parkingspaceTableTitle = [
      {field: 'villageName', header: '小区名称'},
      {field: 'regionName', header: '地块名称'},
      {field: 'parkingSpaceCode', header: '车位编号'},
      {field: 'parkingSpaceArea', header: '车位面积'},
      {field: 'vehicleCapacity', header: '车位容车数量'},
      {field: 'operating', header: '操作'},
    ];
    this.loadHidden = false;
    this.parkingSpaceSrv.queryParkingSpace({pageNo: this.nowPage, pageSize: 10}).subscribe(
      value => {
        this.loadHidden = true;
        console.log(value);
        this.parkingspaceTableContent = value.data.contents;
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
    this.parkingspaceTableTitleStyle = {background: '#282A31', color: '#DEDEDE', height: '6vh'};
    console.log(this.parkingspaceSelect);

  }

  public VillageChange(e): void {
    // console.log(this.test);
    this.loadHidden = false;
    this.SearchOption.region = [];
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.parkingspaceAdd.villageName = e.originalEvent.target.innerText;
    this.parkingspaceModify.villageName = e.originalEvent.target.innerText;
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
    this.parkingspaceAdd.regionName = e.originalEvent.target.innerText;
    this.parkingspaceModify.regionName = e.originalEvent.target.innerText;
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
    // this.ownerAdd.buildingName = e.originalEvent.target.innerText;
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
  }
  // condition search click
  public parkingspaceSearchClick(): void {
    // @ts-ignore
    console.log(this.input.nativeElement.value);
    console.log('这里是条件搜索');
  }
  // add parkingspace
  public parkingspaceAddClick(): void {
    this.parkingSpaceSrv.queryParkSpaceNatureStatus({settingType: 'CWXZ'}).subscribe(
      value => {
        this.parkSpaceNatureOption = [];
        value.data.forEach(v => {
          this.parkSpaceNatureOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    );
    this.parkingSpaceSrv.queryParkSpaceNatureStatus({settingType: 'CWLX'}).subscribe(
      value => {
        this.parkSpaceTypeOption = [];
        value.data.forEach(v => {
          this.parkSpaceTypeOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    );
    this.parkingspaceAddDialog = true;
  }
  // sure add parkingspace
  public parkingspaceAddSureClick(): void {
    this.confirmationService.confirm({
      message: `确认要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(this.parkingspaceAdd);
        this.parkingSpaceSrv.addParkingSpace(this.parkingspaceAdd).subscribe(
          value => {
            if (value.status === '1000') {
              this.setToast('success', '操作成功', value.message);
              this.clearData();
              this.parkingspaceAddDialog = false;
              this.parkingspaceInitialization();

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
   //  parkingspace detail
  public parkingspaceDetailClick(e): void {
    this.parkingspaceDetail = e;
    this.parkingSpaceSrv.queryParkSpaceNatureStatus({settingType: 'CWXZ'}).subscribe(
      value => {
        value.data.forEach(v => {
          if (this.parkingspaceDetail.parkingSpaceNature === v.settingCode) {
            this.parkSpaceNaturemodify = v.settingName;
          }
        });
      }
    );
    this.parkingSpaceSrv.queryParkSpaceNatureStatus({settingType: 'CWLX'}).subscribe(
      value => {
        value.data.forEach(v => {
          if (this.parkingspaceDetail.parkingSpaceType === v.settingCode) {
            this.parkSpaceTypemodify = v.settingName;
          }
        });
      }
    );
    this.parkingspaceDetailDialog = true;

  }
  public  parkingspaceonRowSelect(e): void {
    console.log(e.data);
    this.parkingspaceModify = e.data;
  }
  // modify parkingspace
  public parkingspaceModifyClick(): void {
    console.log(this.parkingspaceSelect);
    if (this.parkingspaceSelect === undefined || this.parkingspaceSelect.length === 0) {
     this.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.parkingspaceSelect.length === 1) {

      this.parkingSpaceSrv.queryParkSpaceNatureStatus({settingType: 'CWXZ'}).subscribe(
        value => {
          console.log(value);
          this.parkSpaceTypeOption = [];
          value.data.forEach(v => {
            this.parkSpaceNatureOption.push({label: v.settingName, value: v.settingCode});
            if (this.parkingspaceModify.parkingSpaceNature === v.settingCode) {
                this.parkSpaceNaturemodify = v.settingName;
            }
          });
        }
      );
      this.parkingSpaceSrv.queryParkSpaceNatureStatus({settingType: 'CWLX'}).subscribe(
        value => {
          console.log(value);
          this.parkSpaceTypeOption = [];
          value.data.forEach(v => {
            this.parkSpaceTypeOption.push({label: v.settingName, value: v.settingCode});
            if (this.parkingspaceModify.parkingSpaceType === v.settingCode) {
              console.log(234);
              this.parkSpaceTypemodify = v.settingName;
            }
          });
        }
      );
      this.parkingspaceModifayDialog = true;

      console.log('这里是修改信息');
    } else {
      this.setToast('error', '操作错误', '只能选择一项进行修改');
    }
  }

  // sure modify parkingspace
  public parkingspaceModifySureClick(): void {
    this.confirmationService.confirm({
      message: `确认要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.parkingSpaceSrv.updateParkingSpace(this.parkingspaceModify).subscribe(
          value => {
            if (value.status === '1000') {
              this.setToast('success', '操作成功', value.message);
              this.parkingspaceModifayDialog = false;
              this.clearData();
              this.parkingspaceInitialization();
            }
          }
        );
      },
      reject: () => {
        console.log('这里是修改信息');

      }
    });
  }

  // delete parkingspace
  public parkingspaceDeleteClick(): void {
    if (this.parkingspaceSelect === undefined || this.parkingspaceSelect.length === 0) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.messageService.clear();
      this.messageService.add({severity: 'error', summary: '操作错误', detail: '请选择需要删除的项'});
      this.cleanTimer = setTimeout(() => {
        this.messageService.clear();
      }, 3000);
    } else {
      this.confirmationService.confirm({
        message: `确认要删除这${this.parkingspaceSelect.length}项吗`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          console.log(this.parkingspaceSelect);
          this.parkingspaceSelect.forEach( v => {
            this.deleteIds.push(v.id);
          });
          this.parkingSpaceSrv.daleteParkingSpace({ids: this.deleteIds.join(',')}).subscribe(
            value => {
              if (value.status === '1000' ) {
                this.setToast('success', '操作成功', value.message);
                this.clearData();
                this.parkingspaceInitialization();
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
    this.parkingspaceAdd = new AddParkingspace();
    this.parkingspaceModify = new ModifyParkingspace();
    this.parkSpaceNatureOption = [];
    this.parkSpaceTypeOption = [];
    this.parkingspaceSelect = [];
    this.parkSpaceTypemodify = null;
    this.parkSpaceNaturemodify = null;
    this.SearchOption = {village: [], region: [], building: [], unit: []};
  }

  // 分页请求
  public nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.parkingSpaceSrv.queryParkingSpace({pageNo: this.nowPage, pageSize: 10}).subscribe(
      value => {
        this.loadHidden = true;
        this.parkingspaceTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
  }
}
