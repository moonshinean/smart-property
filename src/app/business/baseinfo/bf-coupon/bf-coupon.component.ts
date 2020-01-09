import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AddCoupon, Coupon, ModifyCoupon} from '../../../common/model/charge-coupon.model';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ChargeCouponService} from '../../../common/services/charge-coupon.service';
import {BfCouponService} from '../../../common/services/bf-coupon.service';
import {AddBfCoupon, ModifyBfCoupon} from '../../../common/model/bf-coupon.model';
import {Dropdown} from 'primeng/primeng';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {DialogModel, FormValue} from '../../../common/components/basic-dialog/dialog.model';
import {FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ThemeService} from '../../../common/public/theme.service';
import {GlobalService} from '../../../common/services/global.service';
import {LocalStorageService} from '../../../common/services/local-storage.service';

@Component({
  selector: 'rbi-bf-coupon',
  templateUrl: './bf-coupon.component.html',
  styleUrls: ['./bf-coupon.component.less']
})
export class BfCouponComponent implements OnInit, OnDestroy {
  // @ViewChild('file') file: Input;
  public couponTableTitle: any;
  public couponSelect: ModifyBfCoupon[] = [];
  public couponTableContent: any;
  // 添加相关
  public couponAdd: AddBfCoupon = new AddBfCoupon();
  // public couponAdd: any;
  // 修改相关
  public couponModify: ModifyBfCoupon = new ModifyBfCoupon();
  public optionEnable: any[] = [];

  public optionDialog: DialogModel = new DialogModel();
  public form: FormValue[] = [];
  public formgroup: FormGroup;
  public formdata: any[];
  // public esDate: any;
  // 上传相关
  // public couponUploadFileDialog: boolean;
  // public uploadedFiles: any[] = [];
  // 其他相关
  public dialogOption: any;
  public optionTable: any;

  public cleanTimer: any; // 清除时钟
  public option: any;
  public loadingHide = true;
  public couponTypeData: any[] = [];
  public EffectiveTime: any[] = [];
  public ChargeCodeData: any[] = [];
  public deleteIds: any[] = [];
  public modifyCouponType: any;
  public modifyChargeName: any;
  public modifyEffectiveTime: any;
  public nowPage = 1;
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
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private globalSrv: GlobalService,
    private localSrv: LocalStorageService,
    private toolSrv: PublicMethedService,
    private couponSrv: BfCouponService,
    private themeSrv: ThemeService
  ) {
    this.themeSub =  this.themeSrv.changeEmitted$.subscribe(
      value => {
        this.table.tableheader = value.table.header;
        this.table.tableContent = value.table.content;
        this.table.detailBtn = value.table.detailBtn;
        this.setTableOption(this.couponTableContent);
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
    // this.esDate = this.toolSrv.esDate;
    this.couponInitialization();
  }
  ngOnDestroy(): void {
    this.themeSub.unsubscribe();
  }

  // initialization houseinfo
  public  couponInitialization(): void {
    this.couponTableTitle = [

    ];
    this.loadingHide = false;
    this.toolSrv.getAdmStatus([{settingType: 'ENABLED'}, {settingType: 'COUPON_EFFECTIVE_TIME'},
      {settingType: 'COUPON_TYPE'}, {settingType: 'CHARGE_TYPE'}], (data) => {
      console.log(data);
      this.optionEnable = this.toolSrv.setListMap(data.ENABLED);
      this.couponTypeData = this.toolSrv.setListMap(data.COUPON_TYPE);
      this.ChargeCodeData = this.toolSrv.setListMap(data.CHARGE_TYPE);
      data.COUPON_EFFECTIVE_TIME.forEach( v => {
        if (v.settingName === '0' || v.settingName === 0) {
          this.EffectiveTime.push({label: '无限期', value: v.settingName});
        } else {
          this.EffectiveTime.push({label:  v.settingName === '永久有效' ?  v.settingName : v.settingName + '天', value: v.settingCode});
        }
      });
      this.queryData(this.nowPage);
    });
  }
  // Show add coupon popup window （显示添加优惠卷弹窗）
  public  couponAddClick(): void {
    this.optionDialog = {
      type: 'add',
      title: '优惠卷添加',
      width: '800',
      dialog: true
    };
    const list = ['effectiveTime', 'chargeCode', 'couponType', 'money', 'couponName'];
    list.forEach(val => {
      this.form.push({key: val, disabled: false, required: true, value: ''});
    });
    this.formgroup = this.toolSrv.setFormGroup(this.form);
    this.formdata = [
      {label: '优惠卷名称', type: 'input', name: 'couponName', option: '', placeholder: '请输入优惠卷名称', required: true, disable: false},
      {label: '优惠卷类型', type: 'dropdown', name: 'couponType', option: this.couponTypeData, placeholder: '请选择优惠卷类型', required: true},
      {label: '收费项目', type: 'dropdown', name: 'chargeCode', option: this.ChargeCodeData, placeholder: '请选择收费项目', required: true},
      {label: '有效时长', type: 'dropdown', name: 'effectiveTime', option: this.EffectiveTime, placeholder: '请选择有效时长',  required: true},
      {label: '金额', type: 'input', name: 'money', option: '', placeholder: '请输入金额',  required: true,  disable: false},
    ];
  }
  // sure add coupon （添加确认请求）
  public  couponAddSureClick(data): void {
    console.log(data);
    this.toolSrv.setConfirmation('增加', '增加', () => {
      this.couponSrv.addCoupon(data).subscribe(
        value => {
          this.toolSrv.setToast('success', '操作成功', value.message);
          this.couponAdd = new AddBfCoupon();
          this.optionDialog.dialog = false;
          this.formgroup.reset();
          this.couponInitialization();
          this.clearData();
        }
      );
    });
  }
  // detail couponInfo (详情信息)_
  public  couponDetailClick(e): void {
    // this.couponDetail = e;
    this.optionEnable.forEach( value => {
      if (e.enable.toString() === value.value) {
        e.enable  = value.label;
      }
    });
    if (e.effectiveTime !== '无期限' && !e.effectiveTime.includes('天')) {
      e.effectiveTime = e.effectiveTime + '天';
    }
    this.dialogOption = {
      dialog: true,
      tableHidden: false,
      width: '1000',
      type: 1,
      title: '详情',
      poplist: {
        popContent: e,
        popTitle:  [
          {field: 'chargeCode', header: '收费项目'},
          {field: 'couponName', header: '优惠卷名称'},
          {field: 'couponType', header: '优惠卷类型'},
          {field: 'distributor', header: '发放人'},
          {field: 'money', header: '金额'},
          {field: 'enable', header: '是否可用'},
          {field: 'effectiveTime', header: '有效时间'},
        ],
      }
    };
  }
  // modify coupon （优惠卷修改）
  public couponModifyClick(): void {
    if (this.couponSelect === undefined || this.couponSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');

    } else if (this.couponSelect.length === 1) {
      this.optionEnable.forEach( value => {
        if (this.couponSelect[0].enable === value.label) {
          this.couponSelect[0].enable  = value.value;
        }
      });
      // for (let key in this.couponSelect[0]) {
      //   // this.couponModify[key] = this.couponSelect[0][key];
      // }
      this.optionDialog = {
        type: 'add',
        title: '优惠卷修改',
        width: '800',
        dialog: true
      };
      const list = ['couponName', 'effectiveTime', 'chargeCode', 'couponType', 'money', 'enable'];
      list.forEach(val => {
        this.form.push({key: val, disabled: false, required: true, value: this.couponSelect[0][val]});
      });
      this.formgroup = this.toolSrv.setFormGroup(this.form);
      const enable = this.couponSelect[0].enable === 1 ? '启用' : '禁用';
      this.formdata = [
        {label: '优惠卷名称', type: 'input', name: 'couponName', option: '', placeholder: '请输入优惠卷名称', required: true},
        {label: '优惠卷类型', type: 'dropdown', name: 'couponType', option: this.couponTypeData, placeholder: this.couponSelect[0].couponType, required: true},
        {label: '收费项目', type: 'dropdown', name: 'chargeCode', option: this.ChargeCodeData, placeholder: this.couponSelect[0].chargeCode, required: true},
        {label: '有效时长', type: 'dropdown', name: 'effectiveTime', option: this.EffectiveTime, placeholder:  this.couponSelect[0].effectiveTime, required: true},
        {label: '启用状态', type: 'dropdown', name: 'enable', option: this.optionEnable, placeholder: '' , required: true},
        {label: '金额', type: 'input', name: 'money', option: '', placeholder: '请输入金额', required: true},
      ];
    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行修改');
    }
  }
  // sure modify coupon （确定修改）
  public  couponModifySureClick(data): void {
    console.log(data);
    if  (this.isChinese(data.couponType)) {
      data.couponType = this.toolSrv.setLabelToValue(this.couponTypeData, data.couponType);
    }
    if (this.isChinese(data.chargeCode)) {
      data.chargeCode = this.toolSrv.setLabelToValue(this.ChargeCodeData, data.chargeCode);
    }
    if (data.effectiveTime.includes('天')) {
      data.effectiveTime = data.effectiveTime.substring(0, data.effectiveTime.indexOf('天'));
    } else {
      data.effectiveTime = '0';
    }
    this.toolSrv.setConfirmation('修改', '修改', () => {
      this.couponSrv.updateCoupon(data).subscribe(
        value => {
          if (value.status === '1000') {
            this.toolSrv.setToast('success', '操作成功', value.message);
            this.couponInitialization();
            this.optionDialog.dialog = false;
            this.clearData();
          } else {
            this.toolSrv.setToast('error', '修改失败', value.message);
          }
        }
      );
    });
  }
  // delete coupon （删除优惠卷）
  public  couponDeleteClick(): void {
    if (this.couponSelect === undefined || this.couponSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.toolSrv.setConfirmation('删除', `删除这${this.couponSelect.length}项`, () => {
        this.couponSelect.forEach( v => {
          this.deleteIds.push({id: v.id});
        });
        this.couponSrv.deleteCoupon({data: this.deleteIds}).subscribe(
          (val) => {
            if (val.status === '1000') {
              this.toolSrv.setToast('success', '操作成功', '删除成功');
              this.couponInitialization();
              this.clearData();
            } else {
              this.toolSrv.setToast('error', '删除失败', val.message);
            }
          }
        );
      });
    }
  }
  // Paging request (分页请求)
  public  nowpageEventHandle(event: any): void {
    this.loadingHide = false;
    this.nowPage = event;
    this.queryData(this.nowPage);
    this.couponSelect = [];
  }
  // clear data (清除数据)
  public  clearData(): void {
    this.couponSelect = [];
    this.modifyCouponType = null;
    this.modifyChargeName = null;
    this.modifyEffectiveTime = null;
    this.couponModify = new ModifyBfCoupon();
    this.couponAdd = new AddBfCoupon();
  }
  // Determine if it is Chinese （判断是否为中文）
  public  isChinese(s): any {
   if (s[0] >= '\u4e00' && s[0] <= '\u9fa5') {
     return true;
   } else {
     return false;
   }
  }
  // Select data （选择数据）
  public  selectData(e): void {
      this.couponSelect = e;
  }
  // set table data （设置列表数据）
  public  setTableOption(data1): void {
    this.optionTable = {
      width: '101%',
      header: {
        data:  [
          {field: 'chargeCode', header: '收费项目名称'},
          // {field: 'couponCode', header: '优惠券编号'},
          {field: 'couponName', header: '优惠券名称'},
          {field: 'effectiveTime', header: '有效时长'},
          {field: 'money', header: '金额'},
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
  public  queryData(data): void {
    this.couponSrv.queryCouponPagination({pageNo: data, pageSize: 10 }).subscribe(
      (values) => {
        console.log(values);
        this.loadingHide = true;
        if (values.status === '1000') {
          values.data.contents.forEach( item => {
            item.couponType  = this.toolSrv.setValueToLabel(this.couponTypeData, item.couponType);
            item.chargeCode = this.toolSrv.setValueToLabel(this.ChargeCodeData, item.chargeCode);
            item.enable = this.toolSrv.setValueToLabel(this.optionEnable, item.enable);
            // if (item.effectiveTime !== '无限期') {
            //   item.effectiveTime = item.effectiveTime + '天';
            item.effectiveTime = (item.effectiveTime === '0') ? '无期限' : item.effectiveTime + '天';
            // }
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
  // Popup event （弹窗事件）
  public  eventClick(e): void {
    if (e === 'false') {  // 取消关闭弹窗
        this.optionDialog.dialog = false;
        this.couponSelect = [];
    } else {  // 确认 提交数据
      if (e.invalid) { // 判断必填信息是否填满
        if (e.type === '优惠卷添加') {
          for (const key in e.value.value) {
            this.couponAdd[key] = e.value.value[key];
          }
          // console.log(this.couponAdd);
          this.couponAddSureClick(this.couponAdd);
        } else {
          for (const key in e.value.value) {

            this.couponModify[key] = e.value.value[key];
            console.log(this.couponModify[key]);

          }
          console.log(this.couponModify);
          this.couponModifySureClick(this.couponModify);
        }
      } else {
        this.toolSrv.setToast('error', '操作错误', '带*号的信息未填写完整');
      }
      // if ()
    }
  }
  // 设置按钮显示隐藏
  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '优惠券') {
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
