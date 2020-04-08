import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AddBfCoupon, ModifyBfCoupon} from '../../../common/model/bf-coupon.model';
import {DialogModel, FormValue} from '../../../common/components/basic-dialog/dialog.model';
import {FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ConfirmationService, MessageService} from 'primeng/api';
import {GlobalService} from '../../../common/services/global.service';
import {LocalStorageService} from '../../../common/services/local-storage.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {BfCouponService} from '../../../common/services/bf-coupon.service';
import {ThemeService} from '../../../common/public/theme.service';
import {SharedServiceService} from '../../../common/public/shared-service.service';
import {BfHouseService} from '../../../common/services/bf-house.service';
import {BfOwnerService} from '../../../common/services/bf-owner.service';

@Component({
  selector: 'rbi-bf-house',
  templateUrl: './bf-house.component.html',
  styleUrls: ['./bf-house.component.less']
})
export class BfHouseComponent implements OnInit, OnChanges {
  public couponSelect: any[] = [];
  public couponTableContent: any;
  // 查询相关
  public searchOwerData = {
    pageSize: 10,
    pageNo: 1,
    code: '',
    level: '',
    type: '',
  };
  // 状态相关
  public roomStatusOption: any[] = [];
  public renovationStatusOption: any[] = [];
  public roomTypeOption: any[] = [];
  public identityOption: any[] = [];
  // 详情相关
  public houseDetailDialog: boolean;
  public ownerList: any[] = [];
  public owerMoreDetailDetail = [
    {field: 'villageName', label: '小区名称', value: ''},
    {field: 'regionName', label: '地块名称'},
    {field: 'buildingName', label: '楼栋名称', value: ''},
    {field: 'unitName', label: '单元名称', value: ''},
    {field: 'floor', label: '楼层', value: ''},
    {field: 'roomCode', label: '房间号', value: ''},
    {field: 'roomSize', label: '房间大小', value: ''},
    {field: 'roomType', label: '房间类型', value: ''},
    {field: 'renovationStatus', label: '装修状态', value: ''},
    {field: 'renovationDeadline', label: '装修结束时间', value: ''},
    {field: 'renovationStartTime', label: '装修开始时间', value: ''},
    {field: 'startBillingTime', label: '开始计费时间', value: ''},
    {field: 'realRecyclingHomeTime', label: '实际交房时间', value: ''},
  ];
  public ownerDetailTitle = [
    {field: 'surname', header: '姓名'},
    {field: 'idNumber', header: '身份证号'},
    {field: 'identity', header: '身份'},
    {field: 'mobilePhone', header: '电话'},
    {field: 'normalPaymentStatus', header: '是否正常缴费'},
    {field: 'startTime', header: '租房开始时间'},
    {field: 'endTime', header: '租房结束时间'},
    {field: 'remarks', header: '备注'},
  ];

  // 详情里的列表按钮
  public pieBtnList = [
    {label: '新系统缴费统计图', value: 1, color: '#FF8352'},
    {label: '本年缴费统计图', value: 2, color: '#31C5C0'},
    {label: '总缴费统计图', value: 3, color: '#31C5C0'},
  ];
  public pieDatas = [];
  public pieChargeRoomCode: any;
  // 其他相关
  public dialogOption: any;
  public optionTable: any;
  public normalChargeOption: any[] = [];
  public option: any;
  public table = {
    tableheader: {background: '', color: ''},
    tableContent: [
      {background: '', color: ''},
      {background: '', color: ''}],
    detailBtn: ''
  };
  // 按钮显示相关
  public btnHiden = [
    {label: '新增', hidden: true},
    {label: '修改', hidden: true},
    {label: '删除', hidden: true},
    // {label: '搜索', hidden: true},
  ];
  public themeSub: Subscription;
  public ownerSub: Subscription;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private globalSrv: GlobalService,
    private localSrv: LocalStorageService,
    private toolSrv: PublicMethedService,
    private houseSrv: BfHouseService,
    private themeSrv: ThemeService,
    private sharedSrv: SharedServiceService,
    private owerSrv: BfOwnerService,
  ) {
    this.themeSub =  this.themeSrv.changeEmitted$.subscribe(
      value => {
        this.table.tableheader = value.table.header;
        this.table.tableContent = value.table.content;
        this.table.detailBtn = value.table.detailBtn;
        this.setTableOption(this.couponTableContent);
      }
    );
    this.ownerSub = this.sharedSrv.changeEmitted$.subscribe(
      value => {
        this.searchOwerData.level = value.data.level;
        this.searchOwerData.code = value.data.code;
        this.searchOwerData.type = value.data.type;
        this.queryData();
      });
  }
  ngOnInit() {
    this.setBtnIsHidden();
    if (this.themeSrv.setTheme !== undefined) {
      this.table.tableheader = this.themeSrv.setTheme.table.header;
      this.table.tableContent = this.themeSrv.setTheme.table.content;
      this.table.detailBtn = this.themeSrv.setTheme.table.detailBtn;
    }
    this.houseInitialization();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.themeSub.unsubscribe();
  }
  // initialization houseinfo
  public  houseInitialization(): void {
    this.toolSrv.getAdmStatus([{settingType: 'ROOM_TYPE'},
      {settingType: 'ROOM_STATUS'}, {settingType: 'RENOVATION_STATUS'},
      {settingType: 'SEX'}, {settingType: 'NORMAL_PAYMENT_STATUS'}, {settingType: 'IDENTITY'}], (data) => {
      this.roomTypeOption = this.toolSrv.setListMap(data.ROOM_TYPE);
      this.roomStatusOption = this.toolSrv.setListMap(data.ROOM_STATUS);
      this.renovationStatusOption = this.toolSrv.setListMap(data.RENOVATION_STATUS);
      this.identityOption = this.toolSrv.setListMap(data.IDENTITY);
      this.normalChargeOption = this.toolSrv.setListMap(data.NORMAL_PAYMENT_STATUS);
    });
    this.queryData();
  }
  // detail couponInfo (详情信息)
  public  houseDetailClick(e): void {
    this.pieChargeRoomCode = e.roomCode;
    this.houseSrv.getHouseDetailInfo({roomCode: e.roomCode}).subscribe(res => {
      if (res.status === '1000') {
        this.owerMoreDetailDetail = this.owerMoreDetailDetail.map(v => {
          v.value = e[v.field];
          return v;
        });
        this.ownerList =  res.data.owner.map(val => {
          val.roomType = this.toolSrv.setValueToLabel(this.roomTypeOption,  val.roomType);
          val.identity = this.toolSrv.setValueToLabel(this.identityOption, val.identity);
          val.normalPaymentStatus = this.toolSrv.setValueToLabel(this.normalChargeOption, val.normalPaymentStatus);
          return val;
        });
      }
    });
    this.getChargePieData(1);
    this.houseDetailDialog = true;
  }
  // Paging request (分页请求)
  public  nowpageEventHandle(event: any): void {
    this.searchOwerData.pageNo = event;
    this.queryData();
    this.couponSelect = [];
  }
  // clear data (清除数据)
  public  clearData(): void {
    this.couponSelect = [];
    // this.modifyCouponType = null;
    // this.modifyChargeName = null;
    // this.modifyEffectiveTime = null;
    // this.couponModify = new ModifyBfCoupon();
    // this.couponAdd = new AddBfCoupon();
  }
  // Select data （选择数据）
  public  selectData(e): void {
    this.couponSelect = e;
  }
  // set table data （设置列表数据）
  public  setTableOption(data1): void {
    this.optionTable = {
      width: '100%',
      header: {
        data:  [
          {field: 'buildingName', header: '楼栋名称'},
          {field: 'roomCode', header: '房间号'},
          {field: 'roomType', header: '房间类型'},
          {field: 'roomSize', header: '建筑面积'},
          {field: 'roomStatus', header: '房间状态'},
          {field: 'renovationStatus', header: '装修状态'},
          {field: 'startBillingTime', header: '开始计费时间'},
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
  // Paging query data （分页查询数据）
  public  queryData(): void {
    this.houseSrv.getHousePageData(this.searchOwerData).subscribe(
      (values) => {
        if (values.status === '1000') {
          values.data.contents.forEach( item => {
            item.roomStatus  = this.toolSrv.setValueToLabel(this.roomStatusOption, item.roomStatus);
            item.roomType = this.toolSrv.setValueToLabel(this.roomTypeOption, item.roomType);
            item.renovationStatus = this.toolSrv.setValueToLabel(this.renovationStatusOption, item.renovationStatus);
          });
          this.couponTableContent = values.data.contents;
          this.setTableOption(values.data.contents);
          this.option = {total: values.data.totalRecord, row: values.data.pageSize, nowpage:  values.data.pageNo};
        } else {
          this.toolSrv.setToast('error', '查询失败', values.message);
        }
      }
    );
  }
  // 设置按钮显示隐藏
  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '房主资料') {
        this.globalSrv.getChildrenRouter({parentCode: v.parentCode}).subscribe(value => {
          value.data.forEach(res => {
            this.btnHiden.forEach( val => {
              if (res.title === val.label) {
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
    if (index === 1) {
      this.owerSrv.getNewSystemChargeItemToatal({roomCode: this.pieChargeRoomCode}).subscribe(
        value => {
          if (value.status === '1000') {
            this.pieDatas = value.data.filter(v => {
              return v.value !== null && v.value !== 0;
            });
          } else {
            this.toolSrv.setToast('error', '请求失败', value.message);
          }
        }
      );
    } else if (index === 2) {
      this.owerSrv.getYearChargeItemToatal({roomCode: this.pieChargeRoomCode}).subscribe(
        value => {
          if (value.status === '1000') {
            this.pieDatas = value.data.filter(v => {
              return v.value !== null && v.value !== 0;
            });
          } else {
            this.toolSrv.setToast('error', '请求失败', value.message);
          }
        }
      );
    }else {
      this.owerSrv.getTotalChargeItemToatal({roomCode: this.pieChargeRoomCode}).subscribe(
        value => {
          if (value.status === '1000') {
            this.pieDatas = value.data.filter(v => {
              return v.value !== null && v.value !== 0;
            });
          } else {
            this.toolSrv.setToast('error', '请求失败', value.message);
          }
        }
      );
    }
  }
}

