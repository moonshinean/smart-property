import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
  selector: 'rbi-charge-historicalreport',
  templateUrl: './charge-historicalreport.component.html',
  styleUrls: ['./charge-historicalreport.component.less']
})
export class ChargeHistoricalreportComponent implements OnInit {

  public historicalportTableTitle: any;
  public historicalportTableContent: any;
  public historicalportTableTitleStyle: any;
  public historicalportSelect: any;
  // 缴费相关
  // public projectSelectDialog: boolean;
  public historicalportDetailDialog: boolean;
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
  ) { }
  ngOnInit() {
    this.historicalportInitialization();
  }
  //
  public  historicalportChange(i): void {

    // console.log(i);
    // if (this.tableSet[i].check === 0 ) {
    //   this.tableSet[i].check = 1;
    // } else {
    //   this.tableSet[i].check = 0;
    // }
    // console.log(this.tableSet);
  }
  // initialization historicalport
  public  historicalportInitialization(): void {
    console.log('这里是信息的初始化');
    this.historicalportTableTitle = [
      {field: 'id', header: '序号'},
      {field: 'reportType', header: '报表类型'},
      {field: 'period', header: '时间段'},
      {field: 'downloadTime', header: '导出时间'},
      {field: 'operating', header: '操作'}
    ];
    this.historicalportTableContent = [
      {id: 1, reportType: '应收费用报表', period: '2019.2.3——2019.4.2', downloadTime: '2019-2-3'},
      {id: 2, reportType: '应收费用报表', period: '2019.2.3——2019.4.2', downloadTime: '2019-2-3'},
      {id: 3, reportType: '应收费用报表', period: '2019.2.3——2019.4.2', downloadTime: '2019-2-3'},
      {id: 4, reportType: '实收费用报表', period: '2019.2.3——2019.4.2', downloadTime: '2019-2-3'},
      {id: 5, reportType: '实收费用报表', period: '2019.2.3——2019.4.2', downloadTime: '2019-2-3'},
      {id: 6, reportType: '欠款汇总表', period: '2019.2.3——2019.4.2', downloadTime: '2019-2-3'},
      {id: 7, reportType: '欠款汇总表', period: '2019.2.3——2019.4.2', downloadTime: '2019-2-3'},
      {id: 8, reportType: '费用汇总表', period: '2019.2.3——2019.4.2', downloadTime: '2019-2-3'},
      {id: 9, reportType: '费用汇总表', period: '2019.2.3——2019.4.2', downloadTime: '2019-2-3'},
      {id: 10, reportType: '费用汇总表', period: '2019.2.3——2019.4.2', downloadTime: '2019-2-3'},
      {id: 11, reportType: '费用汇总表', period: '2019.2.3——2019.4.2', downloadTime: '2019-2-3'},
      {id: 12, reportType: '费用汇总表', period: '2019.2.3——2019.4.2', downloadTime: '2019-2-3'},
      {id: 13, reportType: '费用汇总表', period: '2019.2.3——2019.4.2', downloadTime: '2019-2-3'},

    ];
    this.option = {total: 15, row: 10, nowpage: 1};
    this.historicalportTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
    // console.log(this.historicalportSelect);
  }
  // condition search click
  public  historicalportSearchClick(): void {
    // @ts-ignore
    console.log(this.input.nativeElement.value);
    console.log('这里是条件搜索');
  }
  // sure modify historicalport
  public  historicalportSureClick(): void {
    // this.confirmationService.confirm({
    //   message: `是否打印单据吗？`,
    //   header: '打印提醒',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {
    //     console.log(this.historicalportSelect);
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
  }
  // seeing Detail
  public  historicalportDetailClick(): void {
    this.historicalportDetailDialog = true;
  }
  // false modify historicalport
  public  historicalportFaleseClick(): void {
    this.historicalportDetailDialog = false;
  }

}
