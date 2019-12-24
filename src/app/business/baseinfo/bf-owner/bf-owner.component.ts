import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {BfOwnerService} from '../../../common/services/bf-owner.service';
import {ConfirmationService} from 'primeng/api';
import {AddOwner, ModifyOwner, OwerList, RoomTitle, SearchOwner} from '../../../common/model/bf-owner.model';
import {GlobalService} from '../../../common/services/global.service';
import {DatePipe} from '@angular/common';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {FileOption} from '../../../common/components/basic-dialog/basic-dialog.model';
import {Dropdown} from 'primeng/dropdown';
import {SharedServiceService} from '../../../common/public/shared-service.service';
import {Subscription} from 'rxjs';
import {ThemeService} from '../../../common/public/theme.service';
import {LocalStorageService} from '../../../common/services/local-storage.service';

@Component({
  selector: 'rbi-bf-owner',
  templateUrl: './bf-owner.component.html',
  styleUrls: ['./bf-owner.component.less']
})
export class BfOwnerComponent implements OnInit, OnDestroy {

  @ViewChild('roomType') roomtype: Dropdown;
  public ownerSelect: any;
  public tableContent: any;
  // 上传文件相关
  public UploadFileOption: FileOption = new FileOption();
  public uploadRecordOption: any;
  // 查询相关
  public searchOwerData = {
    pageSize: 10,
    pageNo: 1,
    code: '',
    level: ''
  };
  // public SearchOption = {village: [], region: [], building: [], unit: []};
  public inputSearchData = '';
  public searchType = 0;
  public SearchTypeOption = [
    {label: '全部', value: 1},
    {label: '手机号', value: 2},
    {label: '房间号', value: 3},
    {label: '业主姓名', value: 4},
    {label: '身份证号', value: 5},
  ];
  // 添加相关
  public ownerAddDialog: boolean;
  public ownerAdd: AddOwner = new AddOwner();
  // public ownerAdd: AddOwner = new AddOwner();
  public roomInfo: RoomTitle = new RoomTitle();
  public ownerList: OwerList[] = [];
  public timeHide = true;
  public ownerTimeDetailHide = true;
  // 状态相关
  public roomTypeOption: any[] = [];
  public villageOption: any[] = [];
  public roomStatusOption: any[] = [];
  public renovationStatusOption: any[] = [];
  public sexOption: any[] = [];
  // 表单效验
  public owerMoreTitleDetail = [
    {field: 'surname', header: '客户姓氏'},
    {field: 'sex', header: '性别'},
    {field: 'mobilePhone', header: '客户电话'},
    {field: 'identity', header: '身份'},
    {field: 'idNumber', header: '身份证号'},
    // {field: 'realRecyclingHomeTime', header: '实际交房时间'},
    // {field: 'normalPaymentStatus', header: '是否正常缴费'},
    {field: 'remarks', header: '备注'},
    {field: 'operating', header: '操作'},
  ];
  // 详情相关
  public owerMoreDetailDetail = [
    {field: 'surname', label: '客户姓氏', value: ''},
    {field: 'sex', label: '性别'},
    {field: 'mobilePhone', label: '客户电话', value: ''},
    {field: 'identity', label: '身份', value: ''},
    {field: 'idNumber', label: '身份证号', value: ''},
    {field: 'normalPaymentStatus', label: '是否正常缴费', value: ''},
    {field: 'startBillingTime', label: '物业费开始既费时间', value: ''},
    {field: 'remarks', label: '备注', value: ''},
  ];
  public roomList: any[] = [];
  public ownerRoomCodeDetailTitle = [
    {field: 'buildingName', header: '楼栋名称'},
    {field: 'roomCode', header: '房间编号'},
    {field: 'roomType', header: '房间类型'},
    {field: 'roomSize', header: '房间面积'},
    {field: 'identity', header: '客户身份'},
    {field: 'rentStatus', header: '出租状态'},
  ];
  public ownerParkingSpaceDetailTitle = [
    {field: 'buildingName', header: '楼栋名称'},
    {field: 'roomCode', header: '房间编号'},
    {field: 'parkingSpaceCode', header: '车位编号'},
    {field: 'authorizedPersonName', header: '车主姓名'},
    {field: 'authorizedPersonPhone', header: '车主电话'},
    {field: 'remarks', header: '备注'},
  ];
  // 房屋添加检验
  public keyRoomInfoList = [false, false, false, false, false, false, false, false, false, false, false];
  public keyOwnerInfoList = [false, false, false, false, false];
  public ParkingSpaceList: any[] = [];
  public ownertableOption: any;
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
  // 业主修改相关
  public ownerModifyDialog: any;
  public ownerListIndex: any;
  // 业主导出相关
  public downOwnerInfoDialog: any;
  public downLoadIndentity: any;
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  public esDate: any;
  public deleteId: any[] = [];
  public nowPage = 1;
  public table = {
    tableheader: {background: '', color: ''},
    tableContent: [
      {background: '', color: ''},
      {background: '', color: ''}],
    detailBtn: ''
  };
  public roomCodeInfo = {
    villageCode: '',
    roomCode: '',
    regionCode: '',
    buildingCode: '',
    unitCode: '',
  };
  // 详情里的列表按钮
  public pieBtnList = [
    {label: '新系统缴费统计图', value: 1, color: '#FF8352'},
    {label: '本年缴费统计图', value: 2, color: '#31C5C0'},
    {label: '总缴费统计图', value: 3, color: '#31C5C0'},
  ];
  public pieDatas = [];
  public pieChargeRoomCode: any;
  // 服务传参相关
  public ownerSub: Subscription;
  // 按钮权限相关
  public btnHiden = [
      {label: '新增', hidden: true},
      {label: '修改', hidden: true},
      {label: '删除', hidden: true},
      {label: '注销', hidden: true},
      {label: '导入', hidden: true},
      {label: '导出', hidden: true},
      {label: '搜索', hidden: true},
    ];
  constructor(
    private owerSrv: BfOwnerService,
    private globalSrv: GlobalService,
    private confirmationService: ConfirmationService,
    public toolSrv: PublicMethedService,
    private localSrv: LocalStorageService,
    private datePipe: DatePipe,
    private sharedSrv: SharedServiceService,
    private themeSrv: ThemeService,
  ) {
    this.ownerSub = this.sharedSrv.changeEmitted$.subscribe(
      value => {
        console.log(value);
        for (const key in this.roomCodeInfo) {
          this.roomCodeInfo[key] = value[key];
        }
        this.searchOwerData.level = value.data.level;
        this.searchOwerData.code = value.data.code;
        this.queryOwnerPageData();
        for (const roomKey in this.roomCodeInfo) {
          if (this.roomCodeInfo[roomKey] !== '') {
            if (roomKey ===  'villageCode') {
              this.roomInfo.villageName = this.roomCodeInfo[roomKey];
            } else if (roomKey ===  'regionCode') {
              this.roomInfo.regionName = this.roomCodeInfo[roomKey].slice(this.roomCodeInfo[roomKey].lastIndexOf('-') + 1, this.roomCodeInfo[roomKey].length);
            } else if (roomKey ===  'buildingCode') {
              this.roomInfo.buildingName = this.roomCodeInfo[roomKey].slice(this.roomCodeInfo[roomKey].lastIndexOf('-') + 1, this.roomCodeInfo[roomKey].length);
            } else if (roomKey ===  'unitCode') {
              this.roomInfo.unitName = this.roomCodeInfo[roomKey].slice(this.roomCodeInfo[roomKey].lastIndexOf('-') + 1, this.roomCodeInfo[roomKey].length);
            } else {
              this.roomInfo.roomCode = this.roomCodeInfo[roomKey].slice(this.roomCodeInfo[roomKey].lastIndexOf('-') + 1, this.roomCodeInfo[roomKey].length);
            }
          }
        }
      }
    );
    this.themeSrv.changeEmitted$.subscribe(
      value => {
      this.table.tableheader = value.table.header;
      this.table.tableContent = value.table.content;
      this.table.detailBtn = value.table.detailBtn;
      this.setTableOption(this.tableContent);
      }
    );
  }
  ngOnInit() {
    // console.log(this.localSrv.getObject('btnParentCodeList'));
    this.setBtnIsHidden();
    if (this.themeSrv.setTheme !== undefined) {
      this.table.tableheader = this.themeSrv.setTheme.table.header;
      this.table.tableContent = this.themeSrv.setTheme.table.content;
      this.table.detailBtn = this.themeSrv.setTheme.table.detailBtn;
    }
    if (this.sharedSrv.SearchData !== undefined) {
      for (const key in this.roomCodeInfo) {
        this.roomCodeInfo[key] = this.sharedSrv.SearchData[key];
      }
      this.searchOwerData.level = this.sharedSrv.SearchData.data.level;
      this.searchOwerData.code = this.sharedSrv.SearchData.data.code;
    }
    this.ownerInitialization();
  }
  ngOnDestroy(): void {
    this.ownerSub.unsubscribe();
  }

  // initialization houseinfo
  public  ownerInitialization(): void {
    this.toolSrv.getAdmStatus([{settingType: 'ROOM_TYPE'},
      {settingType: 'ROOM_STATUS'}, {settingType: 'RENOVATION_STATUS'},
      {settingType: 'SEX'}, {settingType: 'NORMAL_PAYMENT_STATUS'}, {settingType: 'IDENTITY' }], (data) => {
      this.roomTypeOption = this.toolSrv.setListMap(data.ROOM_TYPE);
      this.roomStatusOption = this.toolSrv.setListMap(data.ROOM_STATUS);
      this.renovationStatusOption = this.toolSrv.setListMap(data.RENOVATION_STATUS);
      this.sexOption = this.toolSrv.setListMap(data.SEX);
      this.normalChargeOption = this.toolSrv.setListMap(data.NORMAL_PAYMENT_STATUS);
      this.identityOption = this.toolSrv.setListMap(data.IDENTITY).filter(v => {
        return (v.value !== '3' && v.value !== '6');
      });
      this.queryOwnerPageData();
    });
    this.globalSrv.queryVillageInfo({}).subscribe(
      (data) => {
        console.log(data);
        this.villageOption = data.data.map( v => {
          return {label: v.villageName, value: v.villageCode};
        });
        console.log(this.villageOption);
      }
    );
    this.esDate = this.toolSrv.esDate;
  }
  // search type
  public  searchTypeChange(): void {
    if (this.searchType === 1) {
        this.inputSearchData = '';
    }
  }
  // condition search click
  public  ownerSearchClick(): void {
    this.searchJudgment(1);
  }
  // 判断搜索条件
  public  searchJudgment(page): void {
    switch (this.searchType) {
      case 0:  this.queryOwnerPageData(); break;
      case 1:  this.queryOwnerPageData(); break;
      case 2:  this.setCondition('phone', '请输入需要搜索的手机号', page); break;
      case 3:  this.setCondition('roomCode', '请输入需要搜索的房间号', page); break;
      case 4:  this.setCondition('surname', '请输入需要搜索的客户名称', page); break;
      case 5:  this.setCondition('idNumber', '请输入需要搜索的身份证号', page); break;
      default: break;
    }
  }
  public  setCondition(confition, message, pageNo): void {
    if (this.inputSearchData !== '') {
      this.queryOwnerPageByCondition(confition, this.inputSearchData, pageNo);
    } else {
      this.toolSrv.setToast('error', '操作错误', message);
    }
  }
  // renovation change function
  public  renovationChange(e): void {
      // console.log(e);
      if (e.value === '1') {
        this.timeHide = false;
        this.roomInfo.renovationStartTime = '';
        this.roomInfo.renovationDeadline = '';
      } else {
        this.timeHide = true;
        this.roomInfo.renovationStartTime = '';
        this.roomInfo.renovationDeadline = '';
      }
  }
  // show add owner box
  public  ownerAddClick(): void {
    console.log(this.roomCodeInfo);
    for (const roomKey in this.roomCodeInfo) {
      if (this.roomCodeInfo[roomKey] !== '') {
        if (roomKey ===  'villageCode') {
          this.roomInfo.villageName = this.roomCodeInfo[roomKey];
        } else if (roomKey ===  'regionCode') {
          this.roomInfo.regionName = this.roomCodeInfo[roomKey].slice(this.roomCodeInfo[roomKey].lastIndexOf('-') + 1, this.roomCodeInfo[roomKey].length);
        } else if (roomKey ===  'buildingCode') {
          this.roomInfo.buildingName = this.roomCodeInfo[roomKey].slice(this.roomCodeInfo[roomKey].lastIndexOf('-') + 1, this.roomCodeInfo[roomKey].length);
        } else if (roomKey ===  'unitCode') {
          this.roomInfo.unitName = this.roomCodeInfo[roomKey].slice(this.roomCodeInfo[roomKey].lastIndexOf('-') + 1, this.roomCodeInfo[roomKey].length);
        } else {
          this.roomInfo.roomCode = this.roomCodeInfo[roomKey].slice(this.roomCodeInfo[roomKey].lastIndexOf('-') + 1, this.roomCodeInfo[roomKey].length);
        }
      }
    }
    this.ownerAddDialog = true;
  }
  // sure add houser and owner info
  public  ownerSureClick(data): void {
    const addRoomKeyList = ['villageName', 'regionName', 'buildingName', 'unitName', 'floor', 'roomCode', 'roomSize',  'roomType', 'roomStatus', 'startBillingTime', 'realRecyclingHomeTime'];
    addRoomKeyList.forEach((v, index) => {
     this.keyRoomInfoList[index] = this.roomInfo[v] === undefined || this.roomInfo[v] === null || this.roomInfo[v] === '';
   });
    const addroomVerifyStaus = addRoomKeyList.some( v => {
    return (this.roomInfo[v] === undefined || this.roomInfo[v] === null || this.roomInfo[v] === '');
    });
    if (!addroomVerifyStaus) {
        // console.log(data);
       this.addQuest(data);
    } else {
      this.toolSrv.setToast('error', '操作错误', '带*号的信息未填写完整');
    }
  }

  public  changeInput(data, index): void {
    this.keyRoomInfoList[index] = !(data !== '' && data !== null);
  }
  public  addQuest(data): void {
    this.toolSrv.setConfirmation(data, data, () => {
      const addOwnerList = this.ownerList.map( v => {
          v.identity = this.toolSrv.setLabelToValue(this.identityOption, v.identity);
          v.sex = this.toolSrv.setLabelToValue(this.sexOption, v.sex);
          v.normalPaymentStatus = this.toolSrv.setLabelToValue(this.normalChargeOption, v.normalPaymentStatus);
          return v;
      });
      if (data === '添加') {
        this.roomInfo.villageName = this.toolSrv.setValueToLabel(this.villageOption,  this.roomInfo.villageName);
      }
      this.roomInfo.renovationStartTime = this.datePipe.transform(this.roomInfo.renovationStartTime, 'yyyy-MM-dd');
      this.roomInfo.renovationDeadline = this.datePipe.transform(this.roomInfo.renovationDeadline, 'yyyy-MM-dd');
      this.roomInfo.realRecyclingHomeTime = this.datePipe.transform( this.roomInfo.realRecyclingHomeTime , 'yyyy-MM-dd');
      this.roomInfo.startBillingTime = this.datePipe.transform( this.roomInfo.startBillingTime , 'yyyy-MM-dd');
      // this.roomInfo.roomCode = this.roomInfo.roomCode.slice(this.roomInfo.roomCode.lastIndexOf('-') + 1, );
      console.log(this.roomInfo);
      this.owerSrv.addRoomCodeAndOwnerInfo({roomInfo: this.roomInfo, owner: addOwnerList}).subscribe(
            value => {
              if (value.status === '1000') {
                this.queryOwnerPageData();
                this.toolSrv.setToast('success', '操作成功', value.message);
                this.ownerAddDialog = false;
                this.ownerModifayDialog = false;
                this.clearData();
              } else {
                this.toolSrv.setToast('error', '操作失败', value.message);
              }
            }
      );
    });
  }
  // 从业主列表里删除业主信息删除业主信息
  public  deleteOwerMoreClick(e): void {
    console.log(e);
    this.ownerList.splice(e, 1);
    // this.toolSrv.setToast('success', '操作成功', '删除成功');
  }
  public  addOwerClick(): void {
    this.ownerDialog = true;
  }
  // submit owner and roomInfo
  public  owerInfoClick(data): void {
    console.log(this.ownerinfo);
    const ownerVertifyKeylist = ['surname', 'idNumber', 'mobilePhone', 'identity', 'normalPaymentStatus'];
    ownerVertifyKeylist.forEach((v, index) => {
      this.keyOwnerInfoList[index] = this.ownerinfo[v] === '' || this.ownerinfo[v] === undefined || this.ownerinfo[v] === null;
    });
    console.log(this.keyOwnerInfoList);
    const ownerInfoStatus  = ownerVertifyKeylist.every( v => {
       return (this.ownerinfo[v] !== '' && this.ownerinfo[v] !== undefined && this.ownerinfo[v] !== null);
    });
    if (ownerInfoStatus) {
      if (this.toolSrv.verifyName.test(this.ownerinfo.surname)) {
        if (this.toolSrv.verifyPhone.test(this.ownerinfo.mobilePhone)) {
          if (this.toolSrv.verifyIdNumber.test(this.ownerinfo.idNumber)) {
            this.ownerInfoSetValueToOwnerList(data);
          } else {
            this.toolSrv.setToast('error', '添加失败', '请输入正确的身份证号');
          }
        } else {
          this.toolSrv.setToast('error', '添加失败', '请输入正确的手机号');
        }
      } else {
        this.toolSrv.setToast('error', '添加失败', '请输入正确的用户名(只含中文汉字)');
      }


    } else {
      this.toolSrv.setToast('error', '添加失败', '信息未填写完整');
    }
  }

  // 将添加的业主信息set到业主列表中
  public  ownerInfoSetValueToOwnerList(data): void {
    // 将业主信息状态转换为可以别的中文格式
    // this.roomInfo.renovationDeadline = this.datePipe.transform( this.roomInfo.renovationDeadline , 'yyyy-MM-dd');

    // this.roomInfo.renovationDeadline = this.datePipe.transform( this.roomInfo.renovationDeadline , 'yyyy-MM-dd');
    this.ownerinfo.identity = this.toolSrv.setValueToLabel(this.identityOption, this.ownerinfo.identity);
    this.ownerinfo.normalPaymentStatus = this.toolSrv.setValueToLabel(this.normalChargeOption, this.ownerinfo.normalPaymentStatus);
    if (data === 'add') {
      // 添加业主信息到列表中
      this.ownerList.push(this.ownerinfo);
      this.ownerDialog = false;
      this.ownerinfo = new OwerList();
    } else {
      // 添加业主信息到列表中
      this.ownerList[this.ownerListIndex] = this.ownerinfo;
      this.ownerDialog = false;
      this.ownerinfo = new OwerList();
      this.ownerModifyDialog = false;
    }

  }
  // detail ownerInfo
  public  ownerDetailClick(e): void {
    this.pieChargeRoomCode = e.roomCode;
    this.owerSrv.queryOwerInfoDetail({roomCode: e.roomCode, customerUserId: e.customerUserId}).subscribe(
      value => {
          if (value.status === '1000') {
            this.owerMoreDetailDetail = this.owerMoreDetailDetail.map(v => {
                 v.value = e[v.field];
                 return v;
              });
            this.roomList =  value.data.roomInfo.map(val => {
              val.roomType = this.toolSrv.setValueToLabel(this.roomTypeOption,  val.roomType);
              val.identity = this.toolSrv.setValueToLabel(this.identityOption, val.identity);
              return val;
            });
            this.ParkingSpaceList = value.data.parkingSpaceManagementDOS.map( val => {
              return val;
            });
            this.ownerDetailDialog = true;
          } else {
            this.toolSrv.setToast('error', '操作错误', value.message);
          }
    });
    this.getChargePieData(1);
  }
  // modify owner
  public ownerModifyClick(): void {
    if (this.ownerSelect === undefined || this.ownerSelect.length === 0 ) {
     this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.ownerSelect.length === 1) {
      this.queryOwnerUpdateData(this.ownerSelect[0].roomCode);

      this.ownerModifayDialog = true;
    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行修改');
    }
  }
  // 关闭弹窗
  public  ownerModifyFalseDialog(): void {
    this.ownerList = [];
    this.ownerModifayDialog = false;
    this.ownerSelect = [];
    this.clearData();
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
  // delete owner
  public  ownerDeleteClick(): void {
    if (this.ownerSelect === undefined || this.ownerSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.toolSrv.setConfirmation('删除', `删除这${this.ownerSelect.length}项`, () => {
        this.ownerSelect.forEach( v => {
          this.deleteId.push({roomCode: v.roomCode});
        });
        this.owerSrv.deleteRoomInfo({data: this.deleteId}).subscribe(
          value => {
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
  // add more upload file Dialog
  public  addMoreFileClick(): void {
    this.UploadFileOption.width = '800';
    this.UploadFileOption.dialog = true;
    this.UploadFileOption.files = [];
  }
  // upload file
  public  ownerUploadSureClick(e): void {
    if (e.getAll('file').length !== 0) {
      this.owerSrv.uploadOwerInfoFile(e).subscribe(
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
            console.log(123);
            this.toolSrv.setToast('error', '上传失败', value.message);
          }
        }
      );
    } else {
      this.toolSrv.setToast('error', '操作失败', '请选择需要上传的文件');
    }
  }

  public  clearData(): void {
     this.ownerAdd = new AddOwner();
     this.ownerModify = [];
     // this.SearchOption = {village: [], region: [], building: [], unit: []};
     this.ownerSelect = [];
     this.roomInfo = new RoomTitle();
     this.ownerList = [];
     this.ownerinfo = new OwerList();
     this.ownerUserSelect = [];
     this.ownerSelect = [];
     this.keyRoomInfoList = [false, false, false, false, false, false, false, false, false, false, false];
 }
  // paging query
  public  nowpageEventHandle(event: any): void {
    this.nowPage = event;
    this.searchOwerData.pageNo = this.nowPage;
    this.searchJudgment(this.nowPage);
    // this.queryOwnerPageData();
    this.ownerSelect = [];
  }
  // set owner
  // 设置表格数据
  // set table data （设置列表数据）
  public  setTableOption(data1): void {
    this.ownertableOption = {
      width: '101.4%',
      header: {
        data:  [
          {field: 'buildingName', header: '楼栋名称'},
          {field: 'roomCode', header: '房间编号'},
          {field: 'roomType', header: '房间类型'},
          {field: 'roomSize', header: '建筑面积'},
          {field: 'surname', header: '客户名称'},
          {field: 'identity', header: '客户身份'},
          {field: 'sex', header: '客户性别'},
          {field: 'mobilePhone', header: '客户电话'},
          {field: 'idNumber', header: '身份证号'},
          {field: 'operating', header: '操作'}
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
  // select data
  public  selectData(e): void {
    this.ownerSelect = e;
  }

  public  queryOwnerPageData(): void {
    this.owerSrv.queryOwerDataList(this.searchOwerData).subscribe(
      (value) => {
        if (value.status === '1000') {
          this.setQueryDataValueToLabel(value.data.contents);
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        } else {
          this.toolSrv.setToast('error', '查询失败', value.message);
        }
      }
    );
  }

  public  queryOwnerPageByCondition(conditions, data, nowPage): void {
      this.owerSrv.queryOwerInfoListByCondition({condition: conditions, value: data, pageSize: 10,  pageNo: nowPage }).subscribe(
        value => {
          if (value.status === '1000') {
            this.setQueryDataValueToLabel(value.data.contents);
            this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
          } else {
            this.toolSrv.setToast('error', '查询失败', value.message);
          }
        }
      );
  }
  // 设置值转成名字
  public  setQueryDataValueToLabel(list): void {
    this.tableContent = list.map(v => {
      v.sex = this.toolSrv.setValueToLabel(this.sexOption, v.sex);
      v.identity = this.toolSrv.setValueToLabel(this.identityOption, v.identity);
      v.roomType = this.toolSrv.setValueToLabel(this.roomTypeOption, v.roomType);
      v.roomStatus = this.toolSrv.setValueToLabel(this.roomStatusOption, v.roomStatus);
      v.normalPaymentStatus = this.toolSrv.setValueToLabel(this.normalChargeOption, v.normalPaymentStatus);
      v.renovationStatus = this.toolSrv.setValueToLabel(this.renovationStatusOption, v.renovationStatus);
      return v;
    });
    this.setTableOption(this.tableContent);
  }

  public  queryOwnerUpdateData(data): void {
      this.owerSrv.queryUpdateInfoByroomCode({roomCode: data}).subscribe(
        value => {
          if (value.status === '1000') {
            this.ownerList = value.data.owner.map( v => {
              v.sex = this.toolSrv.setValueToLabel(this.sexOption, v.sex);
              v.identity = this.toolSrv.setValueToLabel(this.identityOption, v.identity);
              v.normalPaymentStatus = this.toolSrv.setValueToLabel(this.normalChargeOption, v.normalPaymentStatus);
              return v;
            });
            this.roomInfo = value.data.roomInfo;
            this.roomInfo.renovationStatus = this.roomInfo.renovationStatus.toString();
            this.roomInfo.roomStatus = this.roomInfo.roomStatus.toString();
            this.roomInfo.roomType = this.roomInfo.roomType.toString();
            this.roomInfo.roomCode = this.roomInfo.roomCode.slice(this.roomInfo.roomCode.lastIndexOf('-') + 1, this.roomInfo.roomCode.length)
          } else {
            this.toolSrv.setToast('error', '请求失败', value.message);
          }
        }
      );
  }

  public  logoutClick(): void {
    if (this.ownerSelect === undefined || this.ownerSelect.length === 0 ) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要注销的项');
    } else {
      const Logoutlist = [];
      this.ownerSelect.forEach( v => {
       Logoutlist.push({roomCode: v.roomCode, customerUserId: v.customerUserId, identity: this.toolSrv.setLabelToValue(this.identityOption, v.identity)})
      });
      this.toolSrv.setConfirmation('注销', `注销这${this.ownerSelect.length}项`, () => {
        this.owerSrv.logoutOwnerInfo({data: Logoutlist}).subscribe(
          value => {
            if (value.status === '1000') {
              this.searchJudgment(this.nowPage);
              this.clearData();
              this.toolSrv.setToast('success', '请求成功', value.message);
            } else {
              this.toolSrv.setToast('error', '请求失败', value.message);
            }
          }
        );
      });
      // this.queryOwnerUpdateData(this.ownerSelect[0].roomCode);
      // this.ownerModifayDialog = true;
    }
  }

  public  deleteModifyClick(item): void {
     this.toolSrv.setConfirmation('删除', '删除', () => {
       this.owerSrv.deleteSingleOwnerInfo({data: [{roomCode: this.ownerSelect[0].roomCode, customerUserId: item.customerUserId}]}).subscribe(
         value => {
           if (value.status === '1000') {
             this.queryOwnerUpdateData(this.ownerSelect[0].roomCode);
             this.toolSrv.setToast('success', '请求成功', value.message);
           } else {
             this.toolSrv.setToast('error', '请求失败', value.message);
           }
         }
       );
     });
  }

  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '业主资料') {
        this.globalSrv.getChildrenRouter({parentCode: v.parentCode}).subscribe(value => {
          console.log(value);
          value.data.forEach(v => {
            this.btnHiden.forEach( val => {
              if (v.title === val.label) {
                val.hidden = false;
              }
            });
          });
        });
      }
    });
  }
  // 设置切换饼状图的数据
  public  changePieDataClick(item): void {
      this.pieBtnList.forEach( v => {
        v.color = '#31C5C0';
      });
      item.color = '#FF8352';
      this.getChargePieData(item.value);
  }

  // 会怄气饼状图的数据
  public  getChargePieData(index): void {
    if (index !== 2) {
      this.owerSrv.getNewSystemChargeItemToatal({roomCode: this.pieChargeRoomCode}).subscribe(
        value => {
          console.log(value);
          if (value.status === '1000') {
            this.pieDatas = value.data.filter(v => {
              return v.value !== null;
            });
          } else {
            this.toolSrv.setToast('error', '请求失败', value.message);
          }
        }
      );
    } else if (index === 2) {
      this.owerSrv.getYearChargeItemToatal({roomCode: this.pieChargeRoomCode}).subscribe(
        value => {
          console.log(value);
          if (value.status === '1000') {
            this.pieDatas = value.data.filter(v => {
              return v.value !== null;
            });
          } else {
            this.toolSrv.setToast('error', '请求失败', value.message);
          }
        }
      );
    }
  }

  // 导出业主数据
  public  importOutFileClick(): void {
      if (this.searchOwerData.level !== '' && this.searchOwerData.code !== '') {
         this.downOwnerInfoDialog = true;
      } else {
        this.toolSrv.setToast('error', '操作错位', '请先选择需要导出的小区');
      }
  }

  // 导出业主信息
  public  downloadFileOwnerInfo(): void {
    console.log(this.downLoadIndentity);
    if (this.downLoadIndentity) {
      this.owerSrv.downloadOwnerInfo({level: this.searchOwerData.level, code: this.searchOwerData.code , identity: this.downLoadIndentity}).subscribe(
        value => {
          console.log(value);
          if (value.status === '1000') {
            window.open(value.data);
            this.downOwnerInfoDialog = false;
          } else {
            this.toolSrv.setToast('error', '请求失败', value.message);
          }
        }
      );
    } else {
      this.toolSrv.setToast('error', '操作失败', '请选择客户身份');
    }
  }
}
