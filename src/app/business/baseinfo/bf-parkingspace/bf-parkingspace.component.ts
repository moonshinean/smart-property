import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AddParkingspace, ModifyParkingspace, Parkingspace} from '../../../common/model/bf-parkingspace.model';
import {BfParkingSpaceService} from '../../../common/services/bf-parking-space.service';
import {GlobalService} from '../../../common/services/global.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {Subscription} from 'rxjs';
import {ThemeService} from '../../../common/public/theme.service';
import {SharedServiceService} from '../../../common/public/shared-service.service';
import {FileOption} from '../../../common/components/basic-dialog/basic-dialog.model';
import {LocalStorageService} from '../../../common/services/local-storage.service';

@Component({
  selector: 'rbi-bf-parkingspace',
  templateUrl: './bf-parkingspace.component.html',
  styleUrls: ['./bf-parkingspace.component.less']
})
export class BfParkingspaceComponent implements OnInit, OnDestroy {

  public parkingSpaceContent: any;
  public parkingspaceSelect: any[];

  public parkingSpaceOption: any;
  // 下拉框列表
  public parkSpaceNatureOption: any[] = [];
  public parkSpaceTypeOption: any[] = [];
  public parkSpacePlaceOption: any[] = [];
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
  // 查询相关
  public searchparkSpaceData = {
    pageSize: 10,
    pageNo: 1,
    code: '',
    level: '',
    type: '',
  };
  public searchData = '';
  public SearchData = {
    villageCode: '',
    regionCode: '',
    buildingCode: '',
  };
  public deleteIds: any[] = [];
  public option: any;
  public keyparkingSpaceList = [false, false, false, false, false];
  // 按钮显示相关
  public btnHiden = [
    {label: '新增', hidden: true},
    {label: '修改', hidden: true},
    {label: '删除', hidden: true},
    {label: '导入', hidden: true},
    {label: '搜索', hidden: true},
  ];
  // 文件上传相关
  public UploadFileOption: FileOption = new FileOption();
  public uploadRecordOption: any;
  // 其他相关
  public nowPage = 1;
  public themeSub: Subscription;
  public table = {
    tableheader: {background: '', color: ''},
    tableContent: [
      {background: '', color: ''},
      {background: '', color: ''}],
    detailBtn: ''
  };
  public parkspaceSub: Subscription;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private parkingSpaceSrv: BfParkingSpaceService,
    private toolSrv: PublicMethedService,
    private globalSrv: GlobalService,
    private localSrv: LocalStorageService,
    private themeSrv: ThemeService,
    private sharedSrv: SharedServiceService,
  ) {
    this.themeSub = this.themeSrv.changeEmitted$.subscribe(
      value => {
        this.table.tableheader = value.table.header;
        this.table.tableContent = value.table.content;
        this.table.detailBtn = value.table.detailBtn;
        this.setTableOption(this.parkingSpaceContent);
      }
    );
    this.parkspaceSub = this.sharedSrv.changeEmitted$.subscribe(
      value => {
        this.SearchData.villageCode = value.villageCode;
        this.SearchData.regionCode = value.regionCode;
        this.SearchData.buildingCode = value.buildingCode;
        this.searchparkSpaceData.code = value.data.code;
        this.searchparkSpaceData.level = value.data.level;
        this.searchparkSpaceData.type = value.data.type;
        this.queryParkingSpacePageData();
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
      this.SearchData.buildingCode = this.sharedSrv.SearchData.buildingCode;
      this.SearchData.regionCode = this.sharedSrv.SearchData.regionCode;
      this.SearchData.villageCode = this.sharedSrv.SearchData.villageCode;
      this.searchparkSpaceData.code = this.sharedSrv.SearchData.data.code;
      this.searchparkSpaceData.level = this.sharedSrv.SearchData.data.level;
      this.searchparkSpaceData.type = this.sharedSrv.SearchData.data.type;
    }
    this.parkingspaceInitialization();
  }
  ngOnDestroy(): void {
    this.themeSub.unsubscribe();
    this.parkspaceSub.unsubscribe();
  }
  // initialization parkingspace
  public parkingspaceInitialization(): void {
    this.toolSrv.getAdmStatus([{settingType: 'CWLX'}, {settingType: 'CWXZ'}, {settingType: 'PAEKING_SPACE_PLACE'}], (data) => {
       this.parkSpaceNatureOption = this.toolSrv.setListMap(data.CWXZ);
       this.parkSpaceTypeOption = this.toolSrv.setListMap(data.CWLX);
       this.parkSpacePlaceOption = this.toolSrv.setListMap(data.PAEKING_SPACE_PLACE);
    });
    this.queryParkingSpacePageData();
  }
  // show add parkingspace dialog
  public parkingspaceAddClick(): void {
   if (this.SearchData.regionCode !== '') {
     this.parkingspaceAddDialog = true;
   } else {
     this.toolSrv.setToast('error', '操作错误', '请选择地块或者楼栋');
   }
  }
  // 验证
  public  changeInput(data, index): void {
    this.keyparkingSpaceList[index] = data === undefined || data === null || data === '';
  }
  // sure add parkingspace
  public parkingspaceAddSureClick(): void {
    this.parkingspaceAdd.villageCode = this.SearchData.villageCode;
    this.parkingspaceAdd.regionCode = this.SearchData.regionCode;
    this.parkingspaceAdd.buildingCode = this.SearchData.buildingCode;
    const ownerVertifyKeylist = ['parkingSpaceCode', 'parkingSpacePlace', 'parkingSpaceType', 'parkingSpaceNature', 'vehicleCapacity'];
    ownerVertifyKeylist.forEach((v, index) => {
      this.keyparkingSpaceList[index] = this.parkingspaceAdd[v] === '' || this.parkingspaceAdd[v] === undefined || this.parkingspaceAdd[v] === null;
    });
    const ownerInfoStatus  = ownerVertifyKeylist.every( v => {
      return (this.parkingspaceAdd[v] !== '' && this.parkingspaceAdd[v] !== undefined && this.parkingspaceAdd[v] !== null);
    });
    if (ownerInfoStatus) {
      this.toolSrv.setConfirmation('增加', '增加', () => {
        this.parkingSpaceSrv.addParkingSpace(this.parkingspaceAdd).subscribe(
          value => {
            if (value.status === '1000') {
              this.toolSrv.setToast('success', '操作成功', value.message);
              this.clearData();
              this.parkingspaceAddDialog = false;
              this.parkingspaceInitialization();
            } else  {
              this.toolSrv.setToast('error', '操作失败', value.message);
            }
          }
        );
      });
    } else {
      this.toolSrv.setToast('error', '添加失败', '带*的信息未填写完整');
    }

  }
   // show  parkingspace detail dialog
  public parkingspaceDetailClick(e): void {
    // this.parkingspaceDetail = e;
    e.parkingSpaceNature = this.toolSrv.setValueToLabel(this.parkSpaceNatureOption, e.parkingSpaceNature.toString());
    e.parkingSpaceType = this.toolSrv.setValueToLabel(this.parkSpaceTypeOption, e.parkingSpaceType.toString());
    e.parkingSpacePlace = this.toolSrv.setValueToLabel(this.parkSpacePlaceOption, e.parkingSpacePlace.toString());
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
          {field: 'floor', header: '车位楼层'},
          {field: 'parkingSpacePlace', header: '车位地点'},
          {field: 'parkingSpaceNature', header: '车位性质'},
          {field: 'vehicleCapacity', header: '车位容车数量'},
          {field: 'currentCapacity', header: '车位当前容车数量'},
        ],
      }
    };

  }
  // show modify parkingspace dialog
   public parkingspaceModifyClick(): void {
    if (this.parkingspaceSelect === undefined || this.parkingspaceSelect.length === 0) {
     this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.parkingspaceSelect.length === 1) {
      this.parkingspaceSelect[0].parkingSpaceNature = this.toolSrv.setLabelToValue(this.parkSpaceNatureOption,  this.parkingspaceSelect[0].parkingSpaceNature);
      this.parkingspaceSelect[0].parkingSpaceType = this.toolSrv.setLabelToValue(this.parkSpaceTypeOption,  this.parkingspaceSelect[0].parkingSpaceType);
      for (const inkey in this.parkingspaceSelect[0]) {
        this.parkingspaceModify[inkey] = this.parkingspaceSelect[0][inkey];
      }
      this.parkingspaceModify.parkingSpacePlace = this.parkingspaceModify.parkingSpacePlace.toString();
      this.parkingspaceModifayDialog = true;
    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行修改');
    }
  }

  // sure modify parkingspace
  public parkingspaceModifySureClick(): void {
    const ownerVertifyKeylist = ['parkingSpaceCode', 'parkingSpacePlace', 'parkingSpaceType', 'parkingSpaceNature', 'vehicleCapacity'];
    ownerVertifyKeylist.forEach((v, index) => {
      this.keyparkingSpaceList[index] = this.parkingspaceModify[v] === '' || this.parkingspaceModify[v] === undefined || this.parkingspaceModify[v] === null;
    });
    const ownerInfoStatus  = ownerVertifyKeylist.every( v => {
      return (this.parkingspaceModify[v] !== '' && this.parkingspaceModify[v] !== undefined && this.parkingspaceModify[v] !== null);
    });
    if (ownerInfoStatus) {
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
    } else {
      this.toolSrv.setToast('error', '修改失败', '带*的信息未填写完整');
    }

  }

  // 搜索
  public  parkingspaceSearchClick(): void {
      this.nowPage = 1;
      if (this.searchData !== '') {
         this.searchParkingSpacePageData();
      } else {
        this.searchparkSpaceData.pageNo =  this.nowPage;
        this.queryParkingSpacePageData();
      }
  }

  // Delete parking space information
  public parkingspaceDeleteClick(): void {
    if (this.parkingspaceSelect === undefined || this.parkingspaceSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.toolSrv.setConfirmation('删除', `删除这${this.parkingspaceSelect.length}项`, () => {
        this.parkingspaceSelect.forEach( v => {
          this.deleteIds.push(v.parkingSpaceInfoId);
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
    this.parkingspaceSelect = [];
    this.parkSpaceTypemodify = null;
    this.parkSpaceNaturemodify = null;
    this.keyparkingSpaceList = [false, false, false, false, false];
  }
  // paging query
  public nowpageEventHandle(event: any): void {
    this.searchparkSpaceData.pageNo =  this.nowPage = event;
    if (this.searchData !== '') {
      this.searchParkingSpacePageData();
    } else {
      this.searchparkSpaceData.pageNo =  this.nowPage;
      this.queryParkingSpacePageData();
    }
    this.parkingspaceSelect = [];
  }
  // 分页查询
  public  queryParkingSpacePageData(): void {
    this.parkingSpaceSrv.queryParkingSpace(this.searchparkSpaceData).subscribe(
      value => {
        if (value.status === '1000') {
          this.parkingSpaceContent = value.data.contents;
          this.setTableOption(value.data.contents);
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        } else  {
          this.toolSrv.setToast('error', '请求错误', value.message);
        }

      }
    );
  }
  // 条件查询
  public  searchParkingSpacePageData(): void {
    this.parkingSpaceSrv.queryParkingSpaceByCode({parkingSpaceCode: this.searchData, pageNo: this.nowPage, pageSize: 10}).subscribe(
      value => {
        if (value.status === '1000') {
          this.parkingSpaceContent = value.data.contents;
          this.setTableOption(value.data.contents);
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        } else  {
          this.toolSrv.setToast('error', '请求错误', value.message);
        }

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
      width: '100%',
      header: {
        data: [
          {field: 'villageName', header: '小区名称'},
          {field: 'regionName', header: '地块名称'},
          {field: 'buildingName', header: '楼栋名称'},
          {field: 'parkingSpaceCode', header: '车位编号'},
          {field: 'parkingSpaceArea', header: '车位面积'},
          {field: 'vehicleCapacity', header: '车位容车数量'},
          {field: 'operating', header: '操作'},
        ],
        style: {background: this.table.tableheader.background, color: this.table.tableheader.color, height: '6vh'}
      },
      Content: {
        data: data1,
        styleone: {background: this.table.tableContent[0].background, color: this.table.tableContent[0].color, textAlign: 'center', height: '2vw'},
        styletwo: {background: this.table.tableContent[1].background, color: this.table.tableContent[1].color, textAlign: 'center', height: '2vw'},
      },
      type: 2,
      tableList:  [{label: '详情', color: this.table.detailBtn}]
    };
  }

  // 上传文件
  public  ownerUploadSureClick(e): void {
    if (e.getAll('file').length !== 0) {
      this.parkingSpaceSrv.importFileWithParkSpace(e).subscribe(
        (value) => {
          if (value.status === '1000') {
            // this.uploadedFiles = [];
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
                    {field: 'parkingSpaceCodes', header: '车位编号'},
                    {field: 'result', header: '结果'},
                    {field: 'remarks', header: '备注'},
                  ],
                  style: { background: '#F4F4F4', color: '#000', height: '6vh'}
                },
                tableContent: {
                  data: value.data.logParkingSpaceInfoDOS,
                  styleone: { background: '#FFFFFF', color: '#000', height: '2vw', textAlign: 'center'},
                  styletwo: { background: '#FFFFFF', color: '#000', height: '2vw', textAlign: 'center'}
                }
              }
            };
            // this.ownerInfoDialog = true;
            this.toolSrv.setToast('success', '上传成功', value.message);
            // this.ownerInitialization();
          } else {
            console.log(123);
            this.toolSrv.setToast('error', '上传失败', value.message);
          }
        }
      );
    } else {
      this.toolSrv.setToast('error', '操作失败', '请选择需要上传的文件');
    }
  }

  public  parkingSpaceFileImportClick(): void {
    this.UploadFileOption.width = '800';
    this.UploadFileOption.dialog = true;
    this.UploadFileOption.files = [];
  }

  // 设置按钮显示隐藏
  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '车位信息') {
        this.globalSrv.getChildrenRouter({parentCode: v.parentCode}).subscribe(value => {
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
}
