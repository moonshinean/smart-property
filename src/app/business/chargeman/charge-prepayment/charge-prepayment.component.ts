import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ChargePrepaymentService} from '../../../common/services/charge-prepayment.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {Subscription} from 'rxjs';
import {ThemeService} from '../../../common/public/theme.service';

@Component({
  selector: 'rbi-charge-prepayment',
  templateUrl: './charge-prepayment.component.html',
  styleUrls: ['./charge-prepayment.component.less']
})
export class ChargePrepaymentComponent implements OnInit, OnDestroy {


  public prepaymentTableContnt: any;

  public prepaymentSelect: any;
  // 缴费相关
  // public projectSelectDialog: boolean;
  public prepaymentDetailDialog: boolean;
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  public loadHidden = true;
  public nowPage = 1;
  public detailData = [];
  public prepaymentDetail: any;

  public chargeTypeOption: any[] = [];
  public invalidStateOption: any[] = [];
  public paymentMethodOption: any[] = [];
  public refundStatusOption: any[] = [];

  public optionTable: any;
  public detailOption: any;
  public themeSub: Subscription;
  public table = {
    tableheader: {background: '', color: ''},
    tableContent: [
      {background: '', color: ''},
      {background: '', color: ''}],
    detailBtn: ''
  };
  constructor(
    // private messageService: MessageService,
    private prepaymentSrv: ChargePrepaymentService,
    private toolSrv: PublicMethedService,
    private themeSrv: ThemeService
    // private confirmationService: ConfirmationService,
  ) {
    this.themeSub = this.themeSrv.changeEmitted$.subscribe(
      value => {
        this.table.tableheader = value.table.header;
        this.table.tableContent = value.table.content;
        this.table.detailBtn = value.table.detailBtn;
        this.setTableOption(this.prepaymentTableContnt);
      }
    );
  }
  ngOnInit() {
    if (this.themeSrv.setTheme !== undefined) {
      this.table.tableheader = this.themeSrv.setTheme.table.header;
      this.table.tableContent = this.themeSrv.setTheme.table.content;
      this.table.detailBtn = this.themeSrv.setTheme.table.detailBtn;
    }
    this.prepaymentInitialization();
  }
  ngOnDestroy(): void {
    this.themeSub.unsubscribe();
  }

  // initialization prepayment
  public  prepaymentInitialization(): void {
    this.loadHidden = false;
    this.toolSrv.getAdmStatus([{settingType: 'CHARGE_TYPE'},
      {settingType: 'INVALID_STATE'}, {settingType: 'PAYMENT_METHOD'}, {settingType: 'REFUND_STATUS'}], (data) => {
      this.chargeTypeOption = this.toolSrv.setListMap(data.CHARGE_TYPE);
      this.invalidStateOption = this.toolSrv.setListMap(data.INVALID_STATE);
      this.paymentMethodOption = this.toolSrv.setListMap(data.PAYMENT_METHOD);
      this.refundStatusOption = this.toolSrv.setListMap(data.REFUND_STATUS);
      this.queryData(this.nowPage);
    });
    // console.log(this.prepaymentSelect);
  }
  // condition search click
  public  prepaymentSearchClick(e): void {
    // @ts-ignore
    // console.log(this.input.nativeElement.value);
    // console.log('这里是条件搜索');
  }
  // sure modify prepayment
  // public  prepaymentSureClick(): void {
    // this.confirmationService.confirm({
    //   message: `是否打印单据吗？`,
    //   header: '打印提醒',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {
    //     console.log(this.prepaymentSelect);
    //
    //     // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
    //   },
    //   reject: () => {
    //     console.log('这里是修改信息');
    //
    //     // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
    //   }
    // });
    // console.log();
  // }
  // seeing Detail
  public  prepaymentDetailClick(e): void {
    this.detailOption = {
      dialog: true,
      tableHidden: false,
      width: '1000',
      type: 2,
      title: '详情',
      poplist: {
        popContent: e,
        popTitle:  [
          {field: 'villageName', header: '小区名称'},
          {field: 'regionName', header: '地块名称'},
          {field: 'buildingName', header: '楼宇名称'},
          {field: 'unitName', header: '单元名称'},
          {field: 'roomCode', header: '房间号'},
          {field: 'roomSize', header: '住房大小'},
          {field: 'chargeName', header: '项目名称'},
          {field: 'chargeStandard', header: '收费单价'},
          {field: 'chargeStatus', header: '收费类型'},
          {field: 'chargeUnit', header: '收费单位'},
          {field: 'couponName', header: '优惠卷名称'},
          {field: 'currentReadings', header: '当前读数'},
          {field: 'datedif', header: '缴费月数'},
          {field: 'discount', header: '折扣'},
          {field: 'startTime', header: '开始计费时间'},
          {field: 'dueTime', header: '结束计费时间'},
          {field: 'idt', header: '缴费时间'},
          {field: 'invalidState', header: '失效状态'},
          {field: 'lastReading', header: '上次读数'},
          {field: 'mobilePhone', header: '客户电话'},
          {field: 'orderId', header: '订单Id'},
          {field: 'payerName', header: '缴费人姓名'},
          {field: 'payerPhone', header: '缴费人手机号'},
          {field: 'paymentMethod', header: '支付方式'},
          {field: 'refundStatus', header: '退款状态'},
          {field: 'surname', header: '姓氏'},
          {field: 'surplusMoney', header: '余额抵扣金额'},
          {field: 'tollCollectorId', header: '收费人编号'},
          {field: 'udt', header: '更新时间'},
          {field: 'usageAmount', header: '使用量'},

          {field: 'preferentialAmount', header: '优惠金额'},
          {field: 'actualMoneyCollection', header: '实收金额'},
          {field: 'amountReceivable', header: '应收金额'},
          {field: 'balanceAmount', header: '优惠券抵扣金额'},
          {field: 'idt', header: '缴费时间'},
          {field: 'remark', header: '备注'}
        ],
      }
    };
  }

  // paging query
  public  nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;

    this.prepaymentSelect = [];
  }

  public queryData(event): void {
    this.prepaymentSrv.queryPrepaymentPage({pageNo: event , pageSize: 10}).subscribe(
      (value) => {
        this.loadHidden = true;
        if (value.status === '1000') {
          if (value.data.contents) {
            value.data.contents.forEach(v => {
                v.chargeStatus =  this.toolSrv.setValueToLabel(this.chargeTypeOption, v.chargeStatus);
                v.invalidState =  this.toolSrv.setValueToLabel(this.invalidStateOption, v.invalidState);
                v.paymentMethod =  this.toolSrv.setValueToLabel(this.paymentMethodOption, v.paymentMethod);
                v.refundStatus =  this.toolSrv.setValueToLabel(this.refundStatusOption, v.refundStatus);
              }
            );
            // console.log();
            this.prepaymentTableContnt = value.data.contents;
            this.setTableOption(value.data.contents);
          }
        } else {
          this.toolSrv.setToast('error', '查询失败', value.message);
        }
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
  }
  public  selectData(e): void {
      this.prepaymentSelect = e;
  }

  // set table data （设置列表数据）
  public  setTableOption(data1): void {
    this.optionTable = {
      width: '100%',
      header: {
        data:  [
          {field: 'id', header: '序号'},
          {field: 'roomCode', header: '房间号'},
          {field: 'paymentMethod', header: '支付方式'},
          {field: 'preferentialAmount', header: '预缴金额'},
          {field: 'payerName', header: '预缴人'},
          {field: 'idt', header: '缴费时间'},
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
}
