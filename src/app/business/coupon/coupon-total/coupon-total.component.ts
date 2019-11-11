import {Component, OnInit, ViewChild} from '@angular/core';
import {AddCouponTotal, SearchCoupon} from '../../../common/model/coupon-total.model';
import {GlobalService} from '../../../common/services/global.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {CouponService} from '../../../common/services/coupon.service';
import {Dropdown} from 'primeng/dropdown';
import {DialogModel, FormValue} from '../../../common/components/basic-dialog/dialog.model';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'rbi-coupon-total',
  templateUrl: './coupon-total.component.html',
  styleUrls: ['./coupon-total.component.less']
})
export class CouponTotalComponent implements OnInit {
  public couponTotalOption: any;
  public couponTotalSelect = [];

  public couponTotalDetailOption: any;
  // 添加相关
  public couponTotalAddDialog: boolean;
  public AddcouponTotal: AddCouponTotal = new AddCouponTotal();
  // 条件查询
  public SearchCoupon: SearchCoupon = new SearchCoupon();
  public esDate: any;
  // 其他相关
  public deleteIds: any[] = [];
  public cleanTimer: any; // 清除时钟
  public option: any;
  public loadingHide = true;
  // public couponTotalSeachData: any;
  // 状态值相关
  public auditStatusOption = [];
  public pastDueOption = [];
  public couponTypeOption = [];
  public couponOption = [];
  public userStatusOption = [];
  // 添加弹窗
  public optionDialog: DialogModel = new DialogModel();
  public form: FormValue[] = [];
  public formgroup: FormGroup;
  public formdata: any[];
  public roomtree: any;


  public nowPage = 1;
  public couponTypeName: any;
  public couponMoney: any;
  public couponEffectiveTime: any;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private couponTotalSrv: CouponService,
    private globalSrv: GlobalService,
    private toolSrv: PublicMethedService
  ) {
  }

  ngOnInit() {
    this.couponTotalInitialization();
  }
  // initialization houseinfo
  public couponTotalInitialization(): void {
    this.SearchCoupon.pageNo = 1;
    this.SearchCoupon.pageSize = 10;
    this.esDate = this.toolSrv.esDate;
    this.AddcouponTotal.mobilePhone = null;
    this.AddcouponTotal.roomCode = null;
    this.AddcouponTotal.remarks = null;
    this.toolSrv.getNatStatus([{settingType: 'COUPON_TYPE'}], (data) => {
      this.couponTypeOption = this.toolSrv.setListMap(data.COUPON_TYPE);
    });
    this.toolSrv.getAdmStatus([{settingType: 'USE_STATUS'}, {settingType: 'PAST_DUE'}, {settingType: 'AUDIT_STATUS'}], (data) => {
      this.auditStatusOption = this.toolSrv.setListMap(data.AUDIT_STATUS);
      this.pastDueOption = this.toolSrv.setListMap(data.PAST_DUE);
      this.userStatusOption = this.toolSrv.setListMap(data.USE_STATUS);
      // console.log(this.userStatusOption);
      this.queryCouponDataPage();
    });
    this.couponTotalSrv.queryCouponList({}).subscribe(
      value => {
        value.data.forEach(val => {
         this.couponOption.push({label: val.couponName, value: val.couponCode});
        });
      }
    );

  }
  public couponTotalSearchClick(): void {
    if ((this.SearchCoupon.buildingCode === '' || this.SearchCoupon.buildingCode === undefined) && (this.SearchCoupon.mobilePhone === undefined || this.SearchCoupon.mobilePhone === '')) {
      this.nowPage = 1;
      this.queryCouponDataPage();
    } else if (this.SearchCoupon.buildingCode !== '' && this.SearchCoupon.buildingCode !== undefined) {
      this.SearchCoupon.pageNo = 1;
      this.SearchCoupon.pageSize = 10;
      this.SearchCoupon.mobilePhone = '';
      this.loadingHide = false;
      this.couponTotalSrv.queryCouponPageData(this.SearchCoupon).subscribe(
        value => {
          if (value.status === '1000') {
            this.loadingHide = true;
            if (value.data.contents) {
              this.setTableOption(value.data.contents);
              this.toolSrv.setToast('success', '搜索成功', value.message);
              this.clearSearchOption();

            } else {
              this.toolSrv.setToast('success', '搜索成功', '数据为空');

            }
          } else {
            this.toolSrv.setToast('error', '搜索失败', value.message);

          }
        }
      );
    } else if (this.SearchCoupon.mobilePhone !== '' && this.SearchCoupon.mobilePhone !== undefined) {
      this.SearchCoupon.pageNo = 1;
      this.SearchCoupon.pageSize = 10;
      this.loadingHide = false;
      this.couponTotalSrv.queryCouponPageData(this.SearchCoupon).subscribe(
        value => {
          if (value.status === '1000') {
            this.loadingHide = true;
            if (value.data.contents) {
              this.setTableOption(value.data.contents);
              this.toolSrv.setToast('success', '搜索成功', value.message);
              this.clearSearchOption();
            } else {
              this.toolSrv.setToast('success', '搜索成功', '数据为空');
            }
          } else {
            this.toolSrv.setToast('error', '搜索失败', value.message);

          }
        }
      );
    }
  }
  public clearSearchOption(): void {
      this.SearchCoupon.villageCode = '';
      this.SearchCoupon.regionCode = '';
      this.SearchCoupon.unitCode = '';
      this.SearchCoupon.buildingCode = '';
      this.SearchCoupon.roomCode = '';
      this.SearchCoupon.mobilePhone = '';
  }
  // add coupon
  public couponTotalAddClick(): void {
    this.optionDialog = {
      type: 'add',
      title: '添加信息',
      width: '800',
      dialog: true
    };
    const list = ['villageCode', 'villageName', 'regionCode', 'regionName', 'buildingCode', 'buildingName', 'unitCode', 'unitName',
      'roomCode', 'couponCode', 'couponName', 'userId', 'surname', 'mobilePhone', 'money', 'effectiveTime', 'couponType',
      'remarks'];
    list.forEach(val => {
        this.form.push({key: val, disabled: false, required: true, value: ''});
    });
    this.formgroup = this.toolSrv.setFormGroup(this.form);
    this.formdata = [
      {label: '客户电话', type: 'input', name: 'mobilePhone', option: '', placeholder: '请输入客户电话'},
      {label: '房间号', type: 'tree', name: 'roomCode', option: '', placeholder: '请选择房间'},
      {label: '客户名称', type: 'input', name: 'surname', option: '', placeholder: '请输入客户名称',  disable: true},
      {label: '优惠卷', type: 'dropdown', name: 'couponCode', option: this.couponOption, placeholder: '请选择优惠券'},
      {label: '优惠金额', type: 'input', name: 'money', option: '', placeholder: '', disable: true},
      {label: '有效时长', type: 'input', name: 'effectiveTime', option: '', placeholder: '', disable: true},
      {label: '优惠卷类型', type: 'input', name: 'couponType', option: '', placeholder: '', disable: true},
      {label: '备注', type: 'textbox', name: 'remarks', option: '', placeholder: '备注..', value: {row: 2, col: 6}},
    ];
  }
  // search userInfo
  public getUserInfo(): void {
      if (this.AddcouponTotal.mobilePhone !== null && this.AddcouponTotal.roomCode !== null) {
         this.couponTotalSrv.queryCouponUserInfo({roomCode: this.AddcouponTotal.roomCode, mobilePhone: this.AddcouponTotal.mobilePhone}).subscribe(
           value => {
             this.AddcouponTotal.surname = value.data.customerInfoDO.surname;
             this.AddcouponTotal.userId = value.data.customerInfoDO.userId;
           }
         );
      }
  }
  // sure add houseinfo
  public couponTotalAddSureClick(): void {
    this.toolSrv.setConfirmation('增加', '增加', () => {
      this.couponTotalSrv.addCouponInfo(this.AddcouponTotal).subscribe(
        value => {
          if (value.status === '1000') {
            this.toolSrv.setToast('success', '操作成功', value.message);
            this.couponTotalInitialization();
            this.couponTotalAddDialog = false;
            this.clearData();
          } else {
            this.toolSrv.setToast('error', '增加失败', value.message);
          }
        }
      );
    });
  }
  // delete coupon
  public couponTotalDeleteClick(): void {
    if (this.couponTotalSelect === undefined || this.couponTotalSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.toolSrv.setConfirmation('删除',  '删除这' + this.couponTotalSelect.length + '项', () => {
        this.couponTotalSelect.forEach( v => {
          this.deleteIds.push(v.id);
        });
        this.couponTotalSrv.deleteCouponInfo({ids: this.deleteIds.join(',')}).subscribe(
        value => {
          if (value.status === '1000') {
            this.toolSrv.setToast('success', '操作成功', value.message);
            this.couponTotalInitialization();
          }else {
            this.toolSrv.setToast('error', '操作失败', value.message);
          }
        }
       );
      });
    }
  }
  // Paging request
  public nowpageEventHandle(event: any): void {
    this.loadingHide = false;
    this.nowPage = event;
    this.queryCouponDataPage();
    this.couponTotalSelect = [];
  }
  // clear data
  public clearData(): void {
    this.AddcouponTotal = new AddCouponTotal();
    this.couponTypeName = null;
    this.couponMoney = null;
    this.couponEffectiveTime = null;
  }

  public selectData(e): void {
      this.couponTotalSelect = e;
  }
  // detail couponTotalInfo
  public detailClick(e): void {
    // console.log(e);
    e.couponType = this.toolSrv.setValueToLabel(this.couponTypeOption, e.couponType);
    e.usageState = this.toolSrv.setValueToLabel(this.userStatusOption, e.usageState);
    this.couponTotalDetailOption = {
      dialog: true,
      tableHidden: false,
      width: '1000',
      type: 1,
      title: '详情',
      poplist: {
        popContent: e,
        popTitle:  [
          {field: 'villageName', header: '小区名称'},
          {field: 'regionName', header: '地块名称'},
          {field: 'buildingName', header: '楼栋名称'},
          {field: 'unitName', header: '单元名称'},
          {field: 'roomCode', header: '房间编号'},
          // {field: 'couponCode', header: '优惠券编号'},
          {field: 'couponName', header: '优惠券名称'},
          {field: 'couponType', header: '优惠券类型'},
          {field: 'surname', header: '客户姓名'},
          {field: 'mobilePhone', header: '客户电话'},
          {field: 'money', header: '优惠金额'},
          {field: 'propertyFee', header: '抵扣物业费金额'},
          {field: 'balanceAmount', header: '剩余金额'},
          {field: 'usageState', header: '使用状态'},
          {field: 'pastDue', header: '过期状态'},
          {field: 'effectiveTime', header: '有效时长'},
          {field: 'dueTime', header: '物业费到期时间'},
          {field: 'auditStatus', header: '审核状态'},
          {field: 'startTime', header: '开始时间'},
          {field: 'endTime', header: '结束时间'},
          {field: 'remarks', header: '备注 '},
        ],
      }
    };
  }

  // set table data
  public  setTableOption(data1): void {
    this.couponTotalOption = {
      width: '101.4%',
      header: {
        data:   [
          {field: 'roomCode', header: '房间代码'},
          {field: 'couponName', header: '优惠券名称'},
          {field: 'surname', header: '客户名称'},
          {field: 'mobilePhone', header: '客户电话'},
          {field: 'effectiveTime', header: '有效时长'},
          {field: 'money', header: '金额'},
          {field: 'auditStatus', header: '审核状态'},
          {field: 'pastDue', header: '过期状态'},
          {field: 'operating', header: '操作'}
        ],
        style: {background: '#282A31', color: '#DEDEDE', height: '6vh'}
      },
      Content: {
        data: data1,
        styleone: {background: '#33353C', color: '#DEDEDE', textAlign: 'center', height: '2vw'},
        styletwo: {background: '#2E3037', color: '#DEDEDE', textAlign: 'center', height: '2vw'},
      },
      type: 2,
      tableList:  [{label: '详情', color: '#6A72A1'}]
    };
  }

  // query couponTotal data
  public  queryCouponDataPage(): void {
    this.couponTotalSrv.queryCouponPageData({pageNo: this.nowPage, pageSize: 10}).subscribe(
      (value) => {
        this.loadingHide = true;
        if (value.status === '1000') {
          value.data.contents.forEach( h => {
            h.effectiveTime = (h.effectiveTime === '0' || h.effectiveTime === 0 )? '无期限' :  h.effectiveTime + '天';
            h.pastDue = this.toolSrv.setValueToLabel(this.pastDueOption, h.pastDue);
            h.auditStatus = this.toolSrv.setValueToLabel(this.auditStatusOption, h.auditStatus);
          });
          this.setTableOption(value.data.contents);
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        }  else  {
          this.toolSrv.setToast('error', '请求成功', value.message);
        }
      }
    );
  }


  public eventClick(e): void {
    if (e === 'false') {
      this.optionDialog.dialog = false;
    } else {
      for (const eKey in e.value) {
        const a = eKey;
        this.AddcouponTotal[a] = e.value[eKey];
      }
      this.couponTotalAddSureClick();
    }
  }

  public blurClick(e): void {
    if ( this.formgroup.value[e.name] !== '') {
      this.formgroup = e.value;
      if (e.name === 'mobilePhone') {
        this.couponTotalSrv.queryCouponUserInfo({mobilePhone: this.formgroup.value[e.name]}).subscribe(
          value => {
            if (value.status === '1000') {
              this.roomtree = value.data.roomTree;
              if (value.data.customerInfoDO) {
                this.formgroup.patchValue({surname: value.data.customerInfoDO.surname, userId: value.data.customerInfoDO.userId});
              }
            }
          }
        );
      } else if (e.name === 'couponCode') {
        this.couponTotalSrv.queryCouponInfo({couponCode: this.formgroup.value.couponCode}).subscribe(
          value => {
            this.formgroup.patchValue({effectiveTime: (value.data.effectiveTime === 0 || value.data.effectiveTime === '0') ? '无期限' : value.data.effectiveTime + '天' , money: value.data.money});
            this.couponTotalSrv.queryCouponType({}).subscribe(
              val => {
                val.data.forEach(v => {
                  if (value.data.couponType === v.settingCode) {
                    this.formgroup.patchValue({couponType: v.settingName});
                  }
                });

              }
            );
          }
        );
      }
    } else {
      this.toolSrv.setToast('error', '操作错误', '请输入合法的电话号码');
    }
  }
}
