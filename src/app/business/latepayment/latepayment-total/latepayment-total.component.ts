import { Component, OnInit } from '@angular/core';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {LatePaymentService} from '../../../common/services/late-payment.service';
import {LatePaymentQueryData} from '../../../common/model/latepayment.model';

@Component({
  selector: 'rbi-latepayment-total',
  templateUrl: './latepayment-total.component.html',
  styleUrls: ['./latepayment-total.component.less']
})
export class LatepaymentTotalComponent implements OnInit {

  public optionTable: any;
  public latetotleAddDialog: any;
  public latetotleSelect: any;
  public SearchData: LatePaymentQueryData = new LatePaymentQueryData();
  // 上传相关
  public UploadFileDialog: boolean;
  public uploadedFiles: any[] = [];
  // 详情相关
  public dialogOption: any;
  public detailTitle = [
    {field: 'orderId', header: '订单编号'},
    {field: 'villageName', header: '小区名称'},
    {field: 'regionName', header: '地块名称'},
    {field: 'buildingName', header: '楼宇名称'},
    {field: 'unitName', header: '单元名称'},
    {field: 'roomCode', header: '房间号'},
    {field: 'roomSize', header: '房间大小'},
    {field: 'userId', header: '客户ID'},
    {field: 'surname', header: '客户姓'},
    {field: 'mobilePhone', header: '手机号'},
    {field: 'amountTotalReceivable', header: '应收总金额'},
    {field: 'actualTotalMoneyCollection', header: '实收总金额'},
    {field: 'surplusTotal', header: '减免金额'},
    {field: 'surplusReason', header: '减免原因'},
    {field: 'auditStatus', header: '审核状态'},
    {field: 'tollCollectorId', header: '操作人ID'},
    {field: 'reviserId', header: '修订人'},
    {field: 'auditId', header: '审核人'},
    {field: 'retrialId', header: '复核人'},
    {field: 'startTime', header: '物业费计费开始时间'},
    {field: 'dueTime', header: '物业费计费结束时间'},
    {field: 'propertyActualMoneyCollection', header: '物业费金额'},
    {field: 'month', header: '缴费月数'},
    {field: 'remark', header: '备注'},

  ];
  // 删除相关
  public ids: any[] = [];
  // 其他相关
  public option: any;
  public loadHidden = true;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private toolSrv: PublicMethedService,
    private lateSrv: LatePaymentService
  ) { }
  ngOnInit() {
    this.latetotleInitialization();
  }
  // Initialize latetotle data
  public  latetotleInitialization(): void {
    this.SearchData.pageNo = 1;
    this.SearchData.pageSize = 10;
    this.loadHidden = false;
    this.lateSrv.queryLatePaymentPageData(this.SearchData).subscribe(
      value => {
        this.loadHidden = true;
        if (value.status === '1000') {
          console.log(value);
          this.setTableOption(value.data.contents);
        } else {
          this.toolSrv.setToast('error', '请求失败', value.message);
        }
      }
    );
  }

  // show add latetotle dialog
  public  latetotleConfigClick(): void {
  }
  // sure add latetotle
  public  latetotleAddSureClick(): void {
    // console.log(this.primitDatas);

  }
  // close  add latetotle dialog
  public latetotleAddCloseClick(): void {

  }
// delete latetotle
  public  latetotleDeleteClick(): void {
    // if (this.latetotleSelect === undefined || this.latetotleSelect.length === 0) {
    //   this.toolSrv.setToast('error', '操作错误', '请选择需要删除的项');
    // } else {
    //   this.toolSrv.setConfirmation('删除', `删除这${this.latetotleSelect.length}项`, () => {
    //     this.latetotleSelect.forEach( v => {
    //       this.ids.push(v.id);
    //     });
    //     this.latetotleSrv.deleteRolePerimit({ids: this.ids.join(',')}).subscribe(
    //       (value) => {
    //         if (value.status === '1000') {
    //           this.latetotleInitialization();
    //           this.toolSrv.setToast('success', '操作成功', '删除成功');
    //           this.latetotleSelect = [];
    //         } else {
    //           this.toolSrv.setToast('error', '操作失败', value.message);
    //         }
    //       }
    //     );
    //   });
    // }
  }
  // paging query
  public  nowpageEventHandle(event: any): void {
  }
  public uploadFileClick(): void {
      this.UploadFileDialog = true;
  }
  // sure upload file
  public  UploadSureClick(): void {
    this.loadHidden = false;
    const fileData = new FormData();
    this.uploadedFiles.forEach(v => {
      fileData.append('file', v);
    });
    this.lateSrv.uploadFile(fileData).subscribe(
      (value) => {
        this.loadHidden = true;
        if (value.status === '1000') {
         this.toolSrv.setToast('success', '请求成功', '上传成功');
         this.UploadFileDialog = false;
        }
        console.log(value);
      });
  }
  public  setTableOption(data): void {
    this.optionTable = {
      width: '79vw',
      header: {
        data:  [
          {field: 'orderId', header: '订单编号'},
          {field: 'villageName', header: '小区名称'},
          {field: 'roomCode', header: '房间号'},
          {field: 'roomSize', header: '房间大小'},
          {field: 'surname', header: '客户姓'},
          {field: 'mobilePhone', header: '手机号'},
          {field: 'propertyActualMoneyCollection', header: '物业费金额'},
          {field: 'actualTotalMoneyCollection', header: '实收金额'},
          {field: 'month', header: '缴费月数'},
          {field: 'operating', header: '操作'},
        ],
        style: {background: '#282A31', color: '#DEDEDE', height: '6vh'}
      },
      Content: {
        data: data,
        styleone: {background: '#33353C', color: '#DEDEDE', textAlign: 'center', height: '2vw'},
        styletwo: {background: '#2E3037', color: '#DEDEDE', textAlign: 'center', height: '2vw'},
      },
      btnHidden: true,
      tableList:  [{label: '详情', color: '#6A72A1'}]
    };
  }
  public  detailClick(e): void {
      console.log(JSON.parse(e.liquidatedDamages));
      if (e.liquidatedDamages) {
        this.dialogOption = {
          dialog: true,
          tableHidden: true,
          width: '800',
          title: '详情',
          poplist: {
            popContent: e,
            popTitle: this.detailTitle,
          },
          tablelist: {
            width: '100%',
            title: '违约金信息',
            tableHeader: {
              data: [
                {field: 'dueTimeFront', header: '季度初'},
                {field: 'dueTimeAfter', header: '季度末'},
                {field: 'days', header: '欠费天数'},
                {field: 'amountMoney', header: '金额'},
              ],
              style: {background: '#ffffff', color: '#000000', height: '6vh'},
            },
            tableContent: {
              data: JSON.parse(e.liquidatedDamages),
              styleone: {background: '#ffffff', color: '#000', textAlign: 'center', height: '2vw'},
              styletwo: {background: '#ffffff', color: '#000', textAlign: 'center', height: '2vw'}
            },
          }
        };

      } else {
        this.dialogOption = {
          dialog: true,
          tableHidden: false,
          width: '800',
          title: '详情',
          poplist: {
            popContent: e,
            popTitle:  this.detailTitle,
          }
        };

      }
  }
}
