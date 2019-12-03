import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {RefundService} from '../../../common/services/refund.service';
import {ThemeService} from '../../../common/public/theme.service';
import {Subscription} from 'rxjs';
import {GlobalService} from '../../../common/services/global.service';
import {LocalStorageService} from '../../../common/services/local-storage.service';

@Component({
  selector: 'rbi-refund-already',
  templateUrl: './refund-already.component.html',
  styleUrls: ['./refund-already.component.less']
})
export class RefundAlreadyComponent implements OnInit, OnDestroy {


  public alreadyContents: any;
  public alreadySelect: any[];
  public alreadyOption: any;

  // 详情相关
  public alreadyDetailOption: any;

  public alreadyDetailDialog: boolean;
  public alreadyDetail: any;
  public detailTitle: any[] = [];
  public chargeStatusOption: any[] = [];
  public invalidStateOption: any[] = [];
  public paymentMethodOption: any[] = [];
  public refundStatusOption: any[] = [];
  // 按钮权限相关
  public btnHiden = [
    // {label: '新增', hidden: true},
    // {label: '修改', hidden: true},
    // {label: '删除', hidden: true},
    {label: '搜索', hidden: true},
  ];
  // public msgs: Message[] = []; // 消息弹窗
  public option: any;
  public loadHidden = true;
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public nowPage = 1;
  public roonCodeSelectOption: any[] = [];

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
    private alreadySrv: RefundService,
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
        this.setTableOption(this.alreadyContents);
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
    this.alreadyInitialization();
  }
  ngOnDestroy(): void {
    this.themeSub.unsubscribe();
  }
  // initialization already
  public alreadyInitialization(): void {
    this.loadHidden = false;
    this.toolSrv.getAdmStatus([{settingType: 'REFUND_STATUS'}, {settingType: 'CHARGE_TYPE'}, {settingType: 'INVALID_STATE'}, {settingType: 'PAYMENT_METHOD'}],
      (data) => {
          this.chargeStatusOption = this.toolSrv.setListMap(data.CHARGE_TYPE);
          this.refundStatusOption = this.toolSrv.setListMap(data.REFUND_STATUS);
          this.invalidStateOption = this.toolSrv.setListMap(data.INVALID_STATE);
          this.paymentMethodOption = this.toolSrv.setListMap(data.PAYMENT_METHOD);
          this.queryData(this.nowPage);
      });

  }
  // condition search click
  public alreadySearchClick(): void {
    // @ts-ignore
    // console.log(this.input.nativeElement.value);
    // console.log('这里是条件搜索');
  }
  // Show refunded details dialog
  public alreadyDetailClick(e): void {
    this.alreadyDetailOption = {
      dialog: true,
      tableHidden: false,
      width: '1000',
      type: 2,
      title: '详情',
      poplist: {
        popContent: e,
        popTitle: [
          {field: 'orderId', header: '订单Id'},
          {field: 'organizationName', header: '机构名称'},
          {field: 'villageName', header: '小区名称'},
          {field: 'regionName', header: '地块名称'},
          {field: 'buildingName', header: '楼宇名称'},
          {field: 'unitName', header: '单元名称'},
          {field: 'roomCode', header: '房间号'},
          {field: 'roomSize', header: '住房大小'},
          {field: 'mobilePhone', header: '客户电话'},
          {field: 'orderId', header: '订单Id'},
          {field: 'payerName', header: '缴费人姓名'},
          {field: 'payerPhone', header: '缴费人手机号'},
          {field: 'paymentType', header: '支付类型'},
          {field: 'paymentMethod', header: '支付方式'},
          {field: 'refundStatus', header: '退款状态'},
          {field: 'invalidState', header: '失效状态'},
          {field: 'surname', header: '姓氏'},
          {field: 'chargeName', header: '项目名称'},
          {field: 'chargeUnit', header: '收费单位'},
          {field: 'actualMoneyCollection', header: '实收金额'},
          {field: 'mortgageAmount', header: '抵扣金额'},
          {field: 'reasonForDeduction', header: '抵扣原因'},
          {field: 'refundableAmount', header: '可退还金额'},
          {field: 'startTime', header: '开始日期'},
          {field: 'dueTime', header: '结束日期'},
          {field: 'delayTime', header: '延迟时长'},
          {field: 'delayReason', header: '延迟原因'},
          {field: 'personLiable', header: '责任人'},
          {field: 'personLiablePhone', header: '责任人电话'},
          {field: 'responsibleAgencies', header: '负责机构'},
          {field: 'remark', header: '请求退款备注'},
          {field: 'idt', header: '申请时间'}
        ],
      }
    };
    this.alreadyDetailDialog = true;

  }
  // paging query
  public nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.queryData(event);
  }
  public  queryData(event): void {
    this.alreadySrv.queryRefundAlreadyPageInfo({pageNo: event, pageSize: 10}).subscribe(
      value => {
        this.loadHidden = true;
        if (value.status === '1000') {
          if (value.data.contents) {
            value.data.contents.forEach( v => {
              v.paymentType = this.toolSrv.setValueToLabel(this.chargeStatusOption, v.paymentType);
              v.invalidState = this.toolSrv.setValueToLabel(this.invalidStateOption, v.invalidState);
              v.paymentMethod = this.toolSrv.setValueToLabel(this.paymentMethodOption, v.paymentMethod);
              v.refundStatus = this.toolSrv.setValueToLabel(this.refundStatusOption, v.refundStatus);
              }
            );
          }
          this.alreadyContents = value.data.contents;
          this.setTableOption(value.data.contents);
        } else  {
          this.toolSrv.setToast('error', '查询失败', value.message);
        }
      }
    );
  }

  // 设置表格
  public  setTableOption(data1): void {
    this.alreadyOption = {
      width: '101.4%',
      header: {
        data: [
          {field: 'orderId', header: '订单Id'},
          {field: 'payerName', header: '缴费人姓名'},
          {field: 'paymentMethod', header: '支付方式'},
          {field: 'paymentType', header: '支付类型'},
          {field: 'roomCode', header: '房间编号'},
          {field: 'chargeName', header: '项目名称'},
          {field: 'actualMoneyCollection', header: '实收金额'},
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
    this.alreadySelect = e;
  }

  // 设置按钮显示权限
  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '未退款') {
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
