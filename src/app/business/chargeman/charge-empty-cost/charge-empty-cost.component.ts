import {Component, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {FileOption} from '../../../common/components/basic-dialog/basic-dialog.model';
import {ChargeItemDetail, ChargePaymentAddOrder, RentalAddSparkSpace} from '../../../common/model/charge-payment.model';
import {DataTree} from '../../../common/components/basic-dialog/dialog.model';
import {ChargeDetail} from '../../../common/model/charge-detail.model';
import {Subscription} from 'rxjs';
import {ChargeDetailsService} from '../../../common/services/charge-details.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {GlobalService} from '../../../common/services/global.service';
import {ChargePaymentService} from '../../../common/services/charge-payment.service';
import {LocalStorageService} from '../../../common/services/local-storage.service';
import {SharedServiceService} from '../../../common/public/shared-service.service';
import {DatePipe} from '@angular/common';
import {ThemeService} from '../../../common/public/theme.service';
import {TreeNode} from '../../../common/model/shared-model';
import {ChargeEmptyCostService} from '../../../common/services/charge-empty-cost.service';

@Component({
  selector: 'rbi-charge-empty-cost',
  templateUrl: './charge-empty-cost.component.html',
  styleUrls: ['./charge-empty-cost.component.less']
})
export class ChargeEmptyCostComponent implements OnInit, OnDestroy {
  public option: any;
  public paymentDetailSelect: any[] = [];
  public paymentDetailTableContnt: any;
  // 状态值相关
  public paymentMethodOption: any[] = [];
  public uploadRecordOption: any;
  public optionTable: any;
  public SearchData = {
    pageNo: 1,
    pageSize: 10,
    villageCode: '',
    regionCode: '',
    buildingCode: '',
    unitCode: '',
    roomCode: '',
  };
  public searchData = '';

  // 修改弹窗
  // 修改费用详细
  public dialogOption: any;
  // 按钮权限相关
  public btnHiden = [
    {label: '导出', hidden: true},
    {label: '搜索', hidden: true},
  ];
  // 缴费相关
  // public projectSelectDialog: boolean;
  public chargeStatusoption: any[] = [];
  public detailsDialog: boolean;
  public nowPage = 1;
  // 初始化项目
  public detailsPaymentProject: any;






  // 详情相关
  public chargeDetails: ChargeDetail = new ChargeDetail();

  // 其他相关
  public cleanTimer: any; // 清除时钟
  public esDate: any;
  // 树结构订阅
  public detailSub: Subscription;
  // 切换主题
  public themeSub: Subscription;
  public table = {
    tableheader: {background: '', color: ''},
    tableContent: [
      {background: '', color: ''},
      {background: '', color: ''}],
    detailBtn: ''
  };

  constructor(
    private emptySrv: ChargeEmptyCostService,
    private toolSrv: PublicMethedService,
    private globalSrv: GlobalService,
    private paymentSrv: ChargePaymentService,
    private localSrv: LocalStorageService,
    private  sharedSrv: SharedServiceService,
    private datePipe: DatePipe,
    private themeSrv: ThemeService
  ) {
    this.themeSub = this.themeSrv.changeEmitted$.subscribe(
      value => {
        this.table.tableheader = value.table.header;
        this.table.tableContent = value.table.content;
        this.table.detailBtn = value.table.detailBtn;
        this.setTableOption(this.paymentDetailTableContnt);
      }
    );
    this.detailSub = this.sharedSrv.changeEmitted$.subscribe(
      value => {
        for (const key in value) {
          if (key !== 'data') {
            this.SearchData[key] = value[key];
          }
        }
        this.nowPage = this.SearchData.pageNo = 1;
        this.queryData();
      }
    );
  }

  ngOnInit() {
    this.setBtnIsHidden();
    if (this.sharedSrv.SearchData !== undefined) {
      for (const key in this.sharedSrv.SearchData) {
        if (key !== 'data') {
          this.SearchData[key] = this.sharedSrv.SearchData[key];
        }
      }
      // this
    }
    if (this.themeSrv.setTheme !== undefined) {
      this.table.tableheader = this.themeSrv.setTheme.table.header;
      this.table.tableContent = this.themeSrv.setTheme.table.content;
      this.table.detailBtn = this.themeSrv.setTheme.table.detailBtn;
    }
    this.detailsInitialization();
  }

  ngOnDestroy(): void {
    this.themeSub.unsubscribe();
    // 取消订阅
    this.detailSub.unsubscribe();
  }

  // initialization details
  public detailsInitialization(): void {
    this.esDate = this.toolSrv.esDate;
    this.queryData();

  }

  // 重置搜索条件
  public reslveSearchData(): void {
    // this.SearchData.mobilePhone = '';
    // this.SearchData.surname = '';
    // this.SearchData.idNumber = '';
  }

  // condition search click
  public emptySearchClick(): void {
    this.nowPage = this.SearchData.pageNo = 1;
    if (this.searchData !== '') {
      this.queryData();
    } else {
      this.toolSrv.setToast('error', '操作错误', '请填写需要搜索的值');
    }
  }

  public detailsFaleseClick(): void {
    this.detailsDialog = false;
  }

  // charge item detail
  public detailsDialogClick(e): void {

    this.detailsDialog = true;
  }

  // paging query
  public nowpageEventHandle(event: any): void {
    this.nowPage = event;
    this.SearchData.pageNo = event;
    // this.selectSearchType();
  }


  // set table data （设置列表数据）
  public setTableOption(data1): void {
    this.optionTable = {
      width: '100%',
      header: {
        data: [
          {field: 'orderId', header: '订单编号'},
          {field: 'villageName', header: '小区名称'},
          {field: 'regionName', header: '地块名称'},
          {field: 'buildingName', header: '单元名称'},
          {field: 'roomCode', header: '房间编号'},
          {field: 'roomSize', header: '房间面积'},
          {field: 'surname', header: '客户名称'},
          {field: 'mobilePhone', header: '客户手机号'},
          {field: 'amountReceivable', header: '应收金额'},
          {field: 'actualMoneyCollection', header: '实收金额'},
          {field: 'startTime', header: '开始时间'},
          {field: 'dueTime', header: '结束时间'},
          {field: 'settlementExpenses', header: '结算状态'}],
        style: {background: this.table.tableheader.background, color: this.table.tableheader.color, height: '6vh'}
      },
      Content: {
        data: data1,
        styleone: {
          background: this.table.tableContent[0].background,
          color: this.table.tableContent[0].color,
          textAlign: 'center',
          height: '2vw'
        },
        styletwo: {
          background: this.table.tableContent[1].background,
          color: this.table.tableContent[1].color,
          textAlign: 'center',
          height: '2vw'
        },
      },
      type: 1,
      tableList: [{label: '详情', color: this.table.detailBtn}]
    };
  }

  // 分页查询
  public queryData(): void {
    this.emptySrv.queryEmptyCostPageData(this.SearchData).subscribe(
      (value) => {
        if (value.status === '1000') {
          if (value.data.contents.length !== 0) {
            value.data.contents.forEach(v => {
              v.settlementExpenses = v.settlementExpenses === 0 ? '未结算' : '已结算';
            });
            this.paymentDetailTableContnt = value.data.contents;
            this.setTableOption(value.data.contents);
          }
        } else {
          this.toolSrv.setToast('error', '请求失败', '数据查询失败');
        }
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
  }

  // 设置按钮显示权限
  public setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '空置费') {
        this.globalSrv.getChildrenRouter({parentCode: v.parentCode}).subscribe(value => {
          value.data.forEach(item => {
            this.btnHiden.forEach(val => {
              if (item.title === val.label) {
                val.hidden = false;
              }
            });
          });
        });
      }
    });
  }

  // 导出文件
  public exportEmptyCostFile(): void {
      console.log(123);
  }
}
