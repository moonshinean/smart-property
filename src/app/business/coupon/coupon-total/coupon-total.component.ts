import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AddCouponTotal, CouponTotal, SearchCoupon} from '../../../common/model/coupon-total.model';
import {GlobalService} from '../../../common/services/global.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {CouponService} from '../../../common/services/coupon.service';

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
  public couponTotalDetail: CouponTotal = new CouponTotal();
  // 条件查询
  public SearchCoupon: SearchCoupon = new SearchCoupon();
  public esDate: any;
  // 其他相关
  public couponTotalDetailDialog: any;
  public deleteIds: any[] = [];
  public cleanTimer: any; // 清除时钟
  public option: any;
  public loadingHide = true;
  // public couponTotalSeachData: any;
  public nowPage = 1;
  public SearchOption = {
    village: [],
    region: [],
    building: [],
    unit: [],
    room: []
  };
  public couponSelectOption: any[] = [];
  public roonCodeSelectOption: any[] = [];
  public couponTypeName: any;
  public couponMoney: any;
  public couponEffectiveTime: any;
  public pastDueOption: any[] = [];
  public auditStatusOption: any[] = [];
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
    this.loadingHide = false;
    this.queryCouponDataPage();

  }
  // query region
  public  VillageChange(e): void {
    this.SearchCoupon.villageCode = '';
    this.SearchCoupon.regionCode = '';
    this.SearchCoupon.buildingCode = '';
    this.SearchCoupon.unitCode = '';
    for (const searchOptionKey in this.SearchOption) {
      if (searchOptionKey !== 'village') {
        this.SearchOption[searchOptionKey] = [];
      }
    }
    // this.SearchCoupon.villageCode = e.value;
    this.AddcouponTotal.villageName = e.originalEvent.target.innerText;
    this.globalSrv.queryRegionInfo({villageCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach( v => {
          this. SearchOption.region.push({label: v.regionName, value: v.regionCode});
        });
      }
    );
  }
  // query building
  public  regionChange(e): void {
    this.SearchCoupon.regionCode = '';
    this.SearchCoupon.buildingCode = '';
    this.SearchCoupon.unitCode = '';
    this.SearchCoupon.regionCode = e.value;
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.AddcouponTotal.regionName = e.originalEvent.target.innerText;
    console.log(e.value);
    this.globalSrv.queryBuilingInfo({regionCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach( v => {
          this. SearchOption.building.push({label: v.buildingName, value: v.buildingCode});
        });
      }
    );
  }
  // query unit
  public  buildingChange(e): void {
    this.SearchCoupon.buildingCode = '';
    this.SearchCoupon.unitCode = '';
    this.SearchOption.unit = [];
    this.SearchCoupon.buildingCode = e.value;
    this.SearchOption.room = [];
    this.AddcouponTotal.buildingName = e.originalEvent.target.innerText;
    this.globalSrv.queryunitInfo({buildingCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach( v => {
          this. SearchOption.unit.push({label: v.unitName, value: v.unitCode});
        });
      }
    );
  }
  // query roomCode
  public  unitChange(e): void {
    this.SearchCoupon.unitCode = '';
    this.SearchCoupon.unitCode = e.value;
    this.roonCodeSelectOption = [];
    this.AddcouponTotal.unitName = e.originalEvent.target.innerText;

    this.couponTotalSrv.queryRoomCode({unitCode: e.value}).subscribe(
      value => {
        value.data.forEach( v => {
          this.roonCodeSelectOption.push({label: v.roomCode, value: v.roomCode});
          this.SearchOption.room.push({label: v.roomCode, value: v.roomCode});
        });
      }
    );

  }
  // condition search click
  public couponTotalSearchClick(): void {
    if (this.SearchCoupon.buildingCode === '' && this.SearchCoupon.mobilePhone === undefined) {
      this.toolSrv.setToast('error', '搜索失败', '搜索信息条件请具体到楼栋');
    } else {
      this.SearchCoupon.pageNo = 1;
      this.SearchCoupon.pageSize = 10;
      // @ts-ignore
      this.loadHidden = false;
      this.couponTotalSrv.queryCouponPageData(this.SearchCoupon).subscribe(
        value => {
          if (value.status === '1000') {
            this.loadingHide = true;
            if (value.data.contents) {
              this.toolSrv.setToast('success', '搜索成功', value.message);
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
  // add coupon
  public couponTotalAddClick(): void {
    this.couponSelectOption = [];
    this.couponTotalSrv.queryCouponList({}).subscribe(
      value => {
        value.data.forEach( val => {
          this.couponSelectOption.push({label: val.couponName, value: val.couponCode});
        });
      }
    );
    this.couponTotalAddDialog = true;
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
  // Choose a coupon
  public couponSelectChange(e): void {
    this.AddcouponTotal.couponName = e.originalEvent.target.innerText;
    this.couponTotalSrv.queryCouponInfo({couponCode: this.AddcouponTotal.couponCode}).subscribe(
      value => {
        this.AddcouponTotal.effectiveTime = value.data.effectiveTime;
        this.AddcouponTotal.money = value.data.money;
        this.couponMoney = '￥' + this.AddcouponTotal.money;
        this.AddcouponTotal.organizationId = value.data.organizationId;
        this.AddcouponTotal.chargeCode = value.data.chargeCode;
        if (value.data.effectiveTime === 0 ) {
          this.couponEffectiveTime = '无期限';
        } else  {
          this.couponEffectiveTime = value.data.effectiveTime + '天';
        }
        this.AddcouponTotal.couponType = value.data.couponType;
        this.couponTotalSrv.queryCouponType({}).subscribe(
          val => {
            val.data.forEach( v => {
              if (this.AddcouponTotal.couponType === v.settingCode) {
                this.couponTypeName = v.settingName;
              }
            });
          }
        );
      }
    );
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
    this.SearchOption = {village: [], region: [], building: [], unit: [], room: []};
    this.couponSelectOption = [];
    this.roonCodeSelectOption = [];
  }

  public selectData(e): void {
      this.couponTotalSelect = e;
  }
  // detail couponTotalInfo
  public detailClick(e): void {
    this.couponTotalSrv.queryCouponType({}).subscribe(
      val => {
        val.data.forEach( v => {
          if (e.couponType === v.settingCode) {
             e.couponType = v.settingName;
          }
        });
        this.toolSrv.getAdminStatus('USE_STATUS', (value) => {
          value.forEach( v => {
            if (e.usageState.toString() === v.settingCode) {
              e.usageState = v.settingName;
            }
          });
          this.toolSrv.getAdminStatus('PAST_DUE', (vdata) => {
            vdata.forEach( v => {
              if (e.pastDue.toString() === v.settingCode) {
                e.pastDue = v.settingName;
              }
            });
            this.toolSrv.getAdminStatus('AUDIT_STATUS', (data) => {
              data.forEach( v => {
                if (e.auditStatus.toString() === v.settingCode) {
                  e.auditStatus = v.settingName;
                }
              });
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
                    {field: 'couponCode', header: '优惠券编号'},
                    {field: 'couponName', header: '优惠券名称'},
                    {field: 'couponType', header: '优惠券类型'},
                    {field: 'chargeCode', header: '收费项目编号'},
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
            });
          });
        });

      }
    );
  }

  // set table data
  public  setTableOption(data): void {
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
        data: data,
        styleone: {background: '#33353C', color: '#DEDEDE', textAlign: 'center', height: '2vw'},
        styletwo: {background: '#2E3037', color: '#DEDEDE', textAlign: 'center', height: '2vw'},
      },
      type: 2,
      tableList:  [{label: '详情', color: '#6A72A1'}]
    };
  }

  // query couponTotal data
  public  queryCouponDataPage(): void {
    this.toolSrv.getAdminStatus('PAST_DUE', (e) => {
      e.forEach( v => {
        this.pastDueOption.push({label: v.settingName, value: v.settingCode});
      });
      this.toolSrv.getAdminStatus('AUDIT_STATUS', (val) => {
        val.forEach( v => {
          this.auditStatusOption.push({label: v.settingName, value: v.settingCode});
        });
        this.couponTotalSrv.queryCouponPageData({pageNo: this.nowPage, pageSize: 10}).subscribe(
          (value) => {
            this.loadingHide = true;
            if (value.status === '1000') {
              value.data.contents.forEach( h => {
                if (h.effectiveTime === 0 ) {
                     h.effectiveTime = '无期限';
                } else  {
                  h.effectiveTime = h.effectiveTime + '天';
                }
                this.pastDueOption.forEach(v => {
                  if (h.pastDue.toString() === v.value) {
                    h.pastDue = v.label;
                  }
                });
                this.auditStatusOption.forEach(v => {
                  if (h.auditStatus.toString() === v.value) {
                    h.auditStatus = v.label;
                  }
                });
              });
              this.setTableOption(value.data.contents);
              this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
            }  else  {
              this.toolSrv.setToast('error', '请求成功', value.message);
            }
          }
        );
      });
    });
    this.globalSrv.queryVillageInfo({}).subscribe(
      (data) => {
        if (data.status === '1000') {
          data.data.forEach( v => {
            this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
          });
        }
      }
    );
  }
}
