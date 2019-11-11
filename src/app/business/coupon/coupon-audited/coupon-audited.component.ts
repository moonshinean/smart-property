import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {GlobalService} from '../../../common/services/global.service';
import {CouponAudited} from '../../../common/model/coupon-audited.model';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {CouponService} from '../../../common/services/coupon.service';

@Component({
  selector: 'rbi-coupon-audited',
  templateUrl: './coupon-audited.component.html',
  styleUrls: ['./coupon-audited.component.less']
})
export class CouponAuditedComponent implements OnInit {

  public couponAuditedOption: any;
  public couponAuditedSelect: any;

  // 详情相关
  public couponAuditedDetailOption: any;
  // 状态相关
  public couponTypeOption = [];
  public auditStatusOption = [];
  public pastDueOption = [];
  public userStatusOption = [];
  // 其他相关除时钟
  public option: any;
  public loadingHide = true;
  public nowPage = 1;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private couponAuditedSrv: CouponService,
    private toolSrv: PublicMethedService
  ) {
  }

  ngOnInit() {
    this.couponAuditedInitialization();
  }

  // initialization houseinfo
  public couponAuditedInitialization(): void {
    this.toolSrv.getNatStatus([{settingType: 'COUPON_TYPE'}], (data) => {
      this.couponTypeOption = this.toolSrv.setListMap(data.COUPON_TYPE);
    });
    this.toolSrv.getAdmStatus([{settingType: 'USE_STATUS'}, {settingType: 'PAST_DUE'}, {settingType: 'AUDIT_STATUS'}], (data) => {
      this.auditStatusOption = this.toolSrv.setListMap(data.AUDIT_STATUS);
      this.pastDueOption = this.toolSrv.setListMap(data.PAST_DUE);
      this.userStatusOption = this.toolSrv.setListMap(data.USE_STATUS);
      this.queryCouponAuditedPageData();
    });
    this.loadingHide = false;
  }

/*  public  VillageChange(e): void {
    this.SearchOption.region = [];
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.globalSrv.queryRegionInfo({villageCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach( v => {
          this. SearchOption.region.push({label: v.regionName, value: v.regionCode});
        });
      }
    );
  }
  public  regionChange(e): void {
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
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
  public  buildingChange(e): void {
    this.SearchOption.unit = [];
    this.globalSrv.queryunitInfo({buildingCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach( v => {
          this. SearchOption.unit.push({label: v.unitName, value: v.unitCode});
        });
      }
    );
  }
  public  unitChange(e): void {
    this.roonCodeSelectOption = [];
  }*/

  // condition search click
  // public couponAuditedSearchClick(): void {
  //   console.log('这里是条件搜索');
  // }


  // detail couponAuditedInfo
  public couponAuditedDetailClick(e): void {
    e.couponType = this.toolSrv.setValueToLabel(this.couponTypeOption, e.couponType);
    e.usageState = this.toolSrv.setValueToLabel(this.userStatusOption, e.usageState);
    this.couponAuditedDetailOption = {
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
  // 分页请求
  public nowpageEventHandle(event: any): void {
    this.loadingHide = false;
    this.nowPage = event;
    this.queryCouponAuditedPageData();
    this.couponAuditedSelect = [];
  }
  // 设置表格
  public  setTableOption(data1): void {
    this.couponAuditedOption = {
      width: '101.4%',
      header: {
        data:   [
          {field: 'roomCode', header: '房间代码'},
          {field: 'couponName', header: '优惠券名称'},
          {field: 'surname', header: '客户名称'},
          {field: 'mobilePhone', header: '客户电话'},
          {field: 'effectiveTime', header: '有效时长'},
          {field: 'money', header: '金额'},
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

  // 选择数据
  public  selectData(e): void {
    this.couponAuditedSelect = e;
  }
  // 分页查询
  public  queryCouponAuditedPageData(): void {
    this.couponAuditedSrv.queryCouponAuditedPageData({pageNo: this.nowPage, pageSize: 10}).subscribe(
      (value) => {
        this.loadingHide = true;
        value.data.contents.forEach( v => {
          v.effectiveTime = (v.effectiveTime === 0 || v.effectiveTime === '0') ? '无期限': v.effectiveTime + '天';
          v.auditStatus = this.toolSrv.setValueToLabel(this.auditStatusOption, v.auditStatus);
          v.pastDue = this.toolSrv.setValueToLabel(this.pastDueOption, v.pastDue);
        });
        this.setTableOption(value.data.contents);
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
  }
}
