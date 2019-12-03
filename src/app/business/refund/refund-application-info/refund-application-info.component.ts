import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {RefundApplicationInfo} from '../../../common/model/refund-applicationInfo.model';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {RefundService} from '../../../common/services/refund.service';
import {DialogModel, FormValue} from '../../../common/components/basic-dialog/dialog.model';
import {FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ThemeService} from '../../../common/public/theme.service';
import {GlobalService} from '../../../common/services/global.service';
import {LocalStorageService} from '../../../common/services/local-storage.service';

@Component({
  selector: 'rbi-refund-application-info',
  templateUrl: './refund-application-info.component.html',
  styleUrls: ['./refund-application-info.component.less']
})
export class RefundApplicationInfoComponent implements OnInit, OnDestroy {
  public applicationContents: any;
  public applicationInfoSelect: any[];
  public applicationInfoOption: any;
  // 状态值
  public refundStatusOption = [];
  public auditStatusOption = [];
  public chargeTypeOption = [];
  public paymentMethodOption = [];
  // 添加相关
  public applicationInfoAdd: any;
  // 修改相关
  // public applicationInfoModifayDialog: any;
  public modifyApplication: RefundApplicationInfo = new RefundApplicationInfo();
  public optionDialog: DialogModel = new DialogModel();
  public form: FormValue[] = [];
  public formgroup: FormGroup;
  public formdata: any[];
  // 详情相关
  public applicationDetailOption: any;

  public applicationInfoDetailDialog: boolean;
  public option: any;
  public loadHidden = true;
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public nowPage = 1;
  public themeSub: Subscription;
  public table = {
    tableheader: {background: '', color: ''},
    tableContent: [
      {background: '', color: ''},
      {background: '', color: ''}],
    detailBtn: ''
  };
  // 按钮权限相关
  public btnHiden = [
    {label: '修改', hidden: true},
    {label: '删除', hidden: true},
    {label: '搜索', hidden: true},
  ];
  constructor(
    private applicationInfoSrv: RefundService,
    private toolSrv: PublicMethedService,
    private globalSrv: GlobalService,
    private localSrv: LocalStorageService,
    private themeSrv: ThemeService,
  ) {
    this.themeSub =  this.themeSrv.changeEmitted$.subscribe(
      value => {
        this.table.tableheader = value.table.header;
        this.table.tableContent = value.table.content;
        this.table.detailBtn = value.table.detailBtn;
        this.setTableOption(this.applicationContents);
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
    this.applicationInfoInitialization();
  }
  ngOnDestroy(): void {
    this.themeSub.unsubscribe();
  }
  // initialization applicationInfo
  public applicationInfoInitialization(): void {
    this.loadHidden = false;
    this.toolSrv.getAdmStatus([{settingType: 'REFUND_STATUS'}, {settingType: 'AUDIT_STATUS'}, {settingType: 'CHARGE_TYPE'}, {settingType: 'PAYMENT_METHOD'}], (data) => {
       this.refundStatusOption = this.toolSrv.setListMap(data.REFUND_STATUS);
       this.auditStatusOption = this.toolSrv.setListMap(data.AUDIT_STATUS);
       this.chargeTypeOption = this.toolSrv.setListMap(data.CHARGE_TYPE);
       this.paymentMethodOption = this.toolSrv.setListMap(data.PAYMENT_METHOD);
       this.queryApplicationPageData();
    });
  }
  // applicationInfo detail
  public  applicationInfoDeleteClick(e): void {
    this.applicationDetailOption = {
      dialog: true,
      tableHidden: false,
      width: '1000',
      type: 2,
      title: '详情',
      poplist: {
        popContent: e,
        popTitle:  [
          {field: 'organizationName', header: '组织名称'},
          {field: 'villageName', header: '小区名称'},
          {field: 'regionName', header: '地块名称'},
          {field: 'buildingName', header: '楼栋名称'},
          {field: 'unitName', header: '单元名称'},
          {field: 'roomCode', header: '房间编号'},
          {field: 'surname', header: '客户名称'},
          {field: 'roomSize', header: '住房大小'},
          {field: 'chargeName', header: '项目名称'},
          {field: 'actualMoneyCollection', header: '实收金额'},
          {field: 'mortgageAmount', header: '抵扣金额'},
          {field: 'reasonForDeduction', header: '抵扣原因'},
          {field: 'refundableAmount', header: '可退还金额'},
          {field: 'deductionPropertyFee', header: '抵扣物业费金额'},
          {field: 'transferCardAmount', header: '退还银行卡金额'},
          {field: 'chargeUnit', header: '收费单位'},
          {field: 'payerPhone', header: '缴费人手机号'},
          {field: 'paymentMethod', header: '支付方式'},
          {field: 'paymentType', header: '支付类型'},
          {field: 'refundStatus', header: '退款状态'},
          {field: 'startTime', header: '开始时间'},
          {field: 'endTime', header: '结束时间'},
          {field: 'delayTime', header: '延迟时长'},
          {field: 'delayReason', header: '延期原因'},
          {field: 'personLiable', header: '责任人'},
          {field: 'personLiablePhone', header: '责任人电话'},
          {field: 'responsibleAgencies', header: '负责机构'},
          {field: 'remark', header: '申请退款备注 '},
        ],
      }
    };
  }
  // modify applicationInfo
  public applicationInfoModifyClick(): void {
    if (this.applicationInfoSelect === undefined || this.applicationInfoSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.applicationInfoSelect.length === 1) {
      this.modifyApplication = this.applicationInfoSelect[0];
      console.log(this.applicationInfoSelect);
      // this.applicationInfoModifayDialog = true;
      this.modifyApplicationInfo();
    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行修改');
    }
  }
  public  modifyApplicationInfo(): void {
    this.optionDialog = {
      type: 'add',
      title: '修改信息',
      width: '800',
      dialog: true
    };
    const list = ['refundableAmount', 'deductionPropertyFee', 'transferCardAmount'];
    list.forEach(val => {
      this.form.push({key: val, disabled: false, required: true, value: this.applicationInfoSelect[0][val]});
    });
    this.formgroup = this.toolSrv.setFormGroup(this.form);
    console.log(this.formgroup);
    this.formdata = [
      {label: '可退还金额', type: 'input', name: 'refundableAmount', option: '', placeholder: '', disable: true},
      {label: '退还银行卡金额', type: 'input', name: 'transferCardAmount', option: '', placeholder: ''},
      {label: '抵扣物业费金额', type: 'input', name: 'deductionPropertyFee', option: '', placeholder: ''},
    ];
  }
  // clearData
  public clearData(): void {
    this.applicationInfoAdd = null;
    this.applicationInfoSelect = [];
  }
  // Paging request
  public nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.queryApplicationPageData();
  }
  // 查询申请的数据
  public  queryApplicationPageData(): void {
    this.applicationInfoSrv.queryRefundApplicationInfoPage({pageNo: this.nowPage, pageSize: 10}).subscribe(
      value => {
        console.log(value);
        this.loadHidden = true;
        if (value.status === '1000') {
            value.data.contents.forEach( v => {
              v.refundStatus = this.toolSrv.setValueToLabel(this.refundStatusOption, v.refundStatus);
              v.paymentType = this.toolSrv.setValueToLabel(this.chargeTypeOption, v.paymentType);
              v.auditStatus = this.toolSrv.setValueToLabel(this.auditStatusOption, v.auditStatus);
              v.paymentMethod = this.toolSrv.setValueToLabel(this.paymentMethodOption, v.paymentMethod);
            });
            this.applicationContents = value.data.contents;
            this.setTableOption(value.data.contents);
            this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        } else {
          this.toolSrv.setToast('error', '查询失败', value.message);
        }
      }
    );
  }
  // 设置表格
  public  setTableOption(data1): void {
    this.applicationInfoOption = {
      width: '101.4%',
      header: {
        data: [
          {field: 'orderId', header: '订单Id'},
          {field: 'payerName', header: '缴费人姓名'},
          {field: 'paymentMethod', header: '支付方式'},
          {field: 'roomCode', header: '房间编号'},
          {field: 'chargeName', header: '项目名称'},
          {field: 'actualMoneyCollection', header: '实收金额'},
          {field: 'auditStatus', header: '审核状态'},
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
    this.applicationInfoSelect = e;
  }

  public eventClick(e): void {
    if (e === 'false') {
      this.optionDialog.dialog = false;
    } else {
      if (e.invalid === true) {
        for (const eKey in e.value.value) {
            this.modifyApplication[eKey] = e.value.value[eKey];
        }
        console.log(this.modifyApplication);
      }

      console.log(e);
      // this.couponTotalAddSureClick();
    }
  }

  public  btnEvent(e): void {
      this.formgroup = e.value;
      if (e.name === 'transferCardAmount') {
        this.formgroup.patchValue({deductionPropertyFee: e.value.value.refundableAmount - e.value.value.transferCardAmount});
      } else {
        this.formgroup.patchValue({transferCardAmount: e.value.value.refundableAmount - e.value.value.deductionPropertyFee});
      }
      // e.value.value[e.name] + e.
  }

  // 设置按钮显示权限
  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '申请退款') {
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
