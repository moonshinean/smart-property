import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ChargeDetailsService} from '../../../common/services/charge-details.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ChargeDetail, ItemDetail} from '../../../common/model/charge-detail.model';
import {ChargeItemDetail} from '../../../common/model/charge-payment.model';
import {PublicMethedService} from '../../../common/public/public-methed.service';

@Component({
  selector: 'rbi-charge-details',
  templateUrl: './charge-details.component.html',
  styleUrls: ['./charge-details.component.less']
})
export class ChargeDetailsComponent implements OnInit {

  public ChargedetailTableTitle =  [
    {field: 'orderId', header: '订单编号'},
    {field: 'villageName', header: '小区名称'},
    {field: 'roomCode', header: '房间编号'},
    {field: 'payerName', header: '缴费人'},
    {field: 'payerPhone', header: '缴费人电话'},
    {field: 'paymentMethod', header: '支付方式'},
    {field: 'actualTotalMoneyCollection', header: '缴费金额'},
    {field: 'idt', header: '缴费时间'},
    {field: 'operating', header: '操作'},
  ];
  public detailsTableContent: any;
  public detailsTableTitleStyle: any;
  public option: any;
  public detailsDialogTableTitle = [
    {field: 'chargeName', header: '项目名称'},
    {field: 'chargeStandard', header: '标准单价'},
    {field: 'datedif', header: '月数'},
    {field: 'discount', header: '折扣'},
    {field: 'startTime', header: '开始期间'},
    {field: 'dueTime', header: '结束期间'},
    {field: 'amountReceivable', header: '应收金额'},
    {field: 'actualMoneyCollection', header: '实收金额'},
    // {field: 'totle', header: '合计'},
  ];
  // public SearchOption = {
  //   village: [{label: '未来城', value: '1'}, {label: '云城尚品', value: '2'}],
  //   region: [{label: 'A3组团', value: '1'}, {label: 'A4组团', value: '2'}, {label: 'A5组团', value: '3'}, {label: 'A6组团', value: '4'}],
  //   building: [{label: '一栋', value: '1'}, {label: '二栋', value: '2'}, {label: '三栋', value: '3'}, {label: '四栋', value: '4'}],
  //   unit: [{label: '一单元', value: '1'}, {label: '二单元', value: '2'}, {label: '三单元', value: '3'}, {label: '四单元', value: '4'}],
  //   room: [{label: '2104', value: '1'}, {label: '2106', value: '2'}, {label: '2107', value: '3'}, {label: '2108', value: '4'}],
  // };
  // 缴费相关
  // public projectSelectDialog: boolean;
  public chargeStatusoption: any[] = [];
  public detailsDialog: boolean;
  public nowPage = 1;
  // 初始化项目
  public detailsProject: any;
  public detailsAddTitle =  [
    {name: '房间号码', value: 'A3-34'},
    {name: '建筑面积', value: '123平米'},
    {name: '客户名称', value: '张三'},
    {name: '手机号码', value: '213490234'},
  ];
  // 详情相关
  public chargeDetails: ChargeDetail = new ChargeDetail();
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public loadHidden = true;

  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private chargeDetailSrv: ChargeDetailsService,
    private toolSrv: PublicMethedService,
  ) { }
  ngOnInit() {
    this.detailsInitialization();
  }

  // initialization details
  public  detailsInitialization(): void {
    this.loadHidden = false;
    this.toolSrv.getAdminStatus('PAYMENT_METHOD' , (data) => {
      if (data.length > 0) {
        data.forEach( v =>  {
          this.chargeStatusoption.push({label: v.settingName, value: v.settingCode}) ;
        });
      }
    });
    const set = setInterval(() => {
      if (this.chargeStatusoption.length > 0) {
        this.chargeDetailSrv.queryChargeDataPage({pageNo: this.nowPage, pageSize: 10}).subscribe(
          (value) => {
            console.log(value);
            clearInterval(set);
            this.loadHidden = true;
            if (value.status === '1000') {
              if (value.data.contents) {
                value.data.contents.forEach( val => {
                  this.chargeStatusoption.forEach( v => {
                    if (val.paymentMethod === v.value) {
                         val.paymentMethod = v.label;
                    }
                  });
                });
              }
              this.detailsTableContent = value.data.contents;
            }
            this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
          }
        );
      }
    }, 500);
    this.detailsTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
  }
 // condition search click
  public  detailsSearchClick(): void {
    // @ts-ignore
    // console.log(this.input.nativeElement.value);
    // console.log('这里是条件搜索');
  }
  // sure modify details
  public  detailsSureClick(): void {
    this.loadHidden = false;
    this.chargeDetailSrv.getPayDocument({orderId: this.chargeDetails.orderId, organizationId: this.chargeDetails.organizationId}).subscribe(
      (data) => {
        if (data.data !== '') {
          this.loadHidden = true;
          window.open(data.data);
          this.detailsDialog = false;
        } else {
          this.toolSrv.setToast('error', '操作失败', data.message);
        }
      }
    );
  }
  public  detailsFaleseClick(): void {
    this.detailsDialog = false;
  }
  // charge item detail
  public  detailsDialogClick(e): void {
     this.chargeDetails = e;
     const dataDetail =  JSON.parse(e.detailed);
     this.detailsDialog = true;
     this.detailsAddTitle.forEach( v => {
       if (v.name === '房间编号') {
         v.value = e.roomCode;
       } else if (v.name === '建筑面积') {
         v.value = e.roomSize;
       } else if (v.name === '客户名称') {
         v.value = e.surname;
       } else if (v.name === '手机号码') {
         v.value = e.mobilePhone;
       }
     });
     this.detailsProject = dataDetail;
  }
  // paging query
  public  nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    const set = setInterval(() => {
      this.chargeDetailSrv.queryChargeDataPage({pageNo: event, pageSize: 10}).subscribe(
        (value) => {
          clearInterval(set);
          this.loadHidden = true;
          if (value.status === '1000') {
            if (value.data.contents) {
              value.data.contents.forEach( val => {
                this.chargeStatusoption.forEach( v => {
                  if (val.paymentMethod === v.value) {
                    v.paymentMethod = v.label;
                  }
                });
              });
            }
          }
          this.detailsTableContent = value.data.contents;
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        }
      );
    }, 500);

  }
}
