import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GlobalService} from '../../../common/services/global.service';
import {AddRoomBindChargeItem, ModifyRoomBindChargeItem} from '../../../common/model/bf-roomBindChargeItem.model';
import {BfRoomBindChargeitemService} from '../../../common/services/bf-room-bind-chargeitem.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {ThemeService} from '../../../common/public/theme.service';
import {Subscription} from 'rxjs';
import {SharedServiceService} from '../../../common/public/shared-service.service';
import {LocalStorageService} from '../../../common/services/local-storage.service';

@Component({
  selector: 'rbi-bf-roombind-changeitem',
  templateUrl: './bf-roombind-changeitem.component.html',
  styleUrls: ['./bf-roombind-changeitem.component.less']
})
export class BfRoombindChangeitemComponent implements OnInit, OnDestroy {

  @ViewChild('input') input: Input;
  // @ViewChild('file') file: Input;
  public tableOption: any;
  public roombindTableContent: any[];
  public roombindSelect: any;
  public NOW_PAGE = 1;
  // 查询相关
  public searchType = 0;
  public SearchTypeOption  = [
    {label: '手机号', value: 1},
    {label: '房间号', value: 2},
    {label: '业主姓名', value: 3},
    {label: '身份证号', value: 4},
  ];
  public SearchData = {
    villageCode: '',
    regionCode: '',
    buildingCode:  '',
    unitCode: '',
    roomCode: '',
    mobilePhone: '',
    idNumber: '',
    surname: '',
    pageNo: 1,
    pageSize: 10
  };
  public serchData = '';
  // 添加相关
  public roombindAddDialog: boolean;
  public roombindAdd: AddRoomBindChargeItem = new AddRoomBindChargeItem();
  public chargeItemOption: any[] = [];
  // 修改相关
  public roombindModifayDialog: boolean;
  public roombindModify: ModifyRoomBindChargeItem = new ModifyRoomBindChargeItem();
  public roombindDetail: ModifyRoomBindChargeItem = new ModifyRoomBindChargeItem();
  public chargeItemName: any;
  // 详情相关
  public detailOption: any;
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  public esDate: any;
  public loadHidden = true;
  public deleteId: any[] = [];
  public table = {
    tableheader: {background: '', color: ''},
    tableContent: [
      {background: '', color: ''},
      {background: '', color: ''}],
    detailBtn: ''
  };
  // 按钮权限相关
  public btnHiden = [
    {label: '新增', hidden: true},
    {label: '修改', hidden: true},
    {label: '删除', hidden: true},
    // {label: '搜索', hidden: true},
  ];
  public themeSub: Subscription;
  public roomBindChangeItemSub: Subscription;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private roomBindChargeSrv: BfRoomBindChargeitemService,
    private toolSrv: PublicMethedService,
    private globalSrv: GlobalService,
    private localSrv: LocalStorageService,
    private themeSrv: ThemeService,
    private  sharedSrv: SharedServiceService,
  ) {
    this.roomBindChangeItemSub = this.sharedSrv.changeEmitted$.subscribe(
      value => {
        for (const key in value) {
          if (key !== 'data') {
            this.SearchData[key] = value[key];
          }
        }
        this.NOW_PAGE = this.SearchData.pageNo = 1;
        // this.reslveSearchData();
        this.queryRoomBindChargeItemPageData();
    });
    this.themeSub =  this.themeSrv.changeEmitted$.subscribe(
      value => {
        this.table.tableheader = value.table.header;
        this.table.tableContent = value.table.content;
        this.table.detailBtn = value.table.detailBtn;
        this.setTableOption(this.roombindTableContent);
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
      for (const key in this.sharedSrv.SearchData) {
        if (key !== 'data') {
          this.SearchData[key] = this.sharedSrv.SearchData[key];
        }
      }
    }
    this.roombindInitialization();
  }
  ngOnDestroy(): void {
     this.themeSub.unsubscribe();
     this.roomBindChangeItemSub.unsubscribe();
  }
  // initialization houseinfo
  public  roombindInitialization(): void {
    this.loadHidden = false;
    this.roomBindChargeSrv.queryRoomChangeInfoById({}).subscribe(
      value => {
        if (value.status === '1000') {
          value.data.forEach(v => {
            this.chargeItemOption.push({label: v.chargeName, value: v.chargeCode});
          });
          this.queryRoomBindChargeItemPageData();
        }
      }
    );
    this.esDate = this.toolSrv.esDate;
  }

  // condition search click
  // public  roombindSearchClick(): void {
  //   if (this.serchData !== '') {
  //     this.selectSearchType();
  //   } else {
  //     this.toolSrv.setToast('error', '操作错误', '请填写需要搜索的值');
  //   }
  // }
  // 判断搜索方式
  // public  selectSearchType(): void {
  //   switch (this.searchType) {
  //     case 0: this.reslveSearchData();
  //       this.queryRoomBindChargeItemPageData(); break;
  //     case 1: this.setSearData('mobilePhone'); this.SearchData.mobilePhone = this.serchData; this.queryRoomBindChargeItemPageData(); break;
  //     case 2: this.setSearData('roomCode'); this.SearchData.roomCode = this.serchData; this.queryRoomBindChargeItemPageData(); break;
  //     case 3: this.setSearData('surname'); this.SearchData.surname = this.serchData;  this.queryRoomBindChargeItemPageData(); break;
  //     case 4: this.setSearData('idNumber'); this.SearchData.idNumber = this.serchData; this.queryRoomBindChargeItemPageData(); break;
  //     default:
  //       break;
  //   }
  // }
  // 重置数据
  // public  setSearData(label): void {
  //   for (const serchKey in this.SearchData) {
  //     if (serchKey !== label && serchKey !== 'pageSize' && serchKey !== 'pageNo') {
  //       this.SearchData[serchKey] = '';
  //     }
  //   }
  // }
  // 重置搜索条件
  // public  reslveSearchData(): void {
  //   this.SearchData.mobilePhone = '';
  //   this.SearchData.surname = '';
  //   this.SearchData.idNumber = '';
  // }
  // add roombind
  public  roombindAddClick(): void {
    if (this.SearchData.roomCode !== '') {
      this.getUserInfo(this.SearchData);
    } else {
      this.toolSrv.setToast('error', '操作失败', '请先选择房屋');
    }
  }
  // sure add houseinfo
  public  roombindAddSureClick(): void {
    this.toolSrv.setConfirmation('增加', '增加', () => {
      this.loadHidden = false;
      this.roomBindChargeSrv.addRoomChangeInfo(this.roombindAdd).subscribe(
        value => {
          this.loadHidden = true;
          if (value.status === '1000') {
            this.toolSrv.setToast('success', '操作成功', '添加成功');
            this.clearData();
            this.roombindAddDialog = false;
            this.roombindInitialization();
          } else {
            this.toolSrv.setToast('error', '操作失败', value.message);
          }
        });
    });
  }
  // modify roombind
  public roombindModifyClick(): void {
    if (this.roombindSelect === undefined || this.roombindSelect.length === 0 ) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.roombindSelect.length === 1) {
      console.log(this.roombindSelect[0].chargeCode);
      const list = ['villageCode', 'villageName', 'regionCode', 'regionName', 'buildingCode', 'buildingName', 'unitCode', 'unitName',
        'roomCode'];
       for (const ikey of list) {
         this.roombindModify[ikey] = this.roombindSelect[0][ikey];
       }
      this.roombindModify.chargeCode = this.roombindSelect[0].chargeCode;
      // this.chargeItemName = this.roombindModify.chargeCode;
      this.roombindModifayDialog = true;
    } else {
      this.toolSrv.setToast('success', '操作成功', '只能选择一项进行修改');
    }
  }
  // sure modify roombind
  public  roombindModifySureClick(): void {
    this.toolSrv.setConfirmation('修改', '修改', () => {
      this.loadHidden = false;
      this.roomBindChargeSrv.updateRoomChangeInfo(this.roombindModify).subscribe(
        value => {
          this.loadHidden = true;
          if (value.status === '1000') {
            this.roombindModifayDialog = false;
            this.toolSrv.setToast('success', '操作成功', value.message);
            this.roombindInitialization();
            this.clearData();
          } else {
            this.toolSrv.setToast('error', '操作失败', value.message);
          }
        }
      );
    });
  }
  // delete roombind
  public  roombindDeleteClick(): void {
    if (this.roombindSelect === undefined || this.roombindSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.toolSrv.setConfirmation('删除', `删除这${this.roombindSelect.length}项`, () => {
        this.loadHidden = false;
        this.roombindSelect.forEach( v => {
          this.deleteId.push(v.id);
        });
        this.roomBindChargeSrv.deleteRoomChangeInfo({ids: this.deleteId.join(',')}).subscribe(
          value => {
            this.loadHidden = true;
            if (value.status === '1000') {
              this.toolSrv.setToast('success', '操作成功', value.message);
              this.roombindInitialization();
              this.clearData();
            } else {
              this.toolSrv.setToast('error', '操作失败', value.message);
            }
          }
        );
      });
    }
  }
  // Reset data
  public  clearData(): void {
    this.roombindAdd = new AddRoomBindChargeItem();
    this.roombindModify = new ModifyRoomBindChargeItem();
    this.roombindDetail = new ModifyRoomBindChargeItem();
    this.roombindSelect = [];
  }
  // paging query
  public  nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.NOW_PAGE = this.SearchData.pageNo =  event;
    this.queryRoomBindChargeItemPageData();
    }
  // select data (选择数据)
  public  selectData(e): void {
    this.roombindSelect = e;
  }
  // set table data （设置列表数据）
  public  setTableOption(data1): void {
    this.tableOption = {
      width: '101.4%',
      header: {
        data:  [
          {field: 'villageName', header: '小区名称'},
          {field: 'regionName', header: '地块名称'},
          {field: 'buildingName', header: '楼栋名称'},
          {field: 'unitName', header: '单元名称'},
          {field: 'roomCode', header: '房间编号'},
          {field: 'chargeCode', header: '缴费项目'},
          // {field: 'operating', header: '操作'}
        ],
        style: {background: this.table.tableheader.background, color: this.table.tableheader.color, height: '6vh'}
      },
      Content: {
        data: data1,
        styleone: {background: this.table.tableContent[0].background, color: this.table.tableContent[0].color, textAlign: 'center', height: '2vw'},
        styletwo: {background: this.table.tableContent[1].background, color: this.table.tableContent[1].color, textAlign: 'center', height: '2vw'},
      },
      type: 1,
      // tableList:  [{label: '详情', color: this.table.detailBtn}]
    };
  }
  public  queryRoomBindChargeItemPageData(): void {
    this.roomBindChargeSrv.queryRoomChangeInfoPage(this.SearchData).subscribe(
      (val) => {
        console.log(val);
        if (val.status === '1000') {
          val.data.contents.forEach( v => {
            v.chargeCode = this.toolSrv.setValueToLabel(this.chargeItemOption, v.chargeCode);
          });
          this.roombindTableContent = val.data.contens;
          this.setTableOption(val.data.contents);
          this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};
        } else {
          this.toolSrv.setToast('error', '请求错误', val.message);
        }
      }
    );
  }
  // search userInfo
  public getUserInfo(data): void {
    this.globalSrv.queryCouponUserInfo({villageCode: data.villageCode, regionCode: data.regionCode, buildingCode: data.buildingCode, unitCode: data.unitCode , roomCode: data.roomCode}).subscribe(
      value => {
        console.log(value);
        if (value.status === '1000') {
          for (const key in value.data.houseInfo) {
             this.roombindAdd[key] = value.data.houseInfo[key];
          }
          this.roombindAddDialog = true;
        }  else {
          this.toolSrv.setToast('error', '请求错误', value.message);
        }
      }
    );
  }
  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '收费项目配置') {
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
}
