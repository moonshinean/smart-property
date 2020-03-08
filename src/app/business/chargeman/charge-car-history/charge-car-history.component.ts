import {Component, OnDestroy, OnInit} from '@angular/core';
import {FileOption} from '../../../common/components/basic-dialog/basic-dialog.model';
import {Subscription} from 'rxjs';
import {ChargeHistoryService} from '../../../common/services/charge-history.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {GlobalService} from '../../../common/services/global.service';
import {LocalStorageService} from '../../../common/services/local-storage.service';
import {SharedServiceService} from '../../../common/public/shared-service.service';
import {ThemeService} from '../../../common/public/theme.service';

@Component({
  selector: 'rbi-charge-car-history',
  templateUrl: './charge-car-history.component.html',
  styleUrls: ['./charge-car-history.component.less']
})
export class ChargeCarHistoryComponent implements OnInit, OnDestroy {

  public option: any;
  public paymentDetailTableContnt: any;
  public uploadFileOption: FileOption = new FileOption();
  public uploadRecordOption: any;
  public optionTable: any;
  // 搜索相关
  public searchType = 0;
  public searchOption = [
    {label: '手机号', value: 1},
    {label: '房间号', value: 2},
    {label: '姓名', value: 3},
    {label: '身份证号', value: 4},
  ];
  public SearchData = {
    parkingSpaceCode: '',
    pageNo: 1,
    pageSize: 10
  };
  public searchData = '';

  // 按钮权限相关
  public btnHiden = [
    {label: '导入', hidden: true},
    {label: '导入累计', hidden: true},
    {label: '搜索', hidden: true},
  ];
  // 缴费相关
  // public projectSelectDialog: boolean;
  public chargeStatusoption: any[] = [];
  public detailsDialog: any;
  public nowPage = 1;
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public loadHidden = true;
  public importType: any;
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
    private chargeHistorySrv: ChargeHistoryService,
    private toolSrv: PublicMethedService,
    private globalSrv: GlobalService,
    private localSrv: LocalStorageService,
    private  sharedSrv: SharedServiceService,
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
  public  detailsInitialization(): void {
    this.loadHidden = false;
    this.toolSrv.getAdmStatus([{settingType: 'PAYMENT_METHOD'}] , (data) => {
      this.chargeStatusoption = this.toolSrv.setListMap(data.PAYMENT_METHOD);
      this.queryData();
    });
  }
  // condition search click
  // 判断搜索方式
  public  selectSearchType(): void {
    switch (this.searchType) {
      case 0: this.queryData(); break;
      default:
        break;
    }
  }
  // 搜索事件
  public  parkSearchClick(): void {
    if (this.searchData !== undefined && this.searchData !== null) {
      this.SearchData.parkingSpaceCode = this.searchData;
      this.SearchData.pageNo = 1;
      this.SearchData.pageSize = 10;
      this.queryData();
    }
  }
  // charge item detail
  public  detailsDialogClick(e): void {
    this.detailsDialog = {
      dialog: true,
      tableHidden: false,
      width: '1000',
      type: 1,
      title: '详情',
      poplist: {
        popContent: e,
        popTitle:  [
          {field: 'parkingSpaceCode', header: '车位编号'},
          {field: 'startTime', header: '计费开始时间'},
          {field: 'vacancyCharge', header: '空置费'},
          {field: 'amountReceivable', header: '应收车位管理费'},
          {field: 'actualMoneyCollection', header: '实收车位管理费'},
          {field: 'remarks', header: '备注'},
        ],
      }
    };
    // }
  }

  // paging query
  public  nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.SearchData.pageNo = event;
    this.selectSearchType();
  }

  public  uploadFileClick(value): void {
    this.importType = value;
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
          {field: 'parkingSpaceCode', header: '车位编号'},
          {field: 'startTime', header: '计费开始时间'},
          {field: 'vacancyCharge', header: '空置费'},
          {field: 'amountReceivable', header: '应收车位管理费'},
          {field: 'actualMoneyCollection', header: '实收车位管理费'},
          {field: 'operating', header: '操作'}],
        style: {background: this.table.tableheader.background, color: this.table.tableheader.color, height: '6vh'}
      },
      Content: {
        data: data1,
        styleone: {background: this.table.tableContent[0].background,
          color: this.table.tableContent[0].color, textAlign: 'center', height: '2vw'},
        styletwo: {background: this.table.tableContent[1].background,
          color: this.table.tableContent[1].color, textAlign: 'center', height: '2vw'},
      },
      type: 2,
      tableList:  [{label: '详情', color: this.table.detailBtn}]
    };
  }
  // 上传文件
  public  uploadFileSureClick(e): void {
    if (e.getAll('file').length !== 0) {
      if (this.importType === 1) {
        this.chargeHistorySrv.imporParkingHistoryData(e).subscribe(
          value => {
            if (value.status === '1000') {
              this.uploadRecordOption = {
                width: '900',
                dialog: true,
                title: '上传记录',
                totalNumber: value.data.totalNumber,
                realNumber: value.data.realNumber,
                uploadOption: {
                  width: '100%',
                  tableHeader: {
                    data: [
                      {field: 'code', header: '序号'},
                      {field: 'roomCode', header: '车位编号'},
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
              this.queryData();
              this.uploadFileOption.files = [];
            } else {
              this.toolSrv.setToast('error', '操作失败', value.message);
            }
          }
        );
      } else {
        this.chargeHistorySrv.importCalcData(e).subscribe(
          value => {
            if (value.status === '1000') {
              this.uploadRecordOption = {
                width: '900',
                dialog: true,
                title: '上传记录',
                totalNumber: value.data.totalNumber,
                realNumber: value.data.realNumber,
                uploadOption: {
                  width: '100%',
                  tableHeader: {
                    data: [
                      {field: 'code', header: '序号'},
                      {field: 'roomCode', header: '车位编号'},
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
              this.queryData();
              this.uploadFileOption.files = [];
            } else {
              this.toolSrv.setToast('error', '操作失败', value.message);
            }
          }
        );
      }
    } else {
      this.toolSrv.setToast('error', '操作错误', '请选择文件');
    }

  }
  // 查询数据
  public  queryData(): void {
    this.chargeHistorySrv.queryParkingHistoryPageInfo(this.SearchData).subscribe(
      (value) => {
        console.log(value);
        this.loadHidden = true;
        if (value.status === '1000') {
          value.data.contents.forEach( v => {
            v.paymentMethod = this.toolSrv.setValueToLabel(this.chargeStatusoption, v.paymentMethod);
          });
          this.paymentDetailTableContnt = value.data.contents;
          this.setTableOption(value.data.contents);
        }
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
  }
  // 设置按钮显示权限
  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '专有车位历史数据') {
        this.globalSrv.getChildrenRouter({parentCode: v.parentCode}).subscribe(value => {
          console.log(value);
          value.data.forEach( item => {
            this.btnHiden.forEach( val => {
              if (item.title === val.label) {
                val.hidden = false;
              }
            });
          });
          console.log(this.btnHiden);
        });
      }
    });
  }
}
