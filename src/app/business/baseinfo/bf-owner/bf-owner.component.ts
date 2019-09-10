import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {BfOwnerService} from '../../../common/services/bf-owner.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AddOwner, ModifyOwner, OwerList, Owner, RoomTitle, SearchOwner} from '../../../common/model/bf-owner.model';
import {C} from '@angular/cdk/typings/esm5/keycodes';
import {GlobalService} from '../../../common/services/global.service';
import {DatePipe} from '@angular/common';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {FileOption} from '../../../common/components/basic-dialog/basic-dialog.model';

@Component({
  selector: 'rbi-bf-owner',
  templateUrl: './bf-owner.component.html',
  styleUrls: ['./bf-owner.component.less']
})
export class BfOwnerComponent implements OnInit {

  public ownerTableTitle: any;
  public ownerTableContent: Owner[];
  public ownerTableTitleStyle: any;
  public ownerSelect: any;
  // 上传文件相关
  public UploadFileOption: FileOption = new FileOption();
  public uploadRecordOption: any;
  // 查询相关
  public searchOwerData: SearchOwner = new SearchOwner();
  public SearchOption = {village: [], region: [], building: [], unit: []};
  // 添加相关
  public ownerAddDialog: boolean;
  public ownerAdd: AddOwner = new AddOwner();
  // public ownerAdd: AddOwner = new AddOwner();
  public roomTitle: RoomTitle = new RoomTitle();
  public ownerList: OwerList[] = [];
  public timeHide = true;
  public ownerTimeDetailHide = true;

  public roomTypeOption: any[] = [];
  public villageOption: any[] = [];
  public roomStatusOption: any[] = [];
  public renovationStatusOption: any[] = [];
  public sexOption: any[] = [];
  public owerMoreTitleDetail = [
    {field: 'surname', header: '客户姓氏'},
    {field: 'sex', header: '性别'},
    {field: 'mobilePhone', header: '客户电话'},
    {field: 'identity', header: '身份'},
    {field: 'normalPaymentStatus', header: '是否正常缴费'},
    {field: 'startBillingTime', header: '物业费开始既费时间'},
    {field: 'remarks', header: '备注'},
    {field: 'operating', header: '操作'},
  ];
  public owerMoreDetailTitleDetail = [
    {field: 'surname', header: '客户姓氏'},
    {field: 'sex', header: '性别'},
    {field: 'mobilePhone', header: '客户电话'},
    {field: 'identity', header: '身份'},
    {field: 'normalPaymentStatus', header: '是否正常缴费'},
    {field: 'startBillingTime', header: '物业费开始既费时间'},
    {field: 'remarks', header: '备注'},
  ];
  // 业主信息相关
  public ownerinfo: OwerList = new OwerList();
  public ownerDialog: boolean;
  public ownerUserSelect: any;
  public normalChargeOption: any[] = [];
  public identityOption: any[] = [];
  // 修改相关
  public ownerModifayDialog: boolean;
  public ownerModify: ModifyOwner[]  = [];
  public ownerDetailDialog: boolean;
  public roomTypeName: any;
  public roomStatusName: any;
  public renovationStatusName: any;
  public renovationName: any;
  public sexName: any;
  // 业主修改相关
  public ownerModifyDialog: any;
  public ownerListIndex: any;
  // 上传相关
  public ownerInfoDialog: any;
  public uploadOption: any;
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  public esDate: any;
  public loadHidden = true;
  public deleteId: any[] = [];
  public mobileNumber = '';
  public nowPage = 1;
  constructor(
    private owerSrv: BfOwnerService,
    private globalSrv: GlobalService,
    private confirmationService: ConfirmationService,
    private toolSrv: PublicMethedService,
    private datePipe: DatePipe,

  ) { }
  ngOnInit() {
    this.ownerInitialization();
  }

  // initialization houseinfo
  public  ownerInitialization(): void {
    this.loadHidden = false;
    // console.log('这里是信息的初始化');
    this.searchOwerData.pageNo = this.nowPage;
    this.searchOwerData.pageSize = 10;
    this.searchOwerData.villageCode = '';
    this.searchOwerData.regionCode = '';
    this.searchOwerData.buildingCode = '';
    this.searchOwerData.unitCode = '';

    this.owerSrv.queryOwerDataList(this.searchOwerData).subscribe(
       (value) => {
         this.loadHidden = true;
         this.ownerTableContent = value.data.contents;
         this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
       }
     );
    this.globalSrv.queryVillageInfo({}).subscribe(
      (data) => {
        data.data.forEach( v => {
          this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
          this.villageOption.push({label: v.villageName, value: v.villageName});
        });
      }
    );
    this.esDate = this.toolSrv.esDate;

    this.ownerTableTitle = [
      {field: 'villageName', header: '小区名称'},
      {field: 'regionName', header: '地块名称'},
      {field: 'buildingName', header: '楼栋名称'},
      {field: 'unitName', header: '单元名称'},
      {field: 'roomCode', header: '房间编号'},
      {field: 'roomSize', header: '房间大小'},
      // {field: 'roomStatus', header: '房间使用状态'},
      {field: 'operating', header: '操作'}
    ];

    this.ownerTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
    // console.log(this.roomTitle);
  }
  // village change function
  public  VillageChange(e): void {
    // console.log(this.test);
    this.loadHidden = false;
    this.searchOwerData.villageCode = '';
    this.searchOwerData.regionCode = '';
    this.searchOwerData.buildingCode = '';
    this.searchOwerData.unitCode = '';
    this.SearchOption.region = [];
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.searchOwerData.villageCode = e.value;

    this.globalSrv.queryRegionInfo({villageCode: e.value}).subscribe(
        (value) => {
          this.loadHidden = true;
          value.data.forEach( v => {
            this. SearchOption.region.push({label: v.regionName, value: v.regionCode});
          });
        }
      );
  }
  // region change function
  public  regionChange(e): void {
    this.loadHidden = false;
    this.searchOwerData.regionCode = '';
    this.searchOwerData.buildingCode = '';
    this.searchOwerData.unitCode = '';
    this.searchOwerData.regionCode = e.value;
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.globalSrv.queryBuilingInfo({regionCode: e.value}).subscribe(
      (value) => {
        value.data.forEach( v => {
          this. SearchOption.building.push({label: v.buildingName, value: v.buildingCode});
        });
        this.loadHidden = true;

      }
    );
  }
  // building change function
  public  buildingChange(e): void {
    this.searchOwerData.unitCode = '';
    this.SearchOption.unit = [];
    this.searchOwerData.buildingCode = e.value;
    this.globalSrv.queryunitInfo({buildingCode: e.value}).subscribe(
      (value) => {
        value.data.forEach( v => {
          this. SearchOption.unit.push({label: v.unitName, value: v.unitCode});
        });
      }
    );
  }
  // unit change function
  public  unitChange(e): void {
    this.searchOwerData.unitCode = '';
    this.searchOwerData.unitCode = e.value;
  }
  // condition search click
  public  ownerSearchClick(): void {
    if (this.mobileNumber !== '') {
      this.owerSrv.queryByMobileNumber({pageNo: 1, pageSize: 10, mobilePhone: this.mobileNumber}).subscribe(
        value => {
          if (value.status === '1000') {
            this.loadHidden = true;
            this.ownerTableContent = value.data.contents;
            this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
          } else {
            this.toolSrv.setToast('error', '请求错误', value.message);
          }
        }
      );
    } else {
      if ( this.searchOwerData.villageCode !== '' ) {
        this.loadHidden = false;
        this.searchOwerData.pageNo = 1;
        this.owerSrv.queryowerInfoList(this.searchOwerData).subscribe(
          (value) => {
            this.loadHidden = true;
            this.ownerTableContent = value.data.contents;
            this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
          }
        );
      } else {
        this.toolSrv.setToast('error', '操作错误', '请选择或输入搜索条件');
      }
    }
  }
  // renovation change function
  public  renovationChange(e): void {
      // console.log(e);
      if (e.value === '1') {
        this.timeHide = false;
      //   this.roomTitle.renovationStartTime = '';
      //   this.roomTitle.renovationDeadline = '';
      } else {
        this.timeHide = true;
      //   this.roomTitle.renovationStartTime = '';
      //   this.roomTitle.renovationDeadline = '';
      }
  }
  // show add owner box
  public  ownerAddClick(): void {
    this.roomTitle = new RoomTitle();
    this.setRoomTitleData();
    this.getRoomDropdownData('', '', '');
    this.ownerAddDialog = true;
  }
  // sure add houser and owner info
  public  ownerAddSureClick(): void {
    this.toolSrv.setConfirmation('增加', '增加', () => {
      if (this.ownerList.length === 0 ) {
        if (this.roomTitle.renovationStartTime !== '') {
          this.roomTitle.renovationStartTime = this.datePipe.transform(this.roomTitle.renovationStartTime, 'yyyy-MM-dd');
        }
        if (this.roomTitle.renovationDeadline !== '') {
          this.roomTitle.renovationDeadline = this.datePipe.transform(this.roomTitle.renovationDeadline, 'yyyy-MM-dd');
        }
        this.owerSrv.addRoomCodeInfo(this.roomTitle).subscribe(
          value => {
            if (value.status === '1000') {
              this.toolSrv.setToast('success', '操作成功', value.message);
              this.ownerAddDialog = false;
              this.clearData();
              this.ownerInitialization();
            } else  {
              this.toolSrv.setToast('error', '操作失败', value.message);
            }
          }
        );
      } else {
        this.ownerAddDialog = false;
        this.clearData();
        this.ownerInitialization();
        this.toolSrv.setToast('success', '操作成功', '操作成功');
      }
    });
  }
  // delete OwerInfo
  public  deleteOwerMoreClick(e): void {
    this.owerSrv.deleteOwerInfo({roomCode: e.roomCode, userId: e.userId}).subscribe(
        value => {
          if (value.status === '1000') {
            this.toolSrv.setToast('success', '请求成功', value.message);
            this.selectOwerInfo(e.roomCode);
          } else {
            this.toolSrv.setToast('error', '请求失败', value.message);
          }
        }
      );
  }
  public  addMoreOwerClick(): void {
    this.ownerinfo = new OwerList();
    this.setownerInfo();
    this.sexOption = [];
    this.normalChargeOption = [];
    this.identityOption = [];
    this.getownerDropdown('', '');
    this.ownerDialog = true;
  }
  // submit owner and roomInfo
  public  owerInfoAddClick(): void {
    this.toolSrv.setConfirmation('增加', '增加', () => {
      this.loadHidden = false;
      if (this.roomTitle.hasOwnProperty('renovationDeadline') && this.roomTitle.renovationDeadline !== '' ) {
        this.roomTitle.renovationDeadline = this.datePipe.transform( this.roomTitle.renovationDeadline , 'yyyy-MM-dd');
      }
      if (this.roomTitle.hasOwnProperty('renovationStartTime') && this.roomTitle.renovationStartTime !== '') {
        this.roomTitle.renovationStartTime = this.datePipe.transform( this.roomTitle.renovationStartTime , 'yyyy-MM-dd');
      }
      for (const key in this.roomTitle) {
        this.ownerAdd[key] = this.roomTitle[key];
      }
      for (const key in this.ownerinfo) {
        this.ownerAdd[key] = this.ownerinfo[key];
      }
      this.ownerAdd.startBillingTime = this.datePipe.transform(this.ownerAdd.startBillingTime, 'yyyy-MM-dd');
      this.ownerAdd.roomCode = this.ownerAdd.roomCode.slice(this.ownerAdd.roomCode.lastIndexOf('-') + 1, this.ownerAdd.roomCode.length);
      delete this.ownerAdd.buildingCode;
      delete this.ownerAdd.unitCode;
      delete this.ownerAdd.regionCode;
      delete this.ownerAdd.villageCode;
      this.owerSrv.addSingleOwerInfo(this.ownerAdd).subscribe(
        value => {
          this.loadHidden = true;
          if (value.status === '1000') {
            this.toolSrv.setToast('success', '操作成功', '添加成功');
            this.selectOwerInfo(value.data);
            this.ownerDialog = false;
          } else {
            this.toolSrv.setToast('error', '操作失败', value.message);
          }
        });
    });
  }
  // detail ownerInfo
  public  ownerDetailClick(e): void {
    this.renovationStatusName = null;
    this.identityOption = [];
    this.sexOption = [];
    this.normalChargeOption = [];
    this.roomTitle = e;
    for (const roomTitleKey in this.roomTitle) {
      if (this.roomTitle[roomTitleKey] === null) {
         this.roomTitle[roomTitleKey] = '';
      }
    }
    this.getRoomDropdownData(this.roomTitle.roomType, this.roomTitle.roomStatus, this.roomTitle.renovationStatus);
    this.selectOwerInfo(this.roomTitle.roomCode);
    this.ownerDetailDialog = true;
  }
  // modify owner
  public ownerModifyClick(): void {
    if (this.ownerSelect === undefined || this.ownerSelect.length === 0 ) {
     this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.ownerSelect.length === 1) {
      this.renovationStatusName = null;
      for (const roomTitleKey in this.roomTitle) {
        if (this.roomTitle[roomTitleKey] === null ) {
          this.roomTitle[roomTitleKey] = '';
        }
      }
      this.toolSrv.getAdminStatus('ROOM_TYPE', (data) => {
        if (data.length > 0) {
          this.toolSrv.setDataFormat(data, this.roomTitle.roomType, (list, label) => {
            this.roomTypeOption = list;
            this.roomTypeName = label;
            if (this.roomTypeName === '') {
              this.roomTypeName = '请选择房屋类型';
            }
          });
        }
      });
      this.toolSrv.getAdminStatus('ROOM_STATUS', (data) => {
        if (data.length > 0) {
          this.toolSrv.setDataFormat(data,  this.roomTitle.roomStatus, (list, label) => {
            this.roomStatusOption = list;
            this.roomStatusName = label;
            if (this.roomStatusName === '') {
              this.roomStatusName = '请选择房屋状态';
            }
          });
        }
      });
      this.toolSrv.getAdminStatus('RENOVATION_STATUS', (data) => {
        if (data.length > 0) {
            this.toolSrv.setDataFormat(data, this.roomTitle.renovationStatus, (list, labelname) => {
              this.renovationStatusOption = list;
              this.renovationName = labelname;
              if ( this.renovationName === '') {
                this.renovationName = '请选择装修状态';
                this.timeHide = true;
              } else if(this.renovationName === '已装修') {
                this.timeHide = false;
              }else {
                this.timeHide = true;
              }
            });
          }
      });
      this.selectOwerInfo(this.roomTitle.roomCode);
      this.ownerModifayDialog = true;
    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行修改');
    }
  }

  public  modifyMoreOwerClick(): void {
    for (const ownerinfoKey in this.ownerinfo) {
      if (this.ownerinfo[ownerinfoKey] === null) {
        this.ownerinfo[ownerinfoKey] = '';
      }
    }
    if (this.ownerUserSelect === undefined || this.ownerUserSelect.length === 0 ) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.ownerUserSelect.length === 1) {
      this.ownerinfo =   this.ownerUserSelect[0];
      this.ownerListIndex = this.ownerList.indexOf(this.ownerinfo);
      this.ownerModifyDialog = true;
    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行修改的项');
    }
  }
  // ower modify
  public  owerInfoModifyClick(): void {
    this.toolSrv.setConfirmation('增加', '增加', () => {
      let flagBole = true;
      this.loadHidden = false;
      if (this.roomTitle.hasOwnProperty('renovationDeadline') && this.roomTitle.renovationDeadline !== '' ) {
        this.roomTitle.renovationDeadline = this.datePipe.transform( this.roomTitle.renovationDeadline , 'yyyy-MM-dd');
      }
      if (this.roomTitle.hasOwnProperty('renovationStartTime') && this.roomTitle.renovationStartTime !== '') {
        this.roomTitle.renovationStartTime = this.datePipe.transform( this.roomTitle.renovationStartTime , 'yyyy-MM-dd');
      }
      for (const key in this.roomTitle) {
        this.ownerAdd[key] = this.roomTitle[key];
      }
      for (const ownerinfoKey in this.ownerinfo) {
        if (this.ownerinfo[ownerinfoKey] === '') {
          flagBole = false;
        }
      }
      if (this.ownerinfo.sex !== null ) {
        this.sexOption.forEach(val => {
          if (this.ownerinfo.sex === val.label) {
            this.ownerinfo.sex = val.value;
          }
        });
      }
      if (this.ownerinfo.normalPaymentStatus !== null)  {
        this.normalChargeOption.forEach(val => {
          if (this.ownerinfo.normalPaymentStatus === val.label) {
            this.ownerinfo.normalPaymentStatus = val.value;
          }
        });
      }
      if (this.ownerinfo.identity !== null) {
        this.identityOption.forEach(val => {
          if (this.ownerinfo.identity === val.label) {
            this.ownerinfo.identity = val.value;
          }
        });
      }
      for (const key in this.ownerinfo) {
        this.ownerAdd[key] = this.ownerinfo[key];
      }
      this.ownerAdd.startBillingTime = this.datePipe.transform(this.ownerAdd.startBillingTime, 'yyyy-MM-dd');
      this.ownerAdd.roomCode = this.ownerAdd.roomCode.slice(this.ownerAdd.roomCode.lastIndexOf('-') + 1, this.ownerAdd.roomCode.length);
      if (flagBole) {
        this.owerSrv.addSingleOwerInfo(this.ownerAdd).subscribe(
          value => {
            this.loadHidden = true;
            if (value.status === '1000') {
              this.toolSrv.setToast('success', '操作成功', '添加成功');
              this.selectOwerInfo(value.data);
              // this.clearData();
              this.ownerModifyDialog = false;
            } else {
              this.toolSrv.setToast('error', '操作失败', value.message);
            }
          });
      } else  {
        this.toolSrv.setToast('error', '操作错误', '请填写完整的房屋信息');
      }
    });
  }
  // sure modify owner
  public  ownerModifySureClick(): void {
    this.toolSrv.setConfirmation('修改', '修改', () => {
      if (this.ownerList.length === 0 ) {
        this.owerSrv.addRoomCodeInfo(this.roomTitle).subscribe(
          value => {
            if (value.status === '1000') {
              this.toolSrv.setToast('success', '操作成功', value.message);
              this.ownerModifayDialog = false;
              this.clearData();
              this.ownerInitialization();
            } else  {
              this.toolSrv.setToast('error', '操作失败', value.message);
            }
          }
        );
      } else {
        this.ownerModifayDialog = false;
        this.clearData();
        this.ownerInitialization();
        this.toolSrv.setToast('success', '操作成功', '操作成功');
      }
    });
  }
  // delete owner
  public  ownerDeleteClick(): void {
    if (this.ownerSelect === undefined || this.ownerSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.toolSrv.setConfirmation('删除', `删除这${this.ownerSelect.length}项`, () => {
        this.loadHidden = false;
        this.ownerSelect.forEach( v => {
          this.deleteId.push({roomCode: v.roomCode});
        });
        this.owerSrv.deleteRoomInfo({data: this.deleteId}).subscribe(
          value => {
            this.loadHidden = true;
            if (value.status === '1000') {
              this.toolSrv.setToast('success', '操作成功', value.message);
              this.ownerInitialization();
              this.clearData();
            }
          }
        );
      });
    }
  }
  // select houseinfo
  public  owneronRowSelect(e): void {
    this.roomTitle = e.data;
  }
  // add more upload file Dialog
  public  addMoreClick(): void {
    this.UploadFileOption.width = '800';
    this.UploadFileOption.dialog = true;
    this.UploadFileOption.files = [];
  }
  // upload file
  public  ownerUploadSureClick(e): void {
    this.loadHidden = false;
    this.owerSrv.uploadOwerInfoFile(e).subscribe(
      (value) => {
        if (value.status === '1000') {
          this.loadHidden = true;
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
                  {field: 'roomCode', header: '房间编号'},
                  {field: 'result', header: '结果'},
                  {field: 'remarks', header: '备注'},
                ],
                style: { background: '#F4F4F4', color: '#000', height: '6vh'}
              },
              tableContent: {
                data: value.data.logOwnerInformationDOS,
                styleone: { background: '#FFFFFF', color: '#000', height: '2vw', textAlign: 'center'},
                styletwo: { background: '#FFFFFF', color: '#000', height: '2vw', textAlign: 'center'}
              }
            }
          };
          // this.ownerInfoDialog = true;
          this.toolSrv.setToast('success', '上传成功', value.message);
          this.ownerInitialization();
        } else {
          this.toolSrv.setToast('error', '上传失败', value.message);
        }
      }
    );
    // this.confirmationService.confirm({
    //   message: `确认要上传吗？`,
    //   header: '上传提醒',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {
    //     this.loadHidden = false;
    //
    //   },
    //   reject: () => {
    //   }
    // });
  }
  public  clearData(): void {
     this.ownerAdd = new AddOwner();
     this.ownerModify = [];
     // this.SearchOption = {village: [], region: [], building: [], unit: []};
     this.roomTypeOption = [];
     this.roomStatusOption = [];
     this.renovationStatusOption = [];
     this.sexOption = [];
     this.roomTypeName = null;
     this.roomStatusName = null;
     this.renovationName = null;
     this.sexName = null;
     this.ownerSelect = [];
     this.roomTitle = new RoomTitle();
     this.ownerList = [];
     this.ownerinfo = new OwerList();
     this.ownerUserSelect = [];
     this.identityOption = [];
     this.normalChargeOption = [];
 }
  // paging query
  public  nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.searchOwerData.pageNo = this.nowPage;
    if (this.searchOwerData.villageCode !== '' || this.searchOwerData.regionCode !== '' || this.searchOwerData.buildingCode !== '' || this.searchOwerData.unitCode !== '') {
      this.owerSrv.queryowerInfoList(this.searchOwerData).subscribe(
        (value) => {
          this.loadHidden = true;
          if (value.data.contents) {
            this.ownerTableContent = value.data.contents;
          }
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        }
      );
    } else {
      this.owerSrv.queryOwerDataList(this.searchOwerData).subscribe(
        (value) => {
          this.loadHidden = true;
          if (value.status === '1000') {
            if (value.data.contents) {
              this.ownerTableContent = value.data.contents;
            }
            this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
          } else {
            this.toolSrv.setToast('error', '操作错误', value.message);
          }
        }
      );
    }
    // this.paymentSelect = [];
  }
  // get room Dropdown data
  public getRoomDropdownData(roomType, roomStatus, renovation): void {
    this.toolSrv.getAdminStatus('ROOM_TYPE', (data) => {
      if (data.length > 0) {
        this.toolSrv.setDataFormat(data, roomType, (list, label) => {
          this.roomTypeOption = list;
          this.roomTypeName = label;
        });
      }
    });
    this.toolSrv.getAdminStatus('ROOM_STATUS', (data) => {
      if (data.length > 0) {
        this.toolSrv.setDataFormat(data, roomStatus, (list, label) => {
          this.roomStatusOption = list;
          this.roomStatusName = label;
        });
      }
    });
    this.toolSrv.getAdminStatus('RENOVATION_STATUS', (data) => {
      if (data.length > 0) {
        this.toolSrv.setDataFormat(data, renovation, (list, labelname) => {
          this.renovationStatusOption = list;
          this.renovationName = labelname;
        });
      }
    });
  }
  // get owner Dropdown data
  public  getownerDropdown(sex, normal): void {
    this.toolSrv.getAdminStatus( 'SEX', (data) => {
      if (data.length > 0) {
        this.toolSrv.setDataFormat(data, sex, (list, label) => {
          this.sexOption = list;
        });
      }
    });
    this.toolSrv.getAdminStatus( 'NORMAL_PAYMENT_STATUS', (data) => {
      if (data.length > 0) {
        this.toolSrv.setDataFormat(data, normal, (list, label) => {
          this.normalChargeOption = list;
        });
      }
    });
    this.toolSrv.getAdminStatus( 'IDENTITY', (data) => {
      if (data.length > 0) {
         data.forEach( v => {
          if (v.settingName !== '租客')
            this.identityOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    });
  }
  // set roomtilt
  public  setRoomTitleData(): void {
    this.roomTitle.villageName = '';
    this.roomTitle.roomCode = '';
    this.roomTitle.regionName = '';
    this.roomTitle.unitName = '';
    this.roomTitle.buildingName = '';
    this.roomTitle.roomStatus = '';
    this.roomTitle.renovationStatus = '';
    this.roomTitle.roomType = '';
    this.roomTitle.roomSize = '';
    this.roomTitle.renovationStartTime = '';
    this.roomTitle.renovationDeadline = '';
  }
  // set owner
  public  setownerInfo(): void {
    this.ownerinfo.identity = '';
    this.ownerinfo.startBillingTime = '';
    this.ownerinfo.mobilePhone = '';
    this.ownerinfo.sex = '';
    this.ownerinfo.normalPaymentStatus = '';
    this.ownerinfo.surname = '';
  }
  // isOrChinese
  public  selectOwerInfo(code): void {
    this.sexOption = [];
    this.normalChargeOption = [];
    this.identityOption = [];
    this.ownerUserSelect = [];
    this.owerSrv.queryOwerInfoAllStatus({settingType: 'SEX'}).subscribe(
      value => {
        value.data.forEach( v => {
          this.sexOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    );
    this.owerSrv.queryOwerInfoAllStatus({settingType: 'NORMAL_PAYMENT_STATUS'}).subscribe(
      value => {
        value.data.forEach( v => {
          this.normalChargeOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    );
    this.owerSrv.queryOwerInfoAllStatus({settingType: 'IDENTITY'}).subscribe(
      value => {
        value.data.forEach( v => {
          if (v.settingName !== '租客')
            this.identityOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    );
    const setTime = setInterval(() => {
      if (this.sexOption.length > 0 && this.normalChargeOption.length && this.normalChargeOption.length > 0){
        this.owerSrv.queryOwerInfoDetail({roomCode: code}).subscribe(
          value => {
            console.log(value);
            this.ownerList = [];
            clearInterval(setTime);

            if (value.status === '1000') {
              value.data.forEach( v => {
                for (const key in  v) {
                  this.ownerinfo[key] = v[key];
                }
                if (this.ownerinfo.sex != null ) {
                  this.sexOption.forEach(val => {
                    if (this.ownerinfo.sex.toString() === val.value.toString()) {
                      this.ownerinfo.sex = val.label;
                    }
                  });
                }
                if (this.ownerinfo.normalPaymentStatus != null)  {
                  this.normalChargeOption.forEach(val => {
                    if (this.ownerinfo.normalPaymentStatus.toString() === val.value.toString()) {
                      this.ownerinfo.normalPaymentStatus = val.label;
                    }
                  });
                }
                if (this.ownerinfo.identity != null){
                  this.identityOption.forEach(val => {
                    if (this.ownerinfo.identity.toString() === val.value.toString()) {
                      this.ownerinfo.identity = val.label;
                    }
                  });
                }
                this.ownerList.push(this.ownerinfo);
                this.ownerinfo = new OwerList();
              });
            } else {
              this.toolSrv.setToast('error', '操作错误', '用户信息数据错误');
            }
          }
        );
      }
    }, 400);
  }
}
