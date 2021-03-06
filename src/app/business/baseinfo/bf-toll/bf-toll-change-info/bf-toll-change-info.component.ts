import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BfTollTitle, ModifyTollDrop, TollMoreInfo} from '../../../../common/model/bf-toll.model';
import {Subscription} from 'rxjs';
import {ConfirmationService, MessageService} from 'primeng/api';
import {GlobalService} from '../../../../common/services/global.service';
import {LocalStorageService} from '../../../../common/services/local-storage.service';
import {PublicMethedService} from '../../../../common/public/public-methed.service';
import {BfTollService} from '../../../../common/services/bf-toll.service';
import {ThemeService} from '../../../../common/public/theme.service';
import {SharedServiceService} from '../../../../common/public/shared-service.service';

@Component({
  selector: 'rbi-bf-toll-change-info',
  templateUrl: './bf-toll-change-info.component.html',
  styleUrls: ['./bf-toll-change-info.component.less']
})
export class BfTollChangeInfoComponent implements OnInit, OnChanges {

  public changeInfoSelect: any[] = [];
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
  public auditStatusOption: any[] = [];
  public mustPayOption: any[] = [];
  public refundOption: any[] = [];
  public chargeTypeOption: any[] = [];
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
    {field: 'firstAuditor', name: '初审人', value: ''},
    {field: 'firstAuditTime', name: '初审时间', value: ''},
    {field: 'secondAuditor', name: '复审人', value: ''},
    {field: 'secondAuditTime', name: '复审时间', value: ''},
  ];
  // 修改相关
  public tollMoreInfo: TollMoreInfo[] = [];
  public moreTollMoreTitle = [
    {field: 'id', header: '序号'},
    {field: 'areaMin', header: '面积最小值'},
    {field: 'areaMax', header: '面积最大值'},
    {field: 'datedif', header: '缴费月数'},
    {field: 'money', header: '金额'},
    {field: 'discount', header: '折扣'},
    {field: 'parkingSpacePlace', header: '车位地点'},
    {field: 'parkingSpaceType', header: '车位类型'},
    {field: 'operating', header: '操作'},
  ];
  public setOptionList = {
    datedif: '',
    parkingSpacePlace: '',
    parkingSpaceType: ''
  };
  // 其他相关
  public dialogOption: any;
  public optionTable: any;
  public normalChargeOption: any[] = [];
  // 修改相关
  public tollModifyDialog: boolean;
  public option: any;
  public table = {
    tableheader: {background: '', color: ''},
    tableContent: [
      {background: '', color: ''},
      {background: '', color: ''}],
    detailBtn: ''
  };
  // 删除
  public ids = [];
  public tollModifyData: ModifyTollDrop = new ModifyTollDrop();
  public tollModifyDatas: ModifyTollDrop[] = [];
  // 按钮显示相关
  public btnHiden = [
    // {label: '新增', hidden: true},
    {label: '修改', hidden: true},
    // {label: '删除', hidden: true},
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
    this.auditedInitialization();
    this.setBtnIsHidden()
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.themeSub.unsubscribe();
  }
  // initialization houseinfo
  public  auditedInitialization(): void {
    this.toolSrv.getAdmStatus([{settingType: 'CHARGE_TYPE'}, {settingType: 'ENABLED'}, {settingType: 'DATEDIF'},
      {settingType: 'PAEKING_SPACE_PLACE'}, {settingType: 'CWLX'}, {settingType: 'AUDIT_STATUS'}, {settingType: 'REFUND'},
      {settingType: 'MUST_PAY'}], (data) => {
      this.parkingSpaceTypeOption = this.toolSrv.setListMap(data.CWLX);
      this.auditStatusOption = this.toolSrv.setListMap(data.AUDIT_STATUS);
      this.datedifOption = this.toolSrv.setListMap(data.DATEDIF);
      this.refundOption = this.toolSrv.setListMap(data.REFUND);
      this.chargeTypeOption = this.toolSrv.setListMap(data.CHARGE_TYPE);
      this.mustPayOption = this.toolSrv.setListMap(data.MUST_PAY);
      this.parkingSpacePlaceOption = this.toolSrv.setListMap(data.PAEKING_SPACE_PLACE);
      this.enableOption = this.toolSrv.setListMap(data.ENABLED);
      this.setOptionList.parkingSpaceType = this.parkingSpaceTypeOption = this.toolSrv.setListMap(data.CWLX);
      this.setOptionList.parkingSpacePlace = this.parkingSpacePlaceOption = this.toolSrv.setListMap(data.PAEKING_SPACE_PLACE);
      this.setOptionList.datedif = this.datedifOption = this.toolSrv.setListMap(data.DATEDIF);
      this.queryData();
    });
  }
  // detail couponInfo (详情信息)
  public  houseDetailClick(e): void {
    this.tollTitle = e;
    this.detailTollTitle.forEach( v => {
      v.value = e[v.field];
    });
    this.getTollDetailInfo(e.code, 'detail');
  }
  // modify toll
  public changeinfoModifyClick(): void {
    if (this.changeInfoSelect === undefined || this.changeInfoSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.changeInfoSelect.length === 1) {
      this.getTollDetailInfo(this.changeInfoSelect[0].code, 'modify');

    } else {
      this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
    }
  }
  // 收费项目详情信息查询
  public getTollDetailInfo(data, type): void {
    this.tollSrv.getAuditTolldetail({code: data}).subscribe(
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
          } else {
            value.data.chargeDetail.forEach( v => {
              this.ids.push(v.id);
            });
            this.tollMoreInfo =   value.data.chargeDetail;
            this.tollTitle = value.data.chargeItem;
            this.tollTitle.chargeType = this.tollTitle.chargeType.toString();
            this.tollTitle.refund = this.tollTitle.refund.toString();
            this.tollTitle.enable = this.tollTitle.enable.toString();
            this.tollTitle.mustPay = this.tollTitle.mustPay.toString();
            this.tollModifyDialog = true;
            // console.log(this.tollMoreInfo);
            this.tollModifyDialog = true;
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
    this.changeInfoSelect = [];
  }
  // clear data (清除数据)
  public  clearData(): void {
    this.changeInfoSelect = [];
    // this.modifyCouponType = null;
    // this.modifyChargeName = null;
    // this.modifyEffectiveTime = null;
    // this.couponModify = new ModifyBfCoupon();
    // this.couponAdd = new AddBfCoupon();
  }
  // delete moreTollMore
  public deleteTollMoreClick(index): void {
    if (index + 1 > this.ids.length) {
      this.tollMoreInfo.splice(index, 1);
    } else {
      this.tollSrv.deleteTollList({id: this.ids[index]}).subscribe(
        value => {
          if (value.status === '1000') {
            this.ids.splice(index, 1);
            this.tollMoreInfo.splice(index, 1);
          } else {
            this.toolSrv.setToast('error', '删除失败', value.message);
          }
        }
      );
    }
  }
  // Add a piece of data
  public addMoreTollClick(): void {
    this.tollMoreInfo.push({
      areaMin: '',
      areaMax: '',
      money: '',
      datedif: '',
      discount: '10',
      parkingSpacePlace: '',
      parkingSpaceType: ''
    });
    this.tollModifyData.datedif = '请选择月数';
    this.tollModifyData.parkingSpaceNature = '请选择车位性质';
    this.tollModifyData.parkingSpaceType = '请选择车位类型';
    this.tollModifyDatas.push(this.tollModifyData);
  }

  // sure modify toll
  public tollModifySureClick(): void {
    this.tollModifyDialog = false;
    const list  = ['chargeName', 'chargeType', 'chargeUnit', 'refund', 'enable', 'mustPay'];
    const passlic = list.some(v => {
      return  this.tollTitle[v] === undefined || this.tollTitle[v] === '' || this.tollTitle[v] === null;
    });
    if (!passlic) {
      this.tollSrv.updateTollChangeInfo({ chargeItem: this.tollTitle, chargeDetail: this.tollMoreInfo}).subscribe(
        value => {
          if (value.status === '1000') {
            this.toolSrv.setToast('success', '操作成功', value.message);
            this.auditedInitialization();
            this.tollModifyDialog = false;
            this.clearData();
          } else {
            this.toolSrv.setToast('error', '操作错误', '修改失败,' + value.message);
          }
        }
      );
    } else {
      this.toolSrv.setToast('error', '操作错误', '带*号的信息未填写完整');
    }
  }
  // Select data （选择数据）
  public  selectData(e): void {
    this.changeInfoSelect = e;
  }
  // set table data （设置列表数据）
  public  setTableOption(data1): void {
    this.optionTable = {
      width: '100%',
      header: {
        data:  [
          // {field: 'chargeCode', header: '项目编号'},
          {field: 'chargeName', header: '项目名称'},
          {field: 'chargeType', header: '项目类型'},
          {field: 'chargeStandard', header: '收费单价'},
          {field: 'chargeUnit', header: '收费单位'},
          {field: 'enable', header: '是否启用'},
          {field: 'applicant', header: '修改申请人'},
          {field: 'applyTime', header: '修改申请时间'},
          {field: 'status', header: '审核状态'},
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
    this.tollSrv.getChangeTollApplicationPageData(this.searchOwerData).subscribe(
      (values) => {
        console.log(values);
        if (values.status === '1000') {
          this.couponTableContent = values.data.contents.map( val => {
            val.enable  = this.toolSrv.setValueToLabel(this.enableOption, val.enable);
            val.status  = this.toolSrv.setValueToLabel(this.auditStatusOption, val.status);
            val.refund = this.toolSrv.setValueToLabel(this.refundOption, val.refund);
            val.chargeType = this.toolSrv.setValueToLabel(this.chargeTypeOption, val.chargeType);
            val.mustPay = this.toolSrv.setValueToLabel(this.mustPayOption, val.mustPay);
            return val;
          });
           // = values.data.contents;
          this.setTableOption(this.couponTableContent);
          this.option = {total: values.data.totalRecord, row: values.data.pageSize, nowpage:  values.data.pageNo};
        } else {
          this.toolSrv.setToast('error', '查询失败', values.message);
        }
      }
    );
  }

  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '收费项目') {
        this.globalSrv.getChildrenRouter({parentCode: v.parentCode}).subscribe(value => {
          value.data.forEach( res => {
            if (res.title === '变动记录') {
              this.globalSrv.getChildrenRouter({parentCode: res.permisCode}).subscribe(val => {
                this.btnHiden.forEach(btnItem => {
                  val.data.forEach(item => {
                    if (item.title === btnItem.label) {
                      btnItem.hidden = false;
                    }
                  });
                });
              });
            }
          });
        });
      }
    });
  }

}
