import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ChargePrepaymentService} from '../../../common/services/charge-prepayment.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';

@Component({
  selector: 'rbi-charge-prepayment',
  templateUrl: './charge-prepayment.component.html',
  styleUrls: ['./charge-prepayment.component.less']
})
export class ChargePrepaymentComponent implements OnInit {

  public prepaymentTableTitle: any;
  public prepaymentTableContent: any;
  public prepaymentTableTitleStyle: any;
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
  public chargeStatusOption: any[] = [];
  public invalidStateOption: any[] = [];
  public paymentMethodOption: any[] = [];
  public refundStatusOption: any[] = [];

  // public SearchOption = {
  //   village: [{label: '未来城', value: '1'}, {label: '云城尚品', value: '2'}],
  //   region: [{label: 'A3组团', value: '1'}, {label: 'A4组团', value: '2'}, {label: 'A5组团', value: '3'}, {label: 'A6组团', value: '4'}],
  //   building: [{label: '一栋', value: '1'}, {label: '二栋', value: '2'}, {label: '三栋', value: '3'}, {label: '四栋', value: '4'}],
  //   unit: [{label: '一单元', value: '1'}, {label: '二单元', value: '2'}, {label: '三单元', value: '3'}, {label: '四单元', value: '4'}],
  //   room: [{label: '2104', value: '1'}, {label: '2106', value: '2'}, {label: '2107', value: '3'}, {label: '2108', value: '4'}],
  // };
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    // private messageService: MessageService,
    private prepaymentSrv: ChargePrepaymentService,
    private toolSrv: PublicMethedService,
    // private confirmationService: ConfirmationService,
  ) { }
  ngOnInit() {
    this.prepaymentInitialization();
  }

  // initialization prepayment
  public  prepaymentInitialization(): void {
    // console.log('这里是信息的初始化');
    this.prepaymentTableTitle = [
      {field: 'id', header: '序号'},
      {field: 'roomCode', header: '房间号'},
      {field: 'paymentMethod', header: '支付方式'},
      {field: 'preferentialAmount', header: '预缴金额'},
      {field: 'payerName', header: '预缴人'},
      {field: 'idt', header: '缴费时间'},
      {field: 'operating', header: '操作'}
    ];
    this.loadHidden = false;
    this.getAllStatus();
    this.queryData(this.nowPage);
    this.prepaymentTableContent = [];
    this.prepaymentTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
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
    console.log(e);
    this.prepaymentDetail = e;
    this.detailData = [
      // {field: 'organizationName', header: '组织/机构名称'},
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
    ];
    this.prepaymentDetailDialog = true;
  }

  // paging query
  public  nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.getAllStatus();
    this.queryData(event);
    this.prepaymentSelect = [];
  }

  public  queryData(event): void {
   const set = setInterval(() => {
     if (this.chargeStatusOption.length > 0 && this.invalidStateOption.length > 0 && this.paymentMethodOption.length > 0 && this.refundStatusOption.length > 0){
       this.prepaymentSrv.queryPrepaymentPage({pageNo: event , pageSize: 10}).subscribe(
         (value) => {
           clearInterval(set);
           this.loadHidden = true;
           if (value.status === '1000') {
             if (value.data.contents) {
               value.data.contents.forEach(v => {
                 v.chargeStatus =  this.setData(this.chargeStatusOption, v.chargeStatus);
                 v.invalidState = this.setData(this.invalidStateOption, v.invalidState);
                 v.paymentMethod = this.setData(this.paymentMethodOption, v.paymentMethod);
                 v.refundStatus = this.setData(this.refundStatusOption, v.refundStatus);
                 }
               );
               console.log(value.data.contents);
               this.prepaymentTableContent = value.data.contents;
             }
           } else {
             this.toolSrv.setToast('error', '查询失败', value.message);
           }
           this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
         }
       );
     }
   }, 600);
  }
  public  getAllStatus(): void {
      this.toolSrv.getAdminStatus('CHARGE_TYPE', (data) => {
        console.log(data);
        if (data.length > 0 ) {
          data.forEach (val => {
            this.chargeStatusOption.push({label: val.settingName, value: val.settingCode});
          });
        }
      });
      this.toolSrv.getAdminStatus('INVALID_STATE', (data) => {
        console.log(data);
        if (data.length > 0 ) {
          data.forEach (val => {
            this.invalidStateOption.push({label: val.settingName, value: val.settingCode});
          });
        }
      });
      this.toolSrv.getAdminStatus('PAYMENT_METHOD', (data) => {
        console.log(data);
        if (data.length > 0 ) {
          data.forEach (val => {
            this.paymentMethodOption.push({label: val.settingName, value: val.settingCode});
          });
        }
      });
      this.toolSrv.getAdminStatus('REFUND_STATUS', (data) => {
        console.log(data);
        if (data.length > 0 ) {
          data.forEach (val => {
            this.refundStatusOption.push({label: val.settingName, value: val.settingCode});
          });
        }
      });
  }
  public  setData(data , label): any {
      data.forEach( v => {
         if (label.toString() === v.value) {
           label  = v.label;
         }
         console.log(label);
      });
      return label;
  }
}
