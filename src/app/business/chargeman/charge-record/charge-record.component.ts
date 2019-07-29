import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ChargeRecordService} from '../../../common/services/charge-record.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {PublicMethedService} from '../../../common/public/public-methed.service';

@Component({
  selector: 'rbi-charge-record',
  templateUrl: './charge-record.component.html',
  styleUrls: ['./charge-record.component.less']
})
export class ChargeRecordComponent implements OnInit {

  public recordTableTitle: any;
  public recordTableContent: any;
  public recordTableTitleStyle: any;
  public recordSelect: any;
  // 缴费相关
  public recordDetailDialog: boolean;
  // 其他相关

  public option: any;
  // public SearchOption = {
  //   village: [{label: '未来城', value: '1'}, {label: '云城尚品', value: '2'}],
  //   region: [{label: 'A3组团', value: '1'}, {label: 'A4组团', value: '2'}, {label: 'A5组团', value: '3'}, {label: 'A6组团', value: '4'}],
  //   building: [{label: '一栋', value: '1'}, {label: '二栋', value: '2'}, {label: '三栋', value: '3'}, {label: '四栋', value: '4'}],
  //   unit: [{label: '一单元', value: '1'}, {label: '二单元', value: '2'}, {label: '三单元', value: '3'}, {label: '四单元', value: '4'}],
  //   room: [{label: '2104', value: '1'}, {label: '2106', value: '2'}, {label: '2107', value: '3'}, {label: '2108', value: '4'}],
  // };
  public nowPage = 1;
  constructor(

    private toolSrv: PublicMethedService,
    private chargeRecordSrv: ChargeRecordService
  ) { }
  ngOnInit() {
    this.recordInitialization();
  }
  // initialization record
  public  recordInitialization(): void {
    this.recordTableTitle = [
      {field: 'id', header: '序号'},
      {field: 'chargeName', header: '项目名称'},
      {field: 'paymentMethod', header: '退款方式'},
      {field: 'roomCode', header: '房间编号'},
      {field: 'amountReceivable', header: '退款金额'},
      {field: 'surname', header: '客户'},
      {field: 'operating', header: '操作'}
    ];
    this.recordTableContent = [];
    this.chargeRecordSrv.queryRecordPage({pageNo: this.nowPage, pageSize: 10}).subscribe(
      value => {
        if (value.status === '1000') {
          this.recordTableContent = value.data.contents;
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        }
      }
    );
    this.recordTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
    // console.log(this.recordSelect);
  }
 /* // condition search click
  // public  recordSearchClick(e): void {
  //   // @ts-ignore
  //   console.log(this.input.nativeElement.value);
  //   console.log('这里是条件搜索');
  // }*/
  // sure modify record
  public  recordSureClick(): void {
  }
  // seeing Detail
  public  recordDetailClick(): void {
      this.recordDetailDialog = true;
  }
  // false modify record
  public  recordFaleseClick(): void {
    this.recordDetailDialog = false;
  }
}
