import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AddParkingspace, ModifyParkingspace, Parkingspace} from '../../../common/model/bf-parkingspace.model';
import {BfParkingSpaceService} from '../../../common/services/bf-parking-space.service';
import {GlobalService} from '../../../common/services/global.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';

@Component({
  selector: 'rbi-bf-parkingspace',
  templateUrl: './bf-parkingspace.component.html',
  styleUrls: ['./bf-parkingspace.component.less']
})
export class BfParkingspaceComponent implements OnInit {
  public parkingspaceSelect: any[];

  public parkingSpaceOption: any;
  // 下拉框列表
  public parkSpaceNatureOption: any[] = [];
  public parkSpaceTypeOption: any[] = [];
  // 添加相关
  public parkingspaceAddDialog: boolean;
  public parkingspaceAdd: AddParkingspace = new AddParkingspace();
  // 修改相关
  public parkingspaceModifayDialog: boolean;
  public parkingspaceModify: ModifyParkingspace = new ModifyParkingspace();

  public parkSpaceTypemodify: any;
  public parkSpaceNaturemodify: any;
  public parkSpaceCode: any;
  // 详情相关
  public parkingSpaceDetailOption: any;
  public parkingspaceDetailDialog: boolean;
  public parkingspaceDetail: Parkingspace = new Parkingspace();

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
  public nowPage = 1;

  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private parkingSpaceSrv: BfParkingSpaceService,
    private toolSrv: PublicMethedService,
    private globalSrv: GlobalService,
  ) {
  }

  ngOnInit() {
    this.parkingspaceInitialization();
  }

  // initialization parkingspace
  public parkingspaceInitialization(): void {
    this.loadHidden = false;
    this.toolSrv.getAdmStatus([{settingType: 'CWLX'}, {settingType: 'CWXZ'}], (data) => {
       console.log(data);
       this.parkSpaceNatureOption = this.toolSrv.setListMap(data.CWXZ);
       this.parkSpaceTypeOption = this.toolSrv.setListMap(data.CWLX);
       console.log(this.parkSpaceTypeOption);
       console.log(this.parkSpaceNatureOption);
    });
    this.queryParkingSpacePageData();
    this.globalSrv.queryVillageInfo({}).subscribe(
      (data) => {
        data.data.forEach(v => {
          this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
          // = v.villageName;
        });
        // this.villageplaceholder =  this.SearchOption.village[0].label;
      }
    );
  }
  public VillageChange(e): void {
    this.loadHidden = false;
    this.SearchOption.region = [];
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.parkingspaceAdd.villageName = e.originalEvent.target.innerText;
    this.parkingspaceModify.villageName = e.originalEvent.target.innerText;
    this.globalSrv.queryRegionInfo({villageCode: e.value}).subscribe(
      (value) => {
        value.data.forEach(v => {
          this.loadHidden = true;
          this.SearchOption.region.push({label: v.regionName, value: v.regionCode});
        });
      }
    );
  }
  // select village
  public regionChange(e): void {
    this.loadHidden = false;
    this.SearchOption.unit = [];
    this.parkingspaceAdd.regionName = e.originalEvent.target.innerText;
    this.parkingspaceModify.regionName = e.originalEvent.target.innerText;
    this.globalSrv.queryBuilingInfo({regionCode: e.value}).subscribe(
      (value) => {
        value.data.forEach(v => {
          this.SearchOption.building.push({label: v.buildingName, value: v.buildingCode});
        });
        this.loadHidden = true;

      }
    );
  }
  // show add parkingspace dialog
  public parkingspaceAddClick(): void {
    this.parkingspaceAddDialog = true;
  }
  // sure add parkingspace
  public parkingspaceAddSureClick(): void {
    // var
    this.parkingspaceAdd.parkingSpaceCode = this.parkingspaceAdd.regionCode + '-' + this.parkSpaceCode;
    // console.log(  this.parkingspaceAdd);
    this.toolSrv.setConfirmation('增加', '增加', () => {
      this.parkingSpaceSrv.addParkingSpace(this.parkingspaceAdd).subscribe(
        value => {
          if (value.status === '1000') {
            this.toolSrv.setToast('success', '操作成功', value.message);
            this.clearData();
            this.parkingspaceAddDialog = false;
            this.parkingspaceInitialization();

          }
        }
      );
    });
  }
   // show  parkingspace detail dialog
  public parkingspaceDetailClick(e): void {
    // this.parkingspaceDetail = e;
    this.parkingSpaceDetailOption = {
      dialog: true,
      tableHidden: false,
      width: '1000',
      type: 1,
      title: '详情',
      poplist: {
        popContent: e,
        popTitle:  [
          {field: 'organizationName', header: '组织名称'},
          {field: 'villageName', header: '小区名称'},
          {field: 'regionName', header: '地块名称'},
          {field: 'parkingSpaceCode', header: '车位编号'},
          {field: 'parkingSpaceArea', header: '车位面积'},
          {field: 'parkingSpaceType', header: '车位类型'},
          {field: 'parkingSpaceNature', header: '车位性质'},
          {field: 'vehicleCapacity', header: '车位容车数量'},
        ],
      }
    };

  }
  // show modify parkingspace dialog
   public parkingspaceModifyClick(): void {
    if (this.parkingspaceSelect === undefined || this.parkingspaceSelect.length === 0) {
     this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.parkingspaceSelect.length === 1) {
      this.parkingspaceModify = this.parkingspaceSelect[0];
      this.parkingspaceModifayDialog = true;
    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行修改');
    }
  }

  // sure modify parkingspace
  public parkingspaceModifySureClick(): void {

    this.toolSrv.setConfirmation('修改', '修改', () => {
      this.parkingSpaceSrv.updateParkingSpace(this.parkingspaceModify).subscribe(
        value => {
          if (value.status === '1000') {
            this.toolSrv.setToast('success', '操作成功', value.message);
            this.parkingspaceModifayDialog = false;
            this.clearData();
            this.parkingspaceInitialization();
          }
        }
      );
    });
  }

  // Delete parking space information
  public parkingspaceDeleteClick(): void {
    if (this.parkingspaceSelect === undefined || this.parkingspaceSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.toolSrv.setConfirmation('删除', `删除这${this.parkingspaceSelect.length}项`, () => {
        this.parkingspaceSelect.forEach( v => {
          this.deleteIds.push(v.id);
        });
        this.parkingSpaceSrv.daleteParkingSpace({ids: this.deleteIds.join(',')}).subscribe(
          value => {
            if (value.status === '1000' ) {
              this.toolSrv.setToast('success', '操作成功', value.message);
              this.clearData();
              this.parkingspaceInitialization();
            }
          }
        );
      });
    }
  }
  // Reset data
  public clearData(): void {
    this.parkingspaceAdd = new AddParkingspace();
    this.parkingspaceModify = new ModifyParkingspace();
    this.parkSpaceNatureOption = [];
    this.parkSpaceTypeOption = [];
    this.parkingspaceSelect = [];
    this.parkSpaceTypemodify = null;
    this.parkSpaceNaturemodify = null;
    for (const searchOptionKey in this.SearchOption) {
         if (searchOptionKey !== 'village') {
           this.SearchOption[searchOptionKey] = [];
         }
    }
  }
  // paging query
  public nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.queryParkingSpacePageData();
    this.parkingspaceSelect = [];
  }
  public  queryParkingSpacePageData(): void {
    this.parkingSpaceSrv.queryParkingSpace({pageNo: this.nowPage, pageSize: 10}).subscribe(
      value => {
        console.log(value);
        this.loadHidden = true;
        value.data.contents.forEach( v => {
          v.parkingSpaceNature = this.toolSrv.setValueToLabel(this.parkSpaceNatureOption, v.parkingSpaceNature);
          v.parkingSpaceType = this.toolSrv.setValueToLabel(this.parkSpaceTypeOption, v.parkingSpaceType);
        });
        // this.parkingspaceTableContent = value.data.contents;
        this.setTableOption(value.data.contents);
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
  }

  // select data
  public selectData(e): void {
    this.parkingspaceSelect = e;
  }
  // 设置表格
  public  setTableOption(data1): void {
    this.parkingSpaceOption = {
      width: '101.4%',
      header: {
        data: [
          {field: 'villageName', header: '小区名称'},
          {field: 'regionName', header: '地块名称'},
          {field: 'parkingSpaceCode', header: '车位编号'},
          {field: 'parkingSpaceArea', header: '车位面积'},
          {field: 'vehicleCapacity', header: '车位容车数量'},
          {field: 'operating', header: '操作'},
        ],
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
}
