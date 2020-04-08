import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Subscription} from 'rxjs';
import {ConfirmationService, MessageService} from 'primeng/api';
import {GlobalService} from '../../../../common/services/global.service';
import {LocalStorageService} from '../../../../common/services/local-storage.service';
import {PublicMethedService} from '../../../../common/public/public-methed.service';
import {BfTollService} from '../../../../common/services/bf-toll.service';
import {ThemeService} from '../../../../common/public/theme.service';
import {SharedServiceService} from '../../../../common/public/shared-service.service';
import {BfTollTitle} from '../../../../common/model/bf-toll.model';

@Component({
  selector: 'rbi-bf-toll-audited',
  templateUrl: './bf-toll-audited.component.html',
  styleUrls: ['./bf-toll-audited.component.less']
})
export class BfTollAuditedComponent implements OnInit, OnChanges {

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
  public parkingSpaceTypeOption: any[] = [];
  public parkingSpacePlaceOption: any[] = [];
  public datedifOption: any[] = [];
  public enableOption: any[] = [];
  // 详情相关
  public tollTitle: BfTollTitle = new BfTollTitle();
  public tollDetailDialog: boolean;
  public detailTollList: any[] = [];
  public TollMoreTitleDetail = [
    {field: 'id', header: '序号'},
    {field: 'areaMin', header: '面积最小值'},
    {field: 'areaMax', header: '面积最大值'},
    {field: 'datedif', header: '缴费月数'},
    {field: 'money', header: '金额'},
    {field: 'discount', header: '折扣'},
    {field: 'parkingSpacePlace', header: '车位地点'},
    {field: 'parkingSpaceType', header: '车位类型'}
  ];
  public detailTollTitle = [
    {field: 'chargeName', name: '项目名称', value: ''},
    {field: 'chargeType', name: '项目类型', value: ''},
    {field: 'chargeUnit', name: '项目单位', value: ''},
    {field: 'chargeStandard', name: '收费单价', value: ''},
    {field: 'refund', name: '是否可退款', value: ''},
    {field: 'enable', name: '启用状态', value: ''},
    {field: 'mustPay', name: '是否必缴', value: ''},
  ];
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
    private tollSrv: BfTollService,
    private themeSrv: ThemeService,
    private sharedSrv: SharedServiceService,
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
    // this.setBtnIsHidden();
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
    this.toolSrv.getAdmStatus([{settingType: 'ENABLED'}], (data) => {
      this.enableOption = this.toolSrv.setListMap(data.ENABLED);
    });
    this.queryData();
  }
  // detail couponInfo (详情信息)
  public  houseDetailClick(e): void {
    this.tollDetailDialog = true;
    this.tollTitle = e;
    this.detailTollTitle.forEach( v => {
      v.value = e[v.field];
    });
    this.getTollDetailInfo(e.chargeCode, 'detail');
  }
  // 收费项目详情信息查询
  public getTollDetailInfo(data, type): void {
    this.tollSrv.getTolldetail({chargeCode: data}).subscribe(
      value => {
        if (value.status === '1000') {
          if (type === 'detail') {
            this.detailTollList = value.data.chargeDetail.map( v => {
              v.datedif = this.toolSrv.setValueToLabel(this.datedifOption, v.datedif);
              v.parkingSpacePlace = this.toolSrv.setValueToLabel(this.parkingSpacePlaceOption, v.parkingSpacePlace);
              v.parkingSpaceType = this.toolSrv.setValueToLabel(this.parkingSpaceTypeOption, v.parkingSpaceType);
              return v;
            });
            this.tollDetailDialog = true;
          }
        } else {
          this.toolSrv.setToast('error', '请求错误', value.message);
        }
      }
    );
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
          {field: 'chargeCode', header: '项目编号'},
          {field: 'chargeName', header: '项目名称'},
          {field: 'chargeType', header: '项目类型'},
          {field: 'chargeStandard', header: '收费单价'},
          {field: 'chargeUnit', header: '收费单位'},
          {field: 'enable', header: '是否启用'},
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
    this.tollSrv.getTollAuditedPageData(this.searchOwerData).subscribe(
      (values) => {
        if (values.status === '1000') {
          values.data.contents.forEach( item => {
            item.enable  = this.toolSrv.setValueToLabel(this.enableOption, item.enable);
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
  // public  setBtnIsHidden(): void {
  //   this.localSrv.getObject('btnParentCodeList').forEach(v => {
  //     if (v.label === '收费项目') {
  //       this.globalSrv.getChildrenRouter({parentCode: v.parentCode}).subscribe(value => {
  //         value.data.forEach(res => {
  //           this.btnHiden.forEach( val => {
  //             if (res.title === val.label) {
  //               val.hidden = false;
  //             }
  //           });
  //         });
  //       });
  //     }
  //   });
  // }
}
