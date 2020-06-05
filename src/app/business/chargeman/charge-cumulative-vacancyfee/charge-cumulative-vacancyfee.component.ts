import {Component, OnDestroy, OnInit} from '@angular/core';
import {FileOption} from '../../../common/components/basic-dialog/basic-dialog.model';
import {ChargeDetail} from '../../../common/model/charge-detail.model';
import {Subscription} from 'rxjs';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {GlobalService} from '../../../common/services/global.service';
import {ChargePaymentService} from '../../../common/services/charge-payment.service';
import {LocalStorageService} from '../../../common/services/local-storage.service';
import {SharedServiceService} from '../../../common/public/shared-service.service';
import {DatePipe} from '@angular/common';
import {ThemeService} from '../../../common/public/theme.service';
import {ChargeCumulativeVacancyfeeService} from '../../../common/services/charge-cumulative-vacancyfee.service';

@Component({
  selector: 'rbi-charge-cumulative-vacancyfee',
  templateUrl: './charge-cumulative-vacancyfee.component.html',
  styleUrls: ['./charge-cumulative-vacancyfee.component.less']
})
export class ChargeCumulativeVacancyfeeComponent implements OnInit, OnDestroy {


  public option: any;
  public paymentDetailSelect: any[] = [];
  public paymentDetailTableContnt: any;
  // 状态值相关
  public uploadFileOption: FileOption = new FileOption();
  public uploadRecordOption: any;
  public optionTable: any;
  public SearchData = {
    roomCode: '',
    pageNo: 1,
    pageSize: 10
  };
  public searchData = '';
  // 修改弹窗
  public dialogOption: any;
  // 按钮权限相关
  public btnHiden = [
    {label: '导入', hidden: true},
    {label: '搜索', hidden: true},
    {label: '上传', hidden: true},
  ];
  // 缴费相关
  // public projectSelectDialog: boolean;
  public chargeStatusoption: any[] = [];
  public detailsDialog: boolean;
  public nowPage = 1;
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public esDate: any;
  public detailData = {
    roomCode: '',
    roomSize: '',
    vacancyCharge: '',
    deliveryTime: '',
    remarks: '',
    idt: '',
  };
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
    private chargeCumulativeVacancyfeeSrv: ChargeCumulativeVacancyfeeService,
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
          // console.log(key);
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
  public  detailsInitialization(): void {
    this.esDate = this.toolSrv.esDate;
    this.queryData();

  }
  // condition search click
  public  detailsSearchClick(): void {
    this.nowPage = this.SearchData.pageNo = 1;
    this.queryData();
  }
  // charge item detail
  public  detailsDialogClick(e): void {
    for (const key in this.detailData) {
      this.detailData[key] = e[key];
    }
    this.detailsDialog = true;
  }

  // paging query
  public  nowpageEventHandle(event: any): void {
    this.nowPage = event;
    this.SearchData.pageNo = event;
    this.queryData();
  }

  public  uploadFileClick(): void {
    this.uploadFileOption.width = '900';
    this.uploadFileOption.dialog = true;
    this.uploadFileOption.files = [];
  }
  // set table data （设置列表数据）
  public  setTableOption(data1): void {
    this.optionTable = {
      width: '100%',
      header: {
        data:  [
          {field: 'roomCode', header: '房间编号'},
          {field: 'roomSize', header: '住房面积'},

          {field: 'vacancyCharge', header: '空置费'},
          // {field: 'paymentMethod', header: '支付方式'},
          {field: 'deliveryTime', header: '房开交互时间'},
          {field: 'remarks', header: '备注'},
          {field: 'idt', header: '上传时间'},
          {field: 'operating', header: '操作'}],
        style: {background: this.table.tableheader.background, color: this.table.tableheader.color, height: '6vh'}
      },
      Content: {
        data: data1,
        styleone: {background: this.table.tableContent[0].background, color: this.table.tableContent[0].color, textAlign: 'center', height: '2vw'},
        styletwo: {background: this.table.tableContent[1].background, color: this.table.tableContent[1].color, textAlign: 'center', height: '2vw'},
      },
      type: 4,
      tableList:  [{label: '详情', color: this.table.detailBtn}]
    };
  }

  public  uploadFileSureClick(e): void {
    if (e.getAll('file').length !== 0) {
      this.chargeCumulativeVacancyfeeSrv.importCumulativeVacancyFeeFile(e).subscribe(
        value => {
          console.log(value);
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
                  style: {background: this.table.tableheader.background, color: this.table.tableheader.color, height: '6vh'}
                },
                tableContent: {
                  data: value.data.logOldBillsDOS,
                  styleone: {background: this.table.tableContent[0].background, color: this.table.tableContent[0].color, textAlign: 'center', height: '2vw'},
                  styletwo: {background: this.table.tableContent[1].background, color: this.table.tableContent[1].color, textAlign: 'center', height: '2vw'},
                }
              }
            };
            this.uploadFileOption.files = [];
          } else {
            this.toolSrv.setToast('error', '操作失败', value.message);
          }
        }
      );
    } else {
      this.toolSrv.setToast('error', '操作错误', '请选择文件');
    }

  }
  // 分页查询
  public  queryData(): void {
    this.chargeCumulativeVacancyfeeSrv.getCumulativeVacancyFeePageData(this.SearchData).subscribe(
      (value) => {
        if (value.status === '1000') {
          if (value.data.contents.length === 0) {
            if (this.SearchData.pageNo !== 1) {
              this.SearchData.pageNo = this.nowPage = value.data.totalPage;
              this.queryData();
            } else {
              this.paymentDetailTableContnt = value.data.contents;
              this.setTableOption(value.data.contents);
            }
          } else {
            value.data.contents.forEach( v => {
              v.paymentMethod = this.toolSrv.setValueToLabel(this.chargeStatusoption, v.paymentMethod);
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
  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '空置费累计') {
        this.globalSrv.getChildrenRouter({parentCode: v.parentCode}).subscribe(value => {
          value.data.forEach(item => {
            this.btnHiden.forEach( val => {
              if (item.title === val.label) {
                val.hidden = false;
              }
            });
          });
        });
      }
    });
  }
}
