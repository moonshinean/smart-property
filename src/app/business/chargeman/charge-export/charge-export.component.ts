import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ChargeExportService} from '../../../common/services/charge-export.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AddOwner, ModifyOwner} from '../../../common/model/bf-owner.model';
import {exportData} from '../../../common/model/chaege-export.model';
import {DatePipe} from '@angular/common';
import {PublicMethedService} from '../../../common/public/public-methed.service';

@Component({
  selector: 'rbi-charge-export',
  templateUrl: './charge-export.component.html',
  styleUrls: ['./charge-export.component.less']
})
export class ChargeExportComponent implements OnInit {

  public exportTableTitle: any;
  public exportTableContent: any;
  public exportTableTitleStyle: any;
  public exportSelect: any;
  public exportTypeOption = [];
  public exportCode = null;
  // 缴费相关
  // public projectSelectDialog: boolean;
  public exportDialog: boolean;
  public option: any;
  public loadHidden  = true;
  public nowPage = 1;
  // public exportTotle = '￥0';
  // 初始化项目
  public tableSet = [];
  public tableSearchData = [];
  public tableFuzzySearch = [];
  public tableTimeSet = [];
  public exportRequestData: exportData = new exportData();
  public exportDetail: any[] =[];
  public exportDetailDialog: boolean;
  // 其他相关
  public esDate: any;
  constructor(
    private exportSrv: ChargeExportService,
    private confirmationService: ConfirmationService,
    private toolSrv: PublicMethedService,
    private datePipe: DatePipe
  ) { }
  ngOnInit() {
    this.exportInitialization();
  }
  public  exportInitialization(): void {
    this.exportTableTitle = [
      {field: 'id', header: '序号'},
      {field: 'houseCode', header: '房间号'},
      {field: 'houseArea', header: '建筑面积'},
      {field: 'owner', header: '业主'},
      {field: 'iphone', header: '手机号'},
      {field: 'expirationTime', header: '物业费到期时间'},
      {field: 'operating', header: '操作'}
    ];
    this.esDate = this.toolSrv.esDate;
    this.exportSrv.queryChargeReportTypeInfo({}).subscribe(
      value => {
        value.data.forEach( v => {
          this.exportTypeOption.push({label: v.title, value: v.code});
        });
      }
    );
    this.exportTableContent = [];
    this.exportRequestData.endTime = null;
    this.exportRequestData.startTime = null;
    this.exportTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
  }
  // select exportType
  public exportTypeChange(e): void {
    this.exportRequestData.code = e.value;
    this.exportRequestData.title = e.originalEvent.target.innerText;
  }

  // table set data
  public  exportTableSetClick(): void {
    if (this.exportCode !== null) {
      this.tableSet = [];
      this.tableSearchData = [];
      this.tableFuzzySearch = [];
      this.tableTimeSet = [];
      this.exportSrv.querySetChargeReportInfo({code: this.exportCode}).subscribe(
        value => {
          value.data.displayResults.forEach( v => {
            this.tableSet.push({title : v.title , value: v.parentCode, code: v.code, check : 0});
          });
          value.data.queryCriteria.forEach( v => {
            if (v.status === 3) {
              this.tableTimeSet.push({title: v.title, time: '', code: v.code, parentCode: v.parentCode});
            } else if (v.status === 1) {
              this.tableFuzzySearch.push({title: v.title, value: '', parentCode: v.parentCode});
            } else {
              this.tableSearchData.push({title: v.title, value: '', option: '', parentCode: v.parentCode});
            }
          });
          this.exportDialog = true;
        }
      );
    } else  {
      this.toolSrv.setToast('error', '操作错误', '请先选择报表类型');
    }
  }

  // Report data selection
  public  exportChange(i): void {
      if (this.tableSet[i].check === 0 ) {
         this.tableSet[i].check = 1;
      } else {
        this.tableSet[i].check = 0;
      }
  }
  // download table data
  public  exportTableClick(): void {
    if (this.exportTableContent.length !== 0) {
      this.confirmationService.confirm({
        message: `数据获取成功，确认要导出表格吗？`,
        header: '导出提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.exportSrv.queryGetReportInfo(this.exportRequestData).subscribe(
            value => {
              if (value.status === '1000') {
                window.open(value.data);
              }
            }
          );

          // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
        },
        reject: () => {
          // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
        }
      });
    } else {
      this.toolSrv.setToast('error', '操作失败', '请先设置表格参数');
    }
  }
  // initialization export
  // condition search click
  public  exportSearchClick(e): void {
    // @ts-ignore
  }
  public  exportDialogClick(e): void {
    this.exportDetail = [];
    this.tableSet.forEach( (v) => {
      if (v.check === 1) {
          this.exportDetail.push({code: this.toHump(v.code), title: v.title, value: ''});
      }
    });
    this.exportDetail.forEach( val => {
      val.value = e[val.code];
    });
    this.exportDetailDialog = true;
  }
  // sure modify export
  public  exportSureClick(): void {
    this.exportRequestData.queryCriteria = [];
    this.exportRequestData.displayResults = [];
    this.tableTimeSet.forEach( v => {
        if ( v.code === 'startTime') {
          this.exportRequestData.startTime = this.datePipe.transform( v.time , 'yyyy-MM-dd');
        } else if ( v.code === 'endTime') {
          this.exportRequestData.endTime = this.datePipe.transform( v.time , 'yyyy-MM-dd');
        } else {
          const obj = {};
          obj[v.code] = v.title;
          this.exportRequestData.queryCriteria.push(obj);
        }
     });
    this.tableSet.forEach( v => {
      if (v.check === 1) {
        const obj = {};
        obj[v.code] = v.title;
        this.exportRequestData.displayResults.push(obj);
      }
    });
    this.tableSearchData.forEach( v => {
      const obj = {};
      obj[v.code] = v.title;
      this.exportRequestData.queryCriteria.push(obj);
    });
    this.tableFuzzySearch.forEach( v => {
      const obj = {};
      obj[v.code] = v.title;
      this.exportRequestData.queryCriteria.push(obj);
    });
    this.exportRequestData.pageNo = this.nowPage;
    this.exportRequestData.pageSize = 10;
    this.exportTableTitle = [];
    this.tableSet.forEach( (v) => {
      if (v.check === 1) {
        if (this.exportTableTitle.length <= 4) {
          this.exportTableTitle.push({field: this.toHump(v.code), header: v.title});
        }
     }
    });
    this.exportTableTitle.push({field: 'operating', header: '操作'});
    this.getExportData(this.exportRequestData);
     // this.table
  }
  // get data for setting tableTitle
  public getExportData(data): void {
    this.exportSrv.queryChargeReportPage(data).subscribe(
      value => {
        if (value.status === '1000') {
          if (value.data.contents.length !== 0) {
            this.exportTableContent = value.data.contents;
            this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
            this.exportTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
            this.exportDialog = false;
          } else {
            this.toolSrv.setToast('warn', '操作失败', '请重新选择');
          }

        }
      }
    );
  }
  // false modify export
  public  exportFaleseClick(): void {
    this.exportDialog = false;
    // this.exportRequestData = new exportData();
  }
  // paging query
  public  nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.exportRequestData.pageNo = event;
    this.exportSrv.queryChargeReportPage(this.exportRequestData).subscribe(
        (value) => {
          if (value.status === '1000') {
            if (value.data.contents) {
              this.exportTableContent = value.data.contents;
            }
            this.loadHidden = true;
            this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
          }
        }
      );
  }
  // Underline to hump
  public toHump(name) {
    return name.replace(/\_(\w)/g, (all, letter) => {
      return letter.toUpperCase();
    });
  }
}
