import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AddCoupon, Coupon, ModifyCoupon} from '../../../common/model/charge-coupon.model';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ChargeCouponService} from '../../../common/services/charge-coupon.service';
import {BfCouponService} from '../../../common/services/bf-coupon.service';
import {AddBfCoupon, ModifyBfCoupon} from '../../../common/model/bf-coupon.model';
import {Dropdown} from 'primeng/primeng';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {DialogModel, FormValue} from '../../../common/components/basic-dialog/dialog.model';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'rbi-bf-coupon',
  templateUrl: './bf-coupon.component.html',
  styleUrls: ['./bf-coupon.component.less']
})
export class BfCouponComponent implements OnInit {
  // @ViewChild('file') file: Input;
  public couponTableTitle: any;
  public couponSelect: ModifyBfCoupon[] = [];
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
  public couponSeachData: any;
  public couponTypeData: any[] = [];
  public EffectiveTime: any[] = [];
  public ChargeCodeData: any[] = [];
  public deleteIds: any[] = [];
  public modifyCouponType: any;
  public modifyChargeName: any;
  public modifyEffectiveTime: any;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private toolSrv: PublicMethedService,
    private couponSrv: BfCouponService
  ) { }
  ngOnInit() {
    // this.esDate = this.toolSrv.esDate;
    this.couponInitialization();
  }

  // initialization houseinfo
  public  couponInitialization(): void {
    this.couponTableTitle = [
      {field: 'chargeCode', header: '收费项目名称'},
      // {field: 'couponCode', header: '优惠券编号'},
      {field: 'couponName', header: '优惠券名称'},
      {field: 'effectiveTime', header: '有效时长'},
      {field: 'money', header: '金额'},
      {field: 'operating', header: '操作'}
    ];
    this.loadingHide = false;
    this.queryData(1);
    this.couponSrv.queryEffectiveTime({}).subscribe(
      value => {
        value.data.forEach( v => {
          if (v.settingName === '0') {
            this.EffectiveTime.push({label: '无限期', value: v.settingName});
          } else {
            this.EffectiveTime.push({label:  v.settingName + '天', value: v.settingName});
          }
        });
      }
    );
    this.toolSrv.getAdminStatus('ENABLED', (data) => {
      if (data.length > 0) {
        this.toolSrv.setDataFormat(data, '' , (list, label) => {
          this.optionEnable = list;
        });
      }
    });
  }
  // condition search click
  public  couponSearchClick(): void {
    // @ts-ignore
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
      {label: '优惠卷名称', type: 'input', name: 'couponName', option: '', placeholder: '请输入优惠卷名称'},
      {label: '优惠卷类型', type: 'dropdown', name: 'couponType', option: this.couponTypeData, placeholder: '请选择优惠卷类型'},
      {label: '收费项目', type: 'dropdown', name: 'chargeCode', option: this.ChargeCodeData, placeholder: '请选择收费项目'},
      {label: '有效时长', type: 'dropdown', name: 'effectiveTime', option: this.EffectiveTime, placeholder: '请选择有效时长'},
      {label: '金额', type: 'input', name: 'money', option: '', placeholder: '请输入金额'},
    ];
  }
  // sure add coupon （添加确认请求）
  public  couponAddSureClick(data): void {
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
      this.couponModify = this.couponSelect[0];
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
        {label: '优惠卷名称', type: 'input', name: 'couponName', option: '', placeholder: '请输入优惠卷名称'},
        {label: '优惠卷类型', type: 'dropdown', name: 'couponType', option: this.couponTypeData, placeholder: this.couponSelect[0].couponType},
        {label: '收费项目', type: 'dropdown', name: 'chargeCode', option: this.ChargeCodeData, placeholder: this.couponSelect[0].chargeCode},
        {label: '有效时长', type: 'dropdown', name: 'effectiveTime', option: this.EffectiveTime, placeholder:  this.couponSelect[0].effectiveTime},
        {label: '启用状态', type: 'dropdown', name: 'enable', option: this.optionEnable, placeholder: enable },
        {label: '金额', type: 'input', name: 'money', option: '', placeholder: '请输入金额'},
      ];
    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行修改');
    }
  }
  // sure modify coupon （确定修改）
  public  couponModifySureClick(data): void {
    if  (this.isChinese(data.couponType)) {
      data.couponType = this.setDataValue(this.couponTypeData, data.couponType);
    }
    if (this.isChinese(data.chargeCode)) {
      data.chargeCode = this.setDataValue(this.ChargeCodeData, data.chargeCode);
    }
    if (data.effectiveTime.includes('天')) {
      data.effectiveTime = data.effectiveTime.substring(0, data.effectiveTime.indexOf('天'));
    }
    // console.log(data);
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
    this.queryData(event);
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
    // this.addcouponType.selectedOption = null;
    // this.addChargeCode.selectedOption = null;
    // this.addEffectiveTime.selectedOption = null;
    // this.modifycouponType.selectedOption = null;
    // this.modifychargeCode.selectedOption = null;
    // this.modifyeffectiveTime.selectedOption = null;
  }
  // Convert status values to Chinese names  （状态值转换为中文名）
  public setDataName(list, label): any {
      list.forEach( v => {
        if ( label === v.value ) {
          label = v.label;
        }
      });
      return label;
  }
  // Chinese name converted to status value （中文名转换为状态值）
  public setDataValue(list, label): any {
    list.forEach( v => {
      if ( label === v.label) {
        label = v.value;
      }
    });
    return label;
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
  public  setTableOption(data): void {
    this.optionTable = {
      width: '101.4%',
      header: {
        data:  this.couponTableTitle,
        style: {background: '#282A31', color: '#DEDEDE', height: '6vh'}
      },
      Content: {
        data: data,
        styleone: {background: '#33353C', color: '#DEDEDE', textAlign: 'center', height: '2vw'},
        styletwo: {background: '#2E3037', color: '#DEDEDE', textAlign: 'center', height: '2vw'},
      },
      type: 2,
      tableList:  [{label: '详情', color: '#6A72A1'}]
    };
  }
  // Paging query data （分页查询数据）
  public  queryData(data): void {
    this.couponSrv.queryCouponType({}).subscribe(
      value => {
        value.data.forEach( v => {
          this.couponTypeData.push({label: v.settingName, value: v.settingCode});
        });
        this.couponSrv.queryChargeCode({}).subscribe(
          val => {
            val.data.forEach( v => {
              this.ChargeCodeData.push({label: v.chargeName, value: v.chargeCode});
            });
            this.couponSrv.queryCouponPagination({pageNo: data, pageSize: 10 }).subscribe(
              (values) => {
                this.loadingHide = true;
                if (values.status === '1000') {
                  values.data.contents.forEach( item => {
                    item.couponType  = this.setDataName(this.couponTypeData, item.couponType);
                    item.chargeCode = this.setDataName(this.ChargeCodeData, item.chargeCode);
                    if (item.effectiveTime !== '无限期') {
                      item.effectiveTime = item.effectiveTime + '天';
                    }
                  });
                  this.setTableOption(values.data.contents);
                  this.option = {total: values.data.totalRecord, row: values.data.pageSize, nowpage:  values.data.pageNo};
                } else {
                  this.toolSrv.setToast('error', '查询失败', values.message);
                }
              }
            );
          }
        );
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
          }
          this.couponModifySureClick(this.couponModify);
        }
      } else {
        this.toolSrv.setToast('error', '操作错误', '请填写完整信息');
      }
      // if ()
    }
  }
}
