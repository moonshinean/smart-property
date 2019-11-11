import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ChargeDetailsService} from '../../../common/services/charge-details.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ChargeDetail, ItemDetail} from '../../../common/model/charge-detail.model';
import {ChargeItemDetail} from '../../../common/model/charge-payment.model';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {FileOption} from '../../../common/components/basic-dialog/basic-dialog.model';

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
  public liquidatedDamagesTitle = [
    {field: 'dueTimeFront', header: '季度初'},
    {field: 'dueTimeAfter', header: '季度末'},
    {field: 'days', header: '欠费天数'},
    {field: 'amountMoney', header: '金额'},
  ];
  public liquidatedDamagesContent: any[] = [];
  public liquidatedDamagesStyle: any;
  public uploadFileOption: FileOption = new FileOption();
  public uploadRecordOption: any;
  public optionTable: any;
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
  public detailsProjectStyle: any;
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
    // this.toolSrv.getAdminStatus('PAYMENT_METHOD' , (data) => {
    //   if (data.length > 0) {
    //     data.forEach( v =>  {
    //       this.chargeStatusoption.push({label: v.settingName, value: v.settingCode}) ;
    //     });
    //     this.queryData();
    //   }
    // });
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
     this.detailsProject =  JSON.parse(e.detailed);
     this.liquidatedDamagesContent  =  JSON.parse(e.liquidatedDamages);
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
     if (this.liquidatedDamagesContent !== null && this.liquidatedDamagesContent.length <= 4) {
       this.liquidatedDamagesStyle = {width: '100%'};
     } else {
       this.liquidatedDamagesStyle = {width: '100%', height: '20vh'};

     }
    if (this.detailsProject.length <= 4) {
      this.detailsProjectStyle = {width: '100%'};
    } else {
      this.detailsProjectStyle = {width: '100%', height: '20vh'};
    }
  }
  // paging query
  public  nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
   this.queryData();

  }

  public  uploadFileClick(): void {
   this.uploadFileOption.width = '900';
   this.uploadFileOption.dialog = true;
   this.uploadFileOption.files = [];
  }
  // set table data （设置列表数据）
  public  setTableOption(data): void {
    this.optionTable = {
      width: '100%',
      header: {
        data:  [
          {field: 'orderId', header: '订单编号'},
          {field: 'villageName', header: '小区名称'},
          {field: 'roomCode', header: '房间编号'},
          {field: 'payerName', header: '缴费人'},
          {field: 'payerPhone', header: '缴费人电话'},
          {field: 'paymentMethod', header: '支付方式'},
          {field: 'actualTotalMoneyCollection', header: '缴费金额'},
          {field: 'idt', header: '缴费时间'},
          {field: 'operating', header: '操作'}],
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
  public  uploadFileSureClick(e): void {
    if (e.getAll('file').length !== 0) {
      this.chargeDetailSrv.importPayDocument(e).subscribe(
        value => {
          if (value.status === '1000') {
            this.uploadRecordOption = {
              width: '900',
              dialog: true,
              title: '上传记录',
              totalNumber: value.data.totalNumber,
              realNumber: value.data.realNumber,
              uploadOption: {
                width: '102%',
                tableHeader: {
                  data: [
                    {field: 'code', header: '序号'},
                    {field: 'roomCode', header: '房间编号'},
                    {field: 'result', header: '结果'},
                    {field: 'remarks', header: '备注'},
                  ],
                  style: { background: '#F4F4F4', color: '#000', height: '6vh'}
                },
                tableContent: {
                  data: value.data.logOldBillsDOS,
                  styleone: { background: '#FFFFFF', color: '#000', height: '2vw', textAlign: 'center'},
                  styletwo: { background: '#FFFFFF', color: '#000', height: '2vw', textAlign: 'center'}
                }
              }
            };
            this.uploadFileOption.files = [];
          }else {
            this.toolSrv.setToast('error', '操作失败', value.message);
          }
        }
      );
    }else {
      this.toolSrv.setToast('error', '操作错误', '请选择文件');
    }

  }

  public  queryData(): void {
    this.chargeDetailSrv.queryChargeDataPage({pageNo: this.nowPage, pageSize: 10}).subscribe(
      (value) => {
        console.log(value);
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
          this.setTableOption(value.data.contents);
        }
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
  }
}
