import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AddCouponTotal} from '../../../common/model/coupon-total.model';
import {GlobalService} from '../../../common/services/global.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {CouponService} from '../../../common/services/coupon.service';
import {Dropdown} from 'primeng/dropdown';
import {DialogModel, FormValue} from '../../../common/components/basic-dialog/dialog.model';
import {FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {SharedServiceService} from '../../../common/public/shared-service.service';
import {ThemeService} from '../../../common/public/theme.service';

@Component({
  selector: 'rbi-coupon-total',
  templateUrl: './coupon-total.component.html',
  styleUrls: ['./coupon-total.component.less']
})
export class CouponTotalComponent implements OnInit, OnDestroy {
  public couponTotalOption: any;
  public couponTotalSelect = [];
  public couponTableContent: any;

  public couponTotalDetailOption: any;
  // 添加相关
  public couponTotalAddDialog: boolean;
  public AddcouponTotal: AddCouponTotal = new AddCouponTotal();
  // 搜索相关
  public searchOption = [
    {label: '手机号', value: 1},
    {label: '房间号', value: 2},
    {label: '姓名', value: 3},
    {label: '身份证号', value: 4},
  ];
  public SearchCoupon = {
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
  public searchType = 0;
  public searchData =  '';
  // 其他相关
  public esDate: any;
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
  // 树结构订阅
  public couponSub: Subscription;
  public themeSub: Subscription;
  public table = {
    tableheader: {background: '', color: ''},
    tableContent: [
      {background: '', color: ''},
      {background: '', color: ''}],
    detailBtn: ''
  };
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private couponTotalSrv: CouponService,
    private globalSrv: GlobalService,
    private toolSrv: PublicMethedService,
    private  sharedSrv: SharedServiceService,
    private themeSrv: ThemeService,
  ) {
    this.couponSub = this.sharedSrv.changeEmitted$.subscribe(
      value => {
        for (const key in value) {
          if (key !== 'data') {
            this.SearchCoupon[key] = value[key];
          }
        }
        this.nowPage = this.SearchCoupon.pageNo = 1;
        this.reslveSearchData();
        this.queryCouponDataPage();
      }
    );
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
    if (this.themeSrv.setTheme !== undefined) {
      this.table.tableheader = this.themeSrv.setTheme.table.header;
      this.table.tableContent = this.themeSrv.setTheme.table.content;
      this.table.detailBtn = this.themeSrv.setTheme.table.detailBtn;
    }
    if (this.sharedSrv.SearchData !== undefined) {
      for (const key in this.sharedSrv.SearchData) {
        if (key !== 'data') {
          this.SearchCoupon[key] = this.sharedSrv.SearchData[key];
        }
      }
    }
    this.couponTotalInitialization();
  }
  ngOnDestroy(): void {
    this.themeSub.unsubscribe();
    this.couponSub.unsubscribe();
  }
  // initialization houseinfo
  public couponTotalInitialization(): void {
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
              this.queryCouponDataPage(); break;
      case 1: this.setSearData('mobilePhone'); this.SearchCoupon.mobilePhone = this.searchData; this.queryCouponDataPage(); break;
      case 2: this.setSearData('roomCode'); this.SearchCoupon.roomCode = this.searchData; this.queryCouponDataPage(); break;
      case 3: this.setSearData('surname'); this.SearchCoupon.surname = this.searchData;  this.queryCouponDataPage(); break;
      case 4: this.setSearData('idNumber'); this.SearchCoupon.idNumber = this.searchData; this.queryCouponDataPage(); break;
      default:
              break;
    }
  }
  // 重置数据
  public  setSearData(label): void {
    for (const serchKey in this.SearchCoupon) {
      if (serchKey !== label && serchKey !== 'pageSize' && serchKey !== 'pageNo') {
        this.SearchCoupon[serchKey] = '';
      }
    }
  }
  // 重置搜索条件
  public  reslveSearchData(): void {
    this.SearchCoupon.mobilePhone = '';
    this.SearchCoupon.surname = '';
    this.SearchCoupon.idNumber = '';
  }
  // add coupon
  public couponTotalAddClick(): void {
     if (this.SearchCoupon.roomCode !== '') {
       console.log(this.SearchCoupon);
       this.getUserInfo(this.SearchCoupon);
     } else {
       this.toolSrv.setToast('error', '操作错误', '请选择房间');
     }
  }
  public  showCouponDialog(roomdata, userinfo): void {
    this.optionDialog = {
      type: 'add',
      title: '添加信息',
      width: '800',
      dialog: true
    };
    const list = ['villageCode', 'villageName', 'regionCode', 'regionName', 'buildingCode', 'buildingName', 'unitCode', 'unitName',
      'roomCode', 'couponCode', 'couponName', 'userId', 'surname', 'mobilePhone', 'money', 'effectiveTime', 'couponType',
      'remarks'];
    const roomList = ['villageCode', 'villageName', 'regionCode', 'regionName', 'buildingCode', 'buildingName', 'unitCode', 'unitName',
      'roomCode'];
    list.forEach(val => {
      if (val === 'mobilePhone' || val === 'surname' || val === 'userId') {
        this.form.push({key: val, disabled: false, required: true, value: userinfo[val]});
      } else if (roomList.includes(val)) {
        this.form.push({key: val, disabled: false, required: true, value: roomdata[val]});
      } else {
        this.form.push({key: val, disabled: false, required: true, value: ''});

      }
    });
    this.formgroup = this.toolSrv.setFormGroup(this.form);
    this.formdata = [
      {label: '客户电话', type: 'input', name: 'mobilePhone', option: '', placeholder: '请输入客户电话', disable: true},
      {label: '房间号', type: 'input', name: 'roomCode', option: '', placeholder: '请选择房间', disable: true},
      {label: '客户名称', type: 'input', name: 'surname', option: '', placeholder: '请输入客户名称',  disable: true},
      {label: '优惠卷', type: 'dropdown', name: 'couponCode', option: this.couponOption, placeholder: '请选择优惠券'},
      {label: '优惠金额', type: 'input', name: 'money', option: '', placeholder: '', disable: true},
      {label: '有效时长', type: 'input', name: 'effectiveTime', option: '', placeholder: '', disable: true},
      {label: '优惠卷类型', type: 'input', name: 'couponType', option: '', placeholder: '', disable: true},
      {label: '备注', type: 'textbox', name: 'remarks', option: '', placeholder: '备注..', value: {row: 2, col: 6}},
    ];
  }
  // search userInfo
  public getUserInfo(data): void {
     this.globalSrv.queryCouponUserInfo({villageCode: data.villageCode, regionCode: data.regionCode, buildingCode: data.buildingCode, unitCode: data.unitCode , roomCode: data.roomCode}).subscribe(
       value => {
         console.log(value);
         if (value.status === '1000') {
           this.showCouponDialog(value.data.houseInfo, value.data.customerInfo);
         } else if (value.status === '1002') {
           this.toolSrv.setToast('error', '请求错误', '该房间没有业主');
         } else {
           this.toolSrv.setToast('error', '请求错误', value.message);
         }
       }
     );
  }
  // sure add houseinfo
  public couponTotalAddSureClick(): void {
    this.toolSrv.setConfirmation('增加', '增加', () => {
      console.log(this.AddcouponTotal);
      this.AddcouponTotal.effectiveTime = this.AddcouponTotal.effectiveTime === '无期限' ? 0 :
        this.AddcouponTotal.effectiveTime.slice(this.AddcouponTotal.effectiveTime.length - 1, this.AddcouponTotal.effectiveTime.length);
      this.AddcouponTotal.couponType = this.toolSrv.setLabelToValue(this.couponTypeOption, this.AddcouponTotal.couponType);
      this.couponTotalSrv.addCouponInfo(this.AddcouponTotal).subscribe(
        value => {
          if (value.status === '1000') {
            this.toolSrv.setToast('success', '操作成功', value.message);
            this.queryCouponDataPage();
            this.optionDialog.dialog = false;
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
          } else {
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
    this.selectSearchType();
    this.couponTotalSelect = [];
  }
  // clear data
  public clearData(): void {
    this.AddcouponTotal = new AddCouponTotal();}

  public selectData(e): void {
      this.couponTotalSelect = e;
  }
  // detail couponTotalInfo
  public detailClick(e): void {
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

  // query couponTotal data
  public  queryCouponDataPage(): void {
    this.couponTotalSrv.queryCouponPageData(this.SearchCoupon).subscribe(
      (value) => {
        this.loadingHide = true;
        if (value.status === '1000') {
          value.data.contents.forEach( h => {
            h.effectiveTime = (h.effectiveTime === '0' || h.effectiveTime === 0 ) ? '无期限' :  h.effectiveTime + '天';
            h.pastDue = this.toolSrv.setValueToLabel(this.pastDueOption, h.pastDue);
            h.auditStatus = this.toolSrv.setValueToLabel(this.auditStatusOption, h.auditStatus);
          });
          this.couponTableContent = value.data.contents;
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
      for (const eKey in e.value.value) {
        this.AddcouponTotal[eKey] = e.value.value[eKey];
      }
      this.couponTotalAddSureClick();
    }
  }

  public blurClick(e): void {
    if ( this.formgroup.value[e.name] !== '') {
      this.formgroup = e.value;
      if (e.name === 'couponCode') {
        this.couponTotalSrv.queryCouponInfo({couponCode: this.formgroup.value.couponCode}).subscribe(
          value => {
            console.log(value);
            this.formgroup.patchValue({effectiveTime: (value.data.effectiveTime === 0 ||
                value.data.effectiveTime === '0') ? '无期限' : value.data.effectiveTime + '天' , money: value.data.money});
            this.formgroup.patchValue({couponName: value.data.couponName});
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
