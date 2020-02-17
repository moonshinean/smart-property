import {Component, OnDestroy, OnInit} from '@angular/core';
import {DialogModel, FormValue} from '../../../common/components/basic-dialog/dialog.model';
import {FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {GlobalService} from '../../../common/services/global.service';
import {ThemeService} from '../../../common/public/theme.service';
import {BfVacantRoomService} from '../../../common/services/bf-vacant-room.service';
import {SharedServiceService} from '../../../common/public/shared-service.service';
import {OwerList, RoomTitle} from '../../../common/model/bf-owner.model';
import {BfOwnerService} from '../../../common/services/bf-owner.service';
import {DatePipe} from '@angular/common';
import {LocalStorageService} from '../../../common/services/local-storage.service';
import {UpdateTreeService} from '../../../common/public/update-tree.service';

@Component({
  selector: 'rbi-bf-vacant-room',
  templateUrl: './bf-vacant-room.component.html',
  styleUrls: ['./bf-vacant-room.component.less']
})
export class BfVacantRoomComponent implements OnInit, OnDestroy {

  public tableOption: any;
  public vacantRoomSelect: any;
  public tableContent: any;
  public option: any;
  // 状态相关
  public roomTypeOption: any[] = [];
  public roomStatusOption: any[] = [];
  public renovationStatusOption: any[] = [];
  public villageOption: any[] = [];
  public normalChargeOption: any[] = [];
  public identityOption: any[] = [];
  // 分页相关
  public nowPage = 1;
  public SearchData = {
     level: '',
     code: '',
     pageNo: 1,
     pageSize: 10,
     type: ''
  };
  // 业主信息弹窗
  public ownerDialog: boolean;
  // 添加业主
  public ownerinfo: OwerList = new OwerList();
  public owerMoreTitleDetail = [
    {field: 'surname', header: '客户姓氏'},
    {field: 'mobilePhone', header: '客户电话'},
    {field: 'identity', header: '身份'},
    {field: 'idNumber', header: '身份证号'},
    // {field: 'realRecyclingHomeTime', header: '实际交房时间'},
    {field: 'normalPaymentStatus', header: '是否正常缴费'},
    {field: 'remarks', header: '备注'},
    {field: 'operating', header: '操作'},
  ];
  public ownerList: OwerList[] = [];
  // 添加相关
  public vacantAddDialog: boolean;
  public timeHide = true;
  public roomInfo: RoomTitle = new RoomTitle();
  // 详情相关
  public vacantDetailOption: any;
  // 修改相关
  public vacantModityDialog: boolean;
  // 删除相关
  public deleteId = [];
  // 全局订阅树结构和主题
  public themeSub: Subscription;
  public table = {
    tableheader: {background: '', color: ''},
    tableContent: [
      {background: '', color: ''},
      {background: '', color: ''}],
    detailBtn: ''
  };
  public btnHiden = [
    {label: '新增', hidden: true},
    {label: '修改', hidden: true},
    {label: '删除房间', hidden: true},
    {label: '导出', hidden: true},
  ];
  public addroomVerifyStaus: any;

  public keyRoomInfoList = [false, false, false, false, false, false, false, false, false, false];
  public keyOwnerInfoList = [false, false, false, false, false];
  // 选择日期相关
  public esDate: any;
  public vacantRoomSub: Subscription;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    public toolSrv: PublicMethedService,
    private globalSrv: GlobalService,
    private vantRoomSrv: BfVacantRoomService,
    private sharedSrv: SharedServiceService,
    private localSrv: LocalStorageService,
    private datePipe: DatePipe,
    private owerSrv: BfOwnerService,
    private themeSrv: ThemeService,
    private updateTreeSrv: UpdateTreeService,
  ) {
    this.themeSub = this.themeSrv.changeEmitted$.subscribe(
      value => {
        this.table.tableheader = value.table.header;
        this.table.tableContent = value.table.content;
        this.table.detailBtn = value.table.detailBtn;
        this.setTableOption(this.tableContent);
      }
    );
    this.vacantRoomSub = this.sharedSrv.changeEmitted$.subscribe(
      value => {
        this.SearchData.level = value.data.level;
        this.SearchData.code = value.data.code;
        this.SearchData.type = value.data.type;
        this.queryVacantRoomPageData();
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
        this.SearchData.level = this.sharedSrv.SearchData.data.level;
        this.SearchData.code = this.sharedSrv.SearchData.data.code;
      this.SearchData.type = this.sharedSrv.SearchData.data.type;
    }
    this.initVacantRoomInfo();
  }
  ngOnDestroy(): void {
    this.themeSub.unsubscribe();
    this.vacantRoomSub.unsubscribe();
  }
  // 初始化信息
  public  initVacantRoomInfo(): void {
    this.toolSrv.getAdmStatus([{settingType: 'ROOM_TYPE'},
      {settingType: 'ROOM_STATUS'}, {settingType: 'RENOVATION_STATUS'}, {settingType: 'NORMAL_PAYMENT_STATUS'}, {settingType: 'IDENTITY' }], (data) => {
      this.roomTypeOption = this.toolSrv.setListMap(data.ROOM_TYPE);
      this.roomStatusOption = this.toolSrv.setListMap(data.ROOM_STATUS);
      this.renovationStatusOption = this.toolSrv.setListMap(data.RENOVATION_STATUS);
      this.normalChargeOption = this.toolSrv.setListMap(data.NORMAL_PAYMENT_STATUS);
      this.identityOption = this.toolSrv.setListMap(data.IDENTITY).filter(v => {
        return (v.value !== '3' && v.value !== '6');
      });
      this.queryVacantRoomPageData();
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
  // 详情
  public  vacantRoomDetailClick(e): void {
   this.vacantDetailOption = {
      dialog: true,
      tableHidden: false,
      width: '900',
      type: 1,
      title: '详情',
      poplist: {
      popContent: e,
        popTitle:  [
          {field: 'villageName', header: '小区名称'},
          {field: 'regionName', header: '地块名称'},
          {field: 'buildingName', header: '楼宇名称'},
          {field: 'roomCode', header: '房间编号'},
          {field: 'roomType', header: '房间类型'},
          {field: 'roomSize', header: '建筑面积'},
          {field: 'roomStatus', header: '房间状态'},
          {field: 'renovationStatus', header: '装修状态'},
      ],
    }
    };
  }
  // 表单检验
  public  changeInput(data, index): void {
    console.log(data);
    this.keyRoomInfoList[index] = !(data !== '' && data !== null && data !== undefined);
  }
  // 添加
  public  vacantRoomAddClick(): void {
    this.vacantAddDialog = true;
  }
  // 修改
  public  vacantRoomModifyClick(): void {
    if (this.vacantRoomSelect.length === null || this.vacantRoomSelect.length === undefined || this.vacantRoomSelect.length === 0) {
       this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.vacantRoomSelect.length === 1) {
      console.log(this.vacantRoomSelect[0]);
      // tslint:disable-next-line:forin
      for (const key in this.vacantRoomSelect[0]) {
        this.roomInfo[key] = this.vacantRoomSelect[0][key];
      }
      this.roomInfo.roomCode = this.roomInfo.roomCode.slice(this.roomInfo.roomCode.lastIndexOf('-') + 1, this.roomInfo.roomCode.length );
      this.roomInfo.roomType = this.toolSrv.setLabelToValue(this.roomTypeOption,  this.roomInfo.roomType);
      this.roomInfo.roomStatus = this.toolSrv.setLabelToValue(this.roomStatusOption,  this.roomInfo.roomStatus);
      this.roomInfo.renovationStatus = this.toolSrv.setLabelToValue(this.renovationStatusOption, this.roomInfo.renovationStatus);
      this.timeHide = !(this.roomInfo.renovationStatus === '1');
      this.vacantModityDialog = true;
    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行修改');
    }
  }
  // 删除
  public  vacantRoomDeleteClick(): void {
    if (this.vacantRoomSelect === undefined || this.vacantRoomSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.toolSrv.setConfirmation('删除', `删除这${this.vacantRoomSelect.length}项`, () => {
        this.vacantRoomSelect.forEach( v => {
          this.deleteId.push({roomCode: v.roomCode});
        });
        this.owerSrv.deleteRoomInfo({data: this.deleteId}).subscribe(
          value => {
            if (value.status === '1000') {
              this.queryVacantRoomPageData();
              this.vacantRoomSelect = [];
              this.updateTreeSrv.emitChangeTheme('update');
              this.toolSrv.setToast('success', '操作成功', value.message);
            } else {
              this.toolSrv.setToast('success', '请求成功', value.message);
            }
          }
        );
      });
    }
  }
  // //  搜索
  // public  vacantRoomSearchClick(): void {}
  // 选择列表数据
  public  selectData(e): void {
    this.vacantRoomSelect = e;
  }
  //  分页查询
  public  queryVacantRoomPageData(): void {
      this.vantRoomSrv.queryVacantRoomPageData(this.SearchData).subscribe(
        value => {
              console.log(value);
              if (value.status === '1000') {
                this.setQueryDataValueToLabel(value.data.contents);
                this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
            } else {
                this.toolSrv.setToast('error', '请求失败', '查询数据失败');
            }
        }
      );
  }
 // 分页事件
  public  nowpageEventHandle(event): void {
      this.nowPage = event;
      this.SearchData.pageNo = this.nowPage;
      this.queryVacantRoomPageData();
  }
  // 设置值转成名字
  public  setQueryDataValueToLabel(list): void {
    this.tableContent = list.map( v => {
      v.roomType = this.toolSrv.setValueToLabel(this.roomTypeOption, v.roomType);
      v.roomStatus = this.toolSrv.setValueToLabel(this.roomStatusOption, v.roomStatus);
      v.renovationStatus = this.toolSrv.setValueToLabel(this.renovationStatusOption, v.renovationStatus);
      return v;
    });
    this.setTableOption(this.tableContent);
  }
  // set table data （设置列表数据）
  public  setTableOption(data1): void {
    this.tableOption = {
      width: '100%',
      header: {
        data:  [
          {field: 'buildingName', header: '楼栋名称'},
          {field: 'roomCode', header: '房间编号'},
          {field: 'roomType', header: '房间类型'},
          {field: 'roomSize', header: '建筑面积'},
          {field: 'roomStatus', header: '房间状态'},
          {field: 'renovationStatus', header: '装修状态'},
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
 // 弹窗事件
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

  // 添加房屋请求
  public  addVacantRoomSureClick(data): void {
    if (data === '添加') {
      const addRoomKeyList = ['villageName', 'regionName', 'buildingName', 'unitName', 'floor', 'roomCode', 'roomSize',  'roomType',];
      // @ts-ignore
      addRoomKeyList.forEach((val, index) => {
        this.keyRoomInfoList[index] = this.roomInfo[val] === undefined || this.roomInfo[val] === null || this.roomInfo[val] === '';
      });
      console.log(this.keyRoomInfoList);
      this.addroomVerifyStaus =  addRoomKeyList.some((v) => {
        return (this.roomInfo[v] === undefined || this.roomInfo[v] === null || this.roomInfo[v] === '');
      });
    } else {
      const addRoomKeyList = ['villageName', 'regionName', 'buildingName', 'unitName', 'floor', 'roomCode', 'roomSize',  'roomType', 'startBillingTime', 'realRecyclingHomeTime'];
      addRoomKeyList.forEach((val, index) => {
        this.keyRoomInfoList[index] = this.roomInfo[val] === undefined || this.roomInfo[val] === null || this.roomInfo[val] === '';
      });
      // @ts-ignore
      this.addroomVerifyStaus =  addRoomKeyList.some((v) => {

        return (this.roomInfo[v] === undefined || this.roomInfo[v] === null || this.roomInfo[v] === '');
      });
    }
    if (!this.addroomVerifyStaus) {
      let addOwnerList = [];
      this.toolSrv.setConfirmation(data, data, () => {
        if (this.ownerList.length !== 0) {
          addOwnerList = this.ownerList.map(v => {
            v.identity = this.toolSrv.setLabelToValue(this.identityOption, v.identity);
            v.normalPaymentStatus = this.toolSrv.setLabelToValue(this.normalChargeOption, v.normalPaymentStatus);
            return v;
          });
        }
        this.roomInfo.villageName = this.toolSrv.setValueToLabel(this.villageOption, this.roomInfo.villageName);
        this.roomInfo.roomCode = this.roomInfo.roomCode.slice(this.roomInfo.roomCode.lastIndexOf('-') + 1, this.roomInfo.roomCode.length);
        this.roomInfo.startBillingTime = this.datePipe.transform(this.roomInfo.startBillingTime, 'yyyy-MM-dd');
        this.roomInfo.realRecyclingHomeTime = this.datePipe.transform(this.roomInfo.realRecyclingHomeTime, 'yyyy-MM-dd');
        this.roomInfo.renovationStartTime = this.datePipe.transform(this.roomInfo.renovationStartTime, 'yyyy-MM-dd');
        this.roomInfo.renovationDeadline = this.datePipe.transform(this.roomInfo.renovationDeadline, 'yyyy-MM-dd');
        this.owerSrv.addVacantRoomCodeAndOwnerInfo({roomInfo: this.roomInfo, owner: addOwnerList}).subscribe(
          value => {
            if (value.status === '1000') {
              this.queryVacantRoomPageData();
              this.toolSrv.setToast('success', '操作成功', value.message);
              this.vacantAddDialog = false;
              this.vacantModityDialog = false;
              this.ownerinfo = new OwerList();
              this.ownerList = [];
              this.vacantRoomSelect = [];
              this.roomInfo = new RoomTitle();
              this.updateTreeSrv.emitChangeTheme('update');
            } else {
              this.toolSrv.setToast('error', '操作失败', value.message);
            }
          }
        );
      });
    } else {
      this.toolSrv.setToast('error', '操作错误', '带*号的信息未填写完整');
    }
  }
  // 显示添加业主弹窗
  public  addOwerClick(): void {
    this.ownerDialog = true;
  }

  // submit owner and roomInfo
  public  owerInfoClick(): void {
    console.log(this.ownerinfo);
    const ownerVertifyKeylist = ['surname', 'idNumber', 'mobilePhone', 'identity', 'normalPaymentStatus'];
    ownerVertifyKeylist.forEach((v, index) => {
      this.keyOwnerInfoList[index] = this.ownerinfo[v] === '' || this.ownerinfo[v] === undefined || this.ownerinfo[v] === null;
    });
    const ownerInfoStatus  = ownerVertifyKeylist.every( v => {
      return (this.ownerinfo[v] !== '' && this.ownerinfo[v] !== undefined && this.ownerinfo[v] !== null);
    });
    if (ownerInfoStatus) {
      if (this.toolSrv.verifyPhone.test(this.ownerinfo.mobilePhone)) {
         if (this.toolSrv.verifyIdNumber.test(this.ownerinfo.idNumber)) {
           this.ownerInfoSetValueToOwnerList();
         } else {
           this.toolSrv.setToast('error', '添加失败', '请输入正确的身份证号');
         }
      } else {
        this.toolSrv.setToast('error', '添加失败', '请输入正确的手机号');
      }
    } else {
      this.toolSrv.setToast('error', '添加失败', '信息未填写完整');
    }
  }

  // 将添加的业主信息set到业主列表中
  public  ownerInfoSetValueToOwnerList(): void {
    // 将业主信息状态转换为可以别的中文格式
    this.ownerinfo.identity = this.toolSrv.setValueToLabel(this.identityOption, this.ownerinfo.identity);
    this.ownerinfo.normalPaymentStatus = this.toolSrv.setValueToLabel(this.normalChargeOption, this.ownerinfo.normalPaymentStatus);
    // 添加业主信息到列表中
    this.ownerList.push(this.ownerinfo);
    this.ownerDialog = false;
    this.ownerinfo = new OwerList();
  }
  // 删除业主列表
  public  deleteOwerMoreClick(e): void {
    this.ownerList.splice(e, 1);
  }

  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '业主资料') {
        this.globalSrv.getChildrenRouter({parentCode: v.parentCode}).subscribe(value => {
          console.log(value);
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

  // 导出文件点击判断
  public  importVacantRoomClick(): void {
      if (this.SearchData.code !== '' || this.SearchData.level !== '') {
         this.importExcalOfVacantRoom();
      } else {
        this.toolSrv.setToast('error', '操作失败', '请先选择请先选择需要导出的小区\\地块\\楼栋');
      }
  }
  // 导出文件
  public  importExcalOfVacantRoom(): void {
      this.toolSrv.setConfirmation('导出', '导出空置房信息', () => {
        this.owerSrv.importFileOfVacantRoom({level: this.SearchData.level, code: this.SearchData.code}).subscribe(
          value => {
            console.log(value);
            if (value.status === '1000') {
              window.open(value.data);
            } else {
              this.toolSrv.setToast('error', '请求错误', value.message);
            }
          }
        );
      });
  }
  // 清除和输出化数据
  public  clearData(): void {
    this.keyRoomInfoList = [false, false, false, false, false, false, false, false, false, false];
    this.vacantRoomSelect = [];
  }
}
