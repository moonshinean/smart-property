import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {RefundAlreadyService} from '../../../common/services/refund-already.service';
import {GlobalService} from '../../../common/services/global.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';

@Component({
  selector: 'rbi-refund-already',
  templateUrl: './refund-already.component.html',
  styleUrls: ['./refund-already.component.less']
})
export class RefundAlreadyComponent implements OnInit {


  @ViewChild('input') input: Input;
  public alreadyTableTitle: any;
  public alreadyTableContent: any[];
  public alreadyTableTitleStyle: any;
  public alreadySelect: any[];
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
    private alreadySrv: RefundAlreadyService,
    private toolSrv: PublicMethedService
  ) {
  }

  ngOnInit() {
    this.alreadyInitialization();
  }

  // initialization already
  public alreadyInitialization(): void {
    this.alreadyTableTitle = [
      {field: 'orderId', header: '订单Id'},
      {field: 'payerName', header: '缴费人姓名'},
      {field: 'paymentMethod', header: '支付方式'},
      {field: 'paymentType', header: '支付类型'},
      {field: 'roomCode', header: '房间编号'},
      {field: 'chargeName', header: '项目名称'},
      {field: 'actualMoneyCollection', header: '实收金额'},
      {field: 'operating', header: '操作'},
    ];
    this.loadHidden = false;
    this.getAllStatus();
    this.queryData(this.nowPage);
    // this.alreadySrv.queryRefundAlreadyPageInfo({pageNo: this.nowPage, pageSize: 10}).subscribe(
    //   val => {
    //     if (val.status === '1000') {
    //       this.loadHidden = true;
    //       this.alreadyTableContent = val.data.contents;
    //       this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};
    //     }  else {
    //       this.toolSrv.setToast('error', '请求失败', val.message);
    //     }
    //   }
    // );
    this.alreadyTableTitleStyle = {background: '#282A31', color: '#DEDEDE', height: '6vh'};

  }
  // condition search click
  public alreadySearchClick(): void {
    // @ts-ignore
    // console.log(this.input.nativeElement.value);
    // console.log('这里是条件搜索');
  }
  // Show refunded details dialog
  public alreadyDetailClick(e): void {
    this.alreadyDetail = e;
    this.detailTitle = [
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
    ];
    this.alreadyDetailDialog = true;

  }
  // already select
  public  alreadyonRowSelect(e): void {
    // this.alreadyModify = e.data;
  }
  // Reset data
  // public clearData(): void {
  //   this.alreadyAdd = null;
  //   this.alreadyModify = null;
  //   this.licensePlateColorModify = null;
  //   this.licensePlateTypeModify = null;
  //   this.licensePlateTypeModify = null;
  //   this.licensePlateColorOption = [];
  //   this.licensePlateTypeOption = [];
  //   this.alreadyOriginalTypeOption = [];
  //   this.alreadySelect = [];
  // }
  // paging query
  public nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.getAllStatus();
    this.queryData(event);
  }
  public  getAllStatus(): void {
    this.toolSrv.getAdminStatus('CHARGE_TYPE', (data) => {
      if (data.length > 0 ) {
        data.forEach (val => {
          this.chargeStatusOption.push({label: val.settingName, value: val.settingCode});
        });
      }
    });
    this.toolSrv.getAdminStatus('INVALID_STATE', (data) => {
      if (data.length > 0 ) {
        data.forEach (val => {
          this.invalidStateOption.push({label: val.settingName, value: val.settingCode});
        });
      }
    });
    this.toolSrv.getAdminStatus('PAYMENT_METHOD', (data) => {
      if (data.length > 0 ) {
        data.forEach (val => {
          this.paymentMethodOption.push({label: val.settingName, value: val.settingCode});
        });
      }
    });
    this.toolSrv.getAdminStatus('REFUND_STATUS', (data) => {
      if (data.length > 0 ) {
        data.forEach (val => {
          this.refundStatusOption.push({label: val.settingName, value: val.settingCode});
        });
      }
    });
  }
  public  queryData(event): void {
    const set = setInterval(() => {
      if (this.chargeStatusOption.length > 0 && this.invalidStateOption.length > 0 && this.paymentMethodOption.length > 0 && this.refundStatusOption.length > 0) {
        this.alreadySrv.queryRefundAlreadyPageInfo({pageNo: event, pageSize: 10}).subscribe(
          value => {
            clearInterval(set);

            this.loadHidden = true;
            if (value.status === '1000') {
              if (value.data.contents) {
                value.data.contents.forEach(v => {
                    v.paymentType =  this.setData(this.chargeStatusOption, v.paymentType);
                    v.invalidState = this.setData(this.invalidStateOption, v.invalidState);
                    v.paymentMethod = this.setData(this.paymentMethodOption, v.paymentMethod);
                    v.refundStatus = this.setData(this.refundStatusOption, v.refundStatus);
                  }
                );
                console.log(value.data.contents);
                this.alreadyTableContent = value.data.contents;
               }
            } else  {
              this.toolSrv.setToast('error', '查询失败', value.message);
            }
          }
        );
      }
    }, 600);
  }
  public  setData(data , label): any {
    data.forEach( v => {
      if (label.toString() === v.value) {
        label  = v.label;
      }
    });
    return label;
  }
}
