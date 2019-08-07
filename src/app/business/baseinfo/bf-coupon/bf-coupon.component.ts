import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AddCoupon, Coupon, ModifyCoupon} from '../../../common/model/charge-coupon.model';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ChargeCouponService} from '../../../common/services/charge-coupon.service';
import {BfCouponService} from '../../../common/services/bf-coupon.service';
import {AddBfCoupon, ModifyBfCoupon} from '../../../common/model/bf-coupon.model';
import {Dropdown} from 'primeng/primeng';
import {PublicMethedService} from '../../../common/public/public-methed.service';

@Component({
  selector: 'rbi-bf-coupon',
  templateUrl: './bf-coupon.component.html',
  styleUrls: ['./bf-coupon.component.less']
})
export class BfCouponComponent implements OnInit {

  @ViewChild('input') input: Input;
  @ViewChild('addcouponType') addcouponType: Dropdown;
  @ViewChild('addChargeCode') addChargeCode: Dropdown;
  @ViewChild('addEffectiveTime') addEffectiveTime: Dropdown;
  @ViewChild('modifyeffectiveTime') modifyeffectiveTime: Dropdown;
  @ViewChild('modifycouponType') modifycouponType: Dropdown;
  @ViewChild('modifyChargeCode') modifychargeCode: Dropdown;
  // @ViewChild('file') file: Input;
  public couponTableTitle: any;
  public couponTableContent: Coupon[];
  // public couponTableContent: any;
  public couponTableTitleStyle: any;
  public couponSelect: ModifyBfCoupon[] = [];
  // 添加相关
  public couponAddDialog: boolean;
  public couponAdd: AddBfCoupon = new AddBfCoupon();
  // public couponAdd: any;
  // 修改相关
  public couponModifayDialog: boolean;
  public couponModify: ModifyBfCoupon = new ModifyBfCoupon();
  public optionEnable: any[] = [];
  public modifyEnable: any;
  // public couponModify: any;
  public couponDetailDialog: boolean;
  public couponDetail: ModifyBfCoupon = new ModifyBfCoupon();
  // public esDate: any;
  // 上传相关
  // public couponUploadFileDialog: boolean;
  // public uploadedFiles: any[] = [];
  // 其他相关
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
      {field: 'chargeCode', header: '收费项目编号'},
      {field: 'couponCode', header: '优惠券编号'},
      {field: 'couponName', header: '优惠券名称'},
      {field: 'effectiveTime', header: '有效时长'},
      {field: 'money', header: '金额'},
      {field: 'operating', header: '操作'}
    ];
    this.loadingHide = false;
    this.couponSrv.queryCouponPagination({pageNo: 1, pageSize: 10 }).subscribe(
      (value) => {
        this.loadingHide = true;
        if (value.status === '1000') {
          this.couponTableContent = value.data.contents;
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage:  value.data.pageNo};
        }else {
          this.toolSrv.setToast('error', '查询失败', value.message);
        }
      }
    );
    this.couponTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};

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
    this.couponSrv.queryCouponType({}).subscribe(
      value => {
        value.data.forEach( v => {
          this.couponTypeData.push({label: v.settingName, value: v.settingCode});
        });
      }
    );
    this.couponSrv.queryChargeCode({}).subscribe(
      val => {
        val.data.forEach( v => {
          this.ChargeCodeData.push({label: v.chargeName, value: v.chargeCode});
        });
      }
    );
  }
  // condition search click
  public  couponSearchClick(): void {
    // @ts-ignore
  }
  // couponType change
  public  couponTypeChange(e): void {
      this.couponAdd.couponType = e.value;
      this.couponModify.couponType = e.value;
  }
  public  chargeCodeChange(e): void {
    this.couponAdd.chargeCode = e.value;
    this.couponModify.chargeCode = e.value;
  }
  public  EffectiveTimeChange(e): void {
    this.couponAdd.effectiveTime = e.value;
    this.couponModify.effectiveTime = e.value;
  }
  // add coupon
  public  couponAddClick(): void {
    this.couponAdd.effectiveTime = '';
    this.couponAdd.chargeCode = '';
    this.couponAdd.couponType = '';
    this.couponAdd.money = '';
    this.couponAdd.couponName = '';
    this.couponAddDialog = true;
  }
  // sure add houseinfo
  public  couponAddSureClick(): void {
    this.toolSrv.setConfirmation('增加', '增加', () => {

      this.couponSrv.addCoupon(this.couponAdd).subscribe(
        value => {
          this.toolSrv.setToast('success', '操作成功', value.message);
          this.couponAdd = new AddBfCoupon();
          this.couponInitialization();
          this.couponAddDialog = false;
          this.clearData();
        }
      );
    });
  }
  // detail couponInfo
  public  couponDetailClick(e): void {
    this.couponDetailDialog = true;
    this.couponDetail = e;
  }
  // modify coupon
  public couponModifyClick(): void {
    this.couponAdd.effectiveTime = '';
    this.couponAdd.chargeCode = '';
    this.couponAdd.couponType = '';
    this.couponAdd.money = '';
    this.couponAdd.couponName = '';
    if (this.couponSelect === undefined || this.couponSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');

    } else if (this.couponSelect.length === 1) {
      this.couponModify = this.couponSelect[0];
      this.toolSrv.getAdminStatus('ENABLE', (data) => {
        console.log(data);
          if (data.length > 0) {
            this.toolSrv.setDataFormat(data, this.couponModify.enable , (list, label) => {
              this.optionEnable = list;
              this.modifyEnable = label;
            });
          }
      });
      this.ChargeCodeData.forEach(v => {
        if (this.couponModify.chargeCode === v.value) {
          this.modifyChargeName = v.label;
        }
      });
      this.EffectiveTime.forEach(v => {
        if (Number(this.couponModify.effectiveTime) === Number(v.value)) {
          this.modifyEffectiveTime = v.label;
        }
      });
      this.couponTypeData.forEach(v => {
        if (this.couponModify.couponType === v.value) {
          this.modifyCouponType = v.label;
        }
      });
      this.couponModifayDialog = true;
    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行修改');
    }
  }
  // sure modify coupon
  public  couponModifySureClick(): void {
    this.toolSrv.setConfirmation('修改', '修改', () => {
      this.couponSrv.updateCoupon(this.couponModify).subscribe(
        value => {
          if (value.status === '1000') {
            this.toolSrv.setToast('success', '操作成功', value.message);
            this.couponInitialization();
            this.couponModifayDialog = false;
            this.clearData();
          } else {
            this.toolSrv.setToast('error', '修改失败', value.message);
          }
        }
      );
    });
  }
  // delete coupon
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

  // 分页请求
  public  nowpageEventHandle(event: any): void {
    this.loadingHide = false;

    this.couponSrv.queryCouponPagination({pageNo: event, pageSize: 10 }).subscribe(
      (value) => {
        if (value.status === '1000') {
          this.loadingHide = true;
          this.couponTableContent = value.data.contents;
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage:  value.data.pageNo};
        } else {
           this.toolSrv.setToast('error', '查询错误', value.message);
        }

      }
    );
    this.couponSelect = [];
  }
  public  clearData(): void {
    this.couponSelect = [];
    this.modifyCouponType = null;
    this.modifyChargeName = null;
    this.modifyEffectiveTime = null;
    this.couponModify = new ModifyBfCoupon();
    this.couponAdd = new AddBfCoupon();
    this.addcouponType.selectedOption = null;
    this.addChargeCode.selectedOption = null;
    this.addEffectiveTime.selectedOption = null;
    this.modifycouponType.selectedOption = null;
    this.modifychargeCode.selectedOption = null;
    this.modifyeffectiveTime.selectedOption = null;
  }
}
