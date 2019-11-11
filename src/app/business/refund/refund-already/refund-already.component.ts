import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {RefundService} from '../../../common/services/refund.service';

@Component({
  selector: 'rbi-refund-already',
  templateUrl: './refund-already.component.html',
  styleUrls: ['./refund-already.component.less']
})
export class RefundAlreadyComponent implements OnInit {


  public alreadySelect: any[];
  public alreadyOption: any;
  // 添加相关
  // public alreadyAdd: any;
  // public  licensePlateColorOption: any[] = [];
  // public  licensePlateTypeOption: any[] = [];
  // public  alreadyOriginalTypeOption: any[] = [];
  // 修改相关
  // public alreadyModify: any;
  // public licensePlateColorModify: any;
  // public licensePlateTypeModify: any;
  // 详情相关
  public alreadyDetailOption: any;

  public alreadyDetailDialog: boolean;
  public alreadyDetail: any;
  public detailTitle: any[] = [];
  public chargeStatusOption: any[] = [];
  public invalidStateOption: any[] = [];
  public paymentMethodOption: any[] = [];
  public refundStatusOption: any[] = [];

  // public msgs: Message[] = []; // 消息弹窗
  public option: any;
  public loadHidden = true;
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public nowPage = 1;
  public roonCodeSelectOption: any[] = [];

  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private alreadySrv: RefundService,
    private toolSrv: PublicMethedService
  ) {
  }

  ngOnInit() {
    this.alreadyInitialization();
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

  // info select
  public  selectData(e): void {
    this.alreadySelect = e;
  }
}
