import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
// import {Addinfo, Modifyinfo, info} from '../../../common/model/bf-info.model';
import {ConfirmationService, MessageService} from 'primeng/api';
// import {BfinfoService} from '../../../common/services/bf-info.service';
import {GlobalService} from '../../../common/services/global.service';
import {AddressInfo} from 'dgram';
import {AddRefundInfo, ModifyRefundInfo, RefundInfo, SearchRefundInfo} from '../../../common/model/refund-info.model';
import {DatePipe} from '@angular/common';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {RefundService} from '../../../common/services/refund.service';
import {ThemeService} from '../../../common/public/theme.service';
import {Subscription} from 'rxjs';
import {LocalStorageService} from '../../../common/services/local-storage.service';
import {SharedServiceService} from '../../../common/public/shared-service.service';

@Component({
  selector: 'rbi-refund-info',
  templateUrl: './refund-info.component.html',
  styleUrls: ['./refund-info.component.less']
})
export class RefundInfoComponent implements OnInit, OnDestroy {

  public infoTableContent: any;
  public refundInfoOption: any;
  public infoTableTitleStyle: any;
  public infoSelect: any[];
  // 添加相关
  public infoAddDialog: boolean;
  public infoAdd: AddRefundInfo = new AddRefundInfo();

  public chargeTypeOption = [];
  public paymentMethodOption = [];
  public refundStatusOption = [];

  public ChargetTypeName: any;
  public ChargeSelectOption = [];
  public ChargetOption = [];
  // public Statusoption: any;
  // 修改相关
  public infoModifayDialog: boolean;
  public infoModify: ModifyRefundInfo = new ModifyRefundInfo();
  // 详情相关
  public infoDetailOption: any;
  public infoDetailDialog: boolean;
  public infoDetail: ModifyRefundInfo = new ModifyRefundInfo();
  public refundStatusDetail: any;
  public paymentTypeDetail: any;
  // 条件查询
  public searchRefundInfo: SearchRefundInfo = new SearchRefundInfo();
  public SearchOption = {
    village: [],
    region: [],
    building: [],
    unit: [],
    room: []
  };
  public deleteIds: any[] = [];
  public option: any;
  public loadHidden = true;
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public nowPage = 1;
  public esDate: any;
  public roonCodeSelectOption: any[] = [];
  // 按钮权限相关
  public btnHiden = [
    {label: '新增', hidden: true},
    {label: '修改', hidden: true},
    {label: '删除', hidden: true},
    {label: '搜索', hidden: true},
  ];
  public auditStatusOption = [];

  // 搜索相关
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
  public searchOption = [
    {label: '手机号', value: 1},
    {label: '房间号', value: 2},
    {label: '姓名', value: 3},
    {label: '身份证号', value: 4},
  ];
  public searchType = 0;
  public searchData = '';
  // 订阅主题
  public themeSub: Subscription;
  // 树结构订阅
  public refundSub: Subscription;
  public table = {
    tableheader: {background: '', color: ''},
    tableContent: [
      {background: '', color: ''},
      {background: '', color: ''}],
    detailBtn: ''
  };
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private infoSrv: RefundService,
    private toolSrv: PublicMethedService,
    private globalSrv: GlobalService,
    private localSrv: LocalStorageService,
    private sharedSrv: SharedServiceService,
    private datePipe: DatePipe,
    private themeSrv: ThemeService,
  ) {
    this.themeSub =  this.themeSrv.changeEmitted$.subscribe(
      value => {
        this.table.tableheader = value.table.header;
        this.table.tableContent = value.table.content;
        this.table.detailBtn = value.table.detailBtn;
        this.setTableOption(this.infoTableContent);
      }
    );
    this.refundSub = this.sharedSrv.changeEmitted$.subscribe(
      value => {
        for (const key in value) {
          if (key !== 'data') {
            this.SearchData[key] = value[key];
          }
        }
        this.nowPage = this.SearchData.pageNo = 1;
        this.reslveSearchData();
        this.queryPageData();
      }
    );
  }

  ngOnInit() {
    this.setBtnIsHidden();
    if (this.sharedSrv.SearchData !== undefined){
      for (const key in this.sharedSrv.SearchData) {
        if (key !== 'data') {
          this.SearchData[key] = this.sharedSrv.SearchData[key];
        }
      }
    }
    if (this.themeSrv.setTheme !== undefined) {
      this.table.tableheader = this.themeSrv.setTheme.table.header;
      this.table.tableContent = this.themeSrv.setTheme.table.content;
      this.table.detailBtn = this.themeSrv.setTheme.table.detailBtn;
    }
    this.esDate = this.toolSrv.esDate;
    this.infoInitialization();
  }
  ngOnDestroy(): void {
    this.themeSub.unsubscribe();
    this.refundSub.unsubscribe();
  }
  // initialization info
  public infoInitialization(): void {
    this.toolSrv.getAdmStatus([{settingType: 'PAYMENT_METHOD'}, {settingType: 'AUDIT_STATUS'}, {settingType: 'CHARGE_TYPE'}, {settingType: 'REFUND_STATUS'}, {settingType: 'PARMENT_TYPE'}], (data) => {
        this.chargeTypeOption = this.toolSrv.setListMap(data.CHARGE_TYPE);
        this.paymentMethodOption = this.toolSrv.setListMap(data.PAYMENT_METHOD);
        this.refundStatusOption = this.toolSrv.setListMap(data.REFUND_STATUS);
        this.auditStatusOption = this.toolSrv.setListMap(data.AUDIT_STATUS);
        this.queryPageData();
    });
    this.globalSrv.queryVillageInfo({}).subscribe(
      (data) => {
        data.data.forEach(v => {
          this.SearchOption.village.push({label: v.villageName, value: v.villageCode});

        });
      }
    );
    // this.infoTableTitleStyle = {background: '#282A31', color: '#DEDEDE', height: '6vh'};
  }
  // condition search 条件搜索）
  public  infoSearchClick(): void {
    this.nowPage = this.SearchData.pageNo = 1;
    if (this.searchData !== '') {
      this.selectSearchType();
    } else {
      this.toolSrv.setToast('error', '操作错误', '请填写需要搜索的值');
    }
  }
  // 判断搜索方式
  public  selectSearchType(): void {
    switch (this.searchType) {
      case 0: this.reslveSearchData();
              this.queryPageData(); break;
      case 1: this.setSearData('mobilePhone'); this.SearchData.mobilePhone = this.searchData; this.queryPageData(); break;
      case 2: this.setSearData('roomCode'); this.SearchData.roomCode = this.searchData; this.queryPageData(); break;
      case 3: this.setSearData('surname'); this.SearchData.surname = this.searchData;  this.queryPageData(); break;
      case 4: this.setSearData('idNumber'); this.SearchData.idNumber = this.searchData; this.queryPageData(); break;
      default:
        break;
    }
  }
  // 重置数据
  public  setSearData(label): void {
    for (const serchKey in this.SearchData) {
      if (serchKey !== label && serchKey !== 'pageSize' && serchKey !== 'pageNo') {
        this.SearchData[serchKey] = '';
      }
    }
  }
  // 重置搜索条件
  public  reslveSearchData(): void {
    this.SearchData.mobilePhone = '';
    this.SearchData.surname = '';
    this.SearchData.idNumber = '';
  }
  // query region
  public VillageChange(e): void {
    // console.log(this.test);
    this.loadHidden = false;
    this.SearchOption.region = [];
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.searchRefundInfo.villageCode = e.value;
    this.searchRefundInfo.buildingCode = '';
    this.searchRefundInfo.regionCode = '';
    this.searchRefundInfo.unitCode = '';
    this.searchRefundInfo.roomCode = '';
    this.infoAdd.villageName = e.originalEvent.target.innerText;
    this.infoModify.villageName = e.originalEvent.target.innerText;
    this.globalSrv.queryRegionInfo({villageCode: e.value}).subscribe(
      (value) => {
        value.data.forEach(v => {
          this.loadHidden = true;
          this.SearchOption.region.push({label: v.regionName, value: v.regionCode});
        });
      }
    );
  }
  // query building
  public regionChange(e): void {
    this.loadHidden = false;
    this.SearchOption.unit = [];
    this.infoAdd.regionName = e.originalEvent.target.innerText;
    this.infoModify.regionName = e.originalEvent.target.innerText;
    this.searchRefundInfo.regionCode = e.value;
    this.searchRefundInfo.buildingCode = '';
    this.searchRefundInfo.unitCode = '';
    this.searchRefundInfo.roomCode = '';
    this.globalSrv.queryBuilingInfo({regionCode: e.value}).subscribe(
      (value) => {
        value.data.forEach(v => {
          this.SearchOption.building.push({label: v.buildingName, value: v.buildingCode});
        });
        this.loadHidden = true;

      }
    );
  }
  // query unit
  public buildingChange(e): void {
    this.SearchOption.unit = [];
    this.infoAdd.buildingName = e.originalEvent.target.innerText;
    this.searchRefundInfo.buildingCode = e.value;
    this.searchRefundInfo.unitCode = '';
    this.searchRefundInfo.roomCode = '';
    this.globalSrv.queryunitInfo({buildingCode: e.value}).subscribe(
      (value) => {
        value.data.forEach(v => {
          this.SearchOption.unit.push({label: v.unitName, value: v.unitCode});
        });
      }
    );
  }
  // query roomCode
  public unitChange(e): void {
    this.infoAdd.unitName = e.originalEvent.target.innerText;
    this.searchRefundInfo.unitCode = e.value;
    this.searchRefundInfo.roomCode = '';
    this.infoSrv.queryRoomCode({unitCode: e.value}).subscribe(
      value => {
        value.data.forEach( v => {
          this.roonCodeSelectOption.push({label: v.roomCode, value: v.roomCode});
          this.SearchOption.room.push({label: v.roomCode, value: v.roomCode});
        });
      }
    );
  }
  // search userInfo
  public getUserInfo(): void {
    if (this.infoAdd.mobilePhone !== null) {
      this.infoSrv.quertyUserInfo({mobilePhone: this.infoAdd.mobilePhone}).subscribe(
        value => {
          if (value.status === '1000') {
            this.infoAdd.surname = value.data.surname;
            this.infoAdd.userId = value.data.userId;
          } else {
            this.toolSrv.setToast('error', '请求错误', value.message);
          }
        }
      );
    }
  }
  // Charge item selection
  public  chargeSelectChange(e): void {
    this.infoAdd.chargeCode = e.value;
    this.ChargetOption.forEach( v => {
      if (e.value.toString() === v.value.toString()) {
        this.infoAdd.chargeName = v.label;
        this.infoAdd.chargeUnit = v.chargeUnit;
        this.infoAdd.chargeType = v.chargeType;
        this.infoAdd.chargeStandard = v.chargeStandard;
        this.infoModify.chargeName = v.label;
        this.infoModify.chargeUnit = v.chargeUnit;
        this.infoModify.chargeType = v.chargeType;
        this.infoModify.chargeStandard = v.chargeStandard;
      }
    });

  }
  // add info
  public infoAddClick(): void {
    if (this.SearchData.roomCode !== ''){
      this.infoAddDialog = true;
    }else {
      this.toolSrv.setToast('error', '操作失败', '请先选择房屋');
    }
  }
  // sure add info
  public infoAddSureClick(): void {
    this.toolSrv.setConfirmation('增加', '增加', () => {
      this.loadHidden = false;
      this.infoAdd.startTime = this.datePipe.transform(this.infoAdd.startTime, 'yyyy-MM-dd');
      this.infoAdd.dueTime = this.datePipe.transform(this.infoAdd.dueTime, 'yyyy-MM-dd');
      this.infoSrv.addRefundInfo(this.infoAdd).subscribe(
        value => {
          this.loadHidden = true;
          if (value.status === '1000') {
            this.toolSrv.setToast('success', '操作成功', value.message);
            this.clearData();
            this.infoAddDialog = false;
            this.infoInitialization();
          } else  {
            this.toolSrv.setToast('error', '操作失败', value.message);

          }
        }
      );
    });
  }
  //  info detail
  public infoDetailClick(e): void {
    this.infoDetailOption = {
      dialog: true,
      tableHidden: false,
      width: '1000',
      type: 2,
      title: '详情',
      poplist: {
        popContent: e,
        popTitle:  [
          {field: 'villageName', header: '小区名称'},
          {field: 'regionName', header: '地块名称'},
          {field: 'buildingName', header: '楼宇名称'},
          {field: 'unitName', header: '单元名称'},
          {field: 'roomCode', header: '房间编号'},
          {field: 'roomSize', header: '住房面积'},
          {field: 'surname', header: '客户姓名'},
          {field: 'mobilePhone', header: '客户电话'},


          {field: 'chargeName', header: '项目名称'},
          {field: 'actualMoneyCollection', header: '实收金额'},
          {field: 'paymentMethod', header: '支付方式'},
          {field: 'refundStatus', header: '退款状态'},
          {field: 'auditStatus', header: '审核状态'},

          {field: 'startTime', header: '装修开始时间'},
          {field: 'endTime', header: '装修结束时间'},
          {field: 'personLiable', header: '责任人'},
          {field: 'personLiablePhone', header: '责任人电话'},
          {field: 'responsibleAgencies', header: '负责机构'},

          {field: 'reasonForDeduction', header: '抵扣原因'},
          {field: 'delayReason', header: '延期原因'},

          {field: 'mortgageAmount', header: '被扣金额'},
          {field: 'refundableAmount', header: '可退金额'},
          {field: 'transferCardAmount', header: '退还银行卡金额'},
          {field: 'deductionPropertyFee', header: '抵扣物业费金额'},

          {field: 'deductibleMoney', header: '可抵扣金额'},
          {field: 'deductibledMoney', header: '已抵扣金额'},
          {field: 'surplusDeductibleMoney', header: '剩余可抵扣金额'},
          {field: 'deductionRecord', header: '抵扣记录'},
          {field: 'remark', header: '备注'},

        ],
      }
    };
  }
  // modify info
  public infoModifyClick(): void {
    if (this.infoSelect === undefined || this.infoSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.infoSelect.length === 1) {
      this.infoModify = this.infoSelect[0];
      console.log(this.infoModify.refundStatus);
      if (this.infoModify.refundStatus === '未退') {
        this.infoSrv.quertyChargeInfo({}).subscribe(
          value => {
            if (value.data.length !== 0) {
              value.data.forEach(v => {
                this.ChargetOption.push({label: v.chargeName, value: v.chargeCode, chargeUnit: v.chargeUnit, chargeType: v.chargeType, chargeStandard: v.chargeStandard, refund: v.refund });
                this.ChargeSelectOption.push({label: v.chargeName, value: v.chargeCode});
              });
            }
          }
        );
        this.globalSrv.queryRegionInfo({villageCode: this.infoModify.villageCode}).subscribe(
          (value) => {
            value.data.forEach(v => {
              this.loadHidden = true;
              this.SearchOption.region.push({label: v.regionName, value: v.regionCode});
            });
          }
        );
        this.globalSrv.queryBuilingInfo({regionCode: this.infoModify.regionCode}).subscribe(
          (value) => {
            value.data.forEach(v => {
              this.SearchOption.building.push({label: v.buildingName, value: v.buildingCode});
            });
            this.loadHidden = true;

          }
        );
        this.globalSrv.queryunitInfo({buildingCode: this.infoModify.buildingCode}).subscribe(
          (value) => {
            value.data.forEach(v => {
              this.SearchOption.unit.push({label: v.unitName, value: v.unitCode});
            });
          }
        );
        this.infoSrv.queryRoomCode({unitCode: this.infoModify.unitCode}).subscribe(
          value => {
            value.data.forEach( v => {
              this.roonCodeSelectOption.push({label: v.roomCode, value: v.roomCode});
            });
          }
        );
        this.infoModifayDialog = true;
      } else {
        this.toolSrv.setToast('error', '操作错误', '改订单正在退款中或已退款,不能修改');
      }
    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行修改');
    }
  }
  // sure modify info
  public infoModifySureClick(): void {
    this.toolSrv.setConfirmation('修改', '修改', () => {
      this.infoModify.refundStatus = this.toolSrv.setLabelToValue(this.refundStatusOption, this.infoModify.refundStatus);
      this.infoModify.paymentMethod = this.toolSrv.setLabelToValue(this.paymentMethodOption, this.infoModify.paymentMethod);
      this.infoModify.startTime = this.datePipe.transform(this.infoModify.startTime, 'yyyy-MM-dd');
      this.infoModify.dueTime = this.datePipe.transform(this.infoModify.dueTime, 'yyyy-MM-dd');
      this.infoSrv.updateRefundInfo(this.infoModify).subscribe(
        value => {
          if (value.status === '1000') {
            this.toolSrv.setToast('success', '操作成功', '修改成功');
            this.infoModifayDialog = false;
            this.clearData();
            this.infoInitialization();
          } else {
            this.infoModify.refundStatus = this.toolSrv.setValueToLabel(this.refundStatusOption, this.infoModify.refundStatus);
            this.infoModify.paymentMethod = this.toolSrv.setValueToLabel(this.paymentMethodOption, this.infoModify.paymentMethod);
            this.toolSrv.setToast('error', '操作失败', value.message);
          }
        }
      );
    });
  }
  // delete info
  public infoDeleteClick(): void {
    if (this.infoSelect === undefined || this.infoSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.toolSrv.setConfirmation('删除', '删除' + this.infoSelect.length + '项', () => {
        this.infoSelect.forEach( v => {
          this.deleteIds.push(v.id);
        });
        this.infoSrv.deleteRefundInfo({ids: this.deleteIds.join(',')}).subscribe(
          value => {
            if (value.status === '1000' ) {
              this.toolSrv.setToast('success', '操作成功', value.message);
              this.clearData();
              this.infoInitialization();
            } else {
              this.toolSrv.setToast('error', '操作失败', value.message);

            }
          }
        );
      });
    }
  }
  public clearData(): void {
    this.infoAdd = new AddRefundInfo();
    this.infoModify = new ModifyRefundInfo();
    this.infoSelect = [];
    // this.ChargeSelectOption = [];
    // this.ChargetOption = [];
    this.ChargetTypeName = null;
    this.SearchOption = {
      village: [],
      region: [],
      building: [],
      unit: [],
      room: []
    };
  }
  // paging query
  public nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.selectSearchType();
  }
  public queryPageData(): void {
    this.infoSrv.queryRefundInfoPage(this.SearchData).subscribe(
      val => {
        // console.log(val);
        this.loadHidden = true;
        if (val.status === '1000') {
            val.data.contents.forEach( v => {
              if (this.isOrNull(v.refundStatus)) {
                v.refundStatus = this.toolSrv.setValueToLabel(this.refundStatusOption, v.refundStatus);
              }
              if (this.isOrNull(v.paymentMethod)) {
                v.paymentMethod = this.toolSrv.setValueToLabel(this.paymentMethodOption, v.paymentMethod);

              }
              if (this.isOrNull(v.paymentType)) {
                v.paymentType = this.toolSrv.setValueToLabel(this.chargeTypeOption, v.paymentType);

              }
              if (this.isOrNull(v.auditStatus)) {
                v.auditStatus = this.toolSrv.setValueToLabel(this.auditStatusOption, v.auditStatus);
              }
            });
            this.infoTableContent = val.data.contents;
            this.setTableOption(val.data.contents);
            this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};
        } else {
          this.toolSrv.setToast('error', '请求失败', val.message);
        }
      }
    );
  }
  public  isOrNull(data: any): boolean {
      return (data !== null && data !== '' && data !== undefined);
  }

  // 设置表格
  public  setTableOption(data1): void {
    this.refundInfoOption = {
      width: '101.4%',
      header: {
        data:   [
          // {field: 'orderId', header: '订单Id'},
          {field: 'chargeName', header: '项目名称'},
          {field: 'roomCode', header: '房间编号'},
          {field: 'surname', header: '客户姓名'},
          {field: 'refundStatus', header: '退款状态'},
          {field: 'auditStatus', header: '审核状态'},

          {field: 'actualMoneyCollection', header: '实收金额'},
          {field: 'transferCardAmount', header: '退还银行卡金额'},
          {field: 'deductionPropertyFee', header: '抵扣物业费金额'},
          {field: 'deductibledMoney', header: '已抵扣金额'},
          {field: 'surplusDeductibleMoney', header: '剩余可抵扣金额'},
          // {field: 'payerName', header: '缴费人姓名'},
          {field: 'paymentMethod', header: '支付方式'},
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

  // info select
  public  selectData(e): void {
    this.infoSelect = e;
  }

  // 设置按钮显示权限
  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '退款信息') {
        this.globalSrv.getChildrenRouter({parentCode: v.parentCode}).subscribe(value => {
          value.data.forEach( item => {
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
