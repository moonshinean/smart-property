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
    // private toolSrv: PublicMethedService,
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
      {field: 'houseCode', header: '房间号'},
      {field: 'PrepaymentType', header: '预缴方式'},
      {field: 'PrepaymentAmount', header: '预缴金额'},
      {field: 'PrepaymentPeople', header: '预缴人'},
      {field: 'PrepaymentTime', header: '预缴时间'},
      {field: 'operating', header: '操作'}
    ];
    this.loadHidden = false;
    this.prepaymentSrv.queryPrepaymentPage({pageNo: this.nowPage, pageSize: 10}).subscribe(
      value => {
        this.loadHidden = true;
        if (value.status === '1000') {
          if (value.data.contents) {
            this.prepaymentTableContent = value.data.contents;
          }
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        } else {

        }
      }
    );
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
  public  prepaymentDetailClick(): void {
    this.prepaymentDetailDialog = true;
  }

  // paging query
  public  nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.prepaymentSrv.queryPrepaymentPage({pageNo: event , pageSize: 10}).subscribe(
      (value) => {
        this.loadHidden = true;

        if (value.data.contents) {
          this.prepaymentTableContent = value.data.contents;
        }
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
    this.prepaymentSelect = [];
  }
}
