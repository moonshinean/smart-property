import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AddCoupon, Coupon, ModifyCoupon} from '../../../common/model/charge-coupon.model';
import {ChargeCouponService} from '../../../common/services/charge-coupon.service';

@Component({
  selector: 'rbi-charge-coupon',
  templateUrl: './charge-coupon.component.html',
  styleUrls: ['./charge-coupon.component.less']
})
export class ChargeCouponComponent implements OnInit {

  @ViewChild('input') input: Input;
  // @ViewChild('file') file: Input;
  public couponTableTitle: any;
  public couponTableContent: Coupon[];
  // public couponTableContent: any;
  public couponTableTitleStyle: any;
  public couponSelect: any;
  // 添加相关
  public couponAddDialog: boolean;
  public couponAdd: AddCoupon = new AddCoupon();
  // public couponAdd: any;
  // 修改相关
  public couponModifayDialog: boolean;
  public couponModify: ModifyCoupon = new ModifyCoupon();
  // public couponModify: any;
  public couponDetailDialog: boolean;
  public couponDetail: ModifyCoupon = new ModifyCoupon();
  public esDate = {
    firstDayOfWeek: 0,
    dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dayNamesMin: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    today: '今天',
    clear: '清除'
  };
  // 上传相关
  // public couponUploadFileDialog: boolean;
  // public uploadedFiles: any[] = [];
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  public loadingHide = true;
  public couponSeachData: any;
  public SearchOption = {
    village: [{label: '未来城', value: '1'}, {label: '云城尚品', value: '2'}],
    region: [{label: 'A3组团', value: '1'}, {label: 'A4组团', value: '2'}, {label: 'A5组团', value: '3'}, {label: 'A6组团', value: '4'}],
    building: [{label: '一栋', value: '1'}, {label: '二栋', value: '2'}, {label: '三栋', value: '3'}, {label: '四栋', value: '4'}],
    unit: [{label: '一单元', value: '1'}, {label: '二单元', value: '2'}, {label: '三单元', value: '3'}, {label: '四单元', value: '4'}],
    room: [{label: '2104', value: '1'}, {label: '2106', value: '2'}, {label: '2107', value: '3'}, {label: '2108', value: '4'}],
  };
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    // private ownreService: BfcouponService
    private chargeCouponSrv: ChargeCouponService
  ) { }
  ngOnInit() {
    this.couponInitialization();
  }

  // initialization houseinfo
  public  couponInitialization(): void {
    console.log('这里是信息的初始化');
    this.couponTableTitle = [
      {field: 'roomCode', header: '房间代码'},
      // {field: 'regionName', header: '地块名称'},
      {field: 'couponName', header: '优惠券名称'},
      {field: 'clientName', header: '客户名称'},
      {field: 'mobilePhone', header: '客户电话'},
      {field: 'DeductedPropertyAmount', header: '抵扣物业费金额'},
      {field: 'balanceAmount', header: '转入余额金额'},
      // {field: 'mobilePhone', header: '手机号'},
      {field: 'operating', header: '操作'}
    ];
    this.loadingHide = false;
    this.chargeCouponSrv.queryCouponPageData({pageNo: 1, pageSize: 10 }).subscribe(
      (value) => {
        console.log(value);
        this.loadingHide = true;
        this.couponTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage:  value.data.pageNo};

      }
    );
    this.couponTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
    console.log(this.couponSelect);

  }
  // condition search click
  public  couponSearchClick(): void {
    // @ts-ignore
    // if (this.couponSeachData !== undefined ) {
    //   if (isNaN(this.couponSeachData)) {
    //     this.chargeCouponSrv.queryConditionalCoupon({}).subscribe(
    //       (value) => {
    //         console.log(value);
    //       }
    //     );
    //   } else {
    //     this.chargeCouponSrv.queryConditionalCoupon({}).subscribe(
    //       (value) => {
    //         console.log(value);
    //       }
    //     );
    //   }
    // }
    console.log('这里是条件搜索');
  }
  // add coupon
  public  couponAddClick(): void {
    this.couponAddDialog = true;
    console.log('这里是添加信息');
  }
  // sure add houseinfo
  public  couponAddSureClick(): void {
    this.confirmationService.confirm({
      message: `确认要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(this.couponSelect);

        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
        console.log('这里是增加信息');

        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }
  // detail couponInfo
  public  couponDetailClick(e): void {
    this.couponDetailDialog = true;
    console.log(e);
    this.couponDetail = e;
  }
  // modify coupon
  public couponModifyClick(): void {
    console.log(this.couponSelect);
    if (this.couponSelect === undefined || this.couponSelect.length === 0 ) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.messageService.clear();
      this.messageService.add({severity: 'error', summary: '操作错误', detail: '请选择需要修改的项'});
      this.cleanTimer = setTimeout(() => {
        this.messageService.clear();
      }, 3000);
    } else if (this.couponSelect.length === 1) {
      this.couponModifayDialog = true;
      console.log('这里是修改信息');
    } else {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.messageService.clear();
      this.messageService.add({severity: 'error', summary: '操作错误', detail: '只能选择一项进行修改'});
      this.cleanTimer = setTimeout(() => {
        this.messageService.clear();
      }, 3000);
    }
  }
  // sure modify coupon
  public  couponModifySureClick(): void {
    this.confirmationService.confirm({
      message: `确认要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(this.couponSelect);

        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
        console.log('这里是修改信息');

        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }
  // delete coupon
  public  couponDeleteClick(): void {
    if (this.couponSelect === undefined || this.couponSelect.length === 0) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.messageService.clear();
      this.messageService.add({severity: 'error', summary: '操作错误', detail: '请选择需要删除的项'});
      this.cleanTimer = setTimeout(() => {
        this.messageService.clear();
      }, 3000);
    } else {
      this.confirmationService.confirm({
        message: `确认要删除这${this.couponSelect.length}项吗`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          console.log(this.couponSelect);

          // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
        },
        reject: () => {
          console.log('这里是删除信息');

          // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
        }
      });
    }
  }
  // select houseinfo
  public  coupononRowSelect(e): void {
    this.couponModify = e.data;
    console.log(this.couponModify);
  }

  // 分页请求
  public  nowpageEventHandle(event: any): void {
    this.loadingHide = false;

    this.chargeCouponSrv.queryCouponPageData({pageNo: event, pageSize: 10 }).subscribe(
      (value) => {
        console.log(value);
        this.loadingHide = true;
        this.couponTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage:  value.data.pageNo};

      }
    );
    this.couponSelect = [];
  }
  // add more info Dialog
  // public  AddMoreClick(): void {
  //   // this.couponUploadFileDialog = true;
  // }

  // upload file
  // public  couponUploadSureClick(): void {
  //   console.log(this.uploadedFiles);
  //   const fileData = new FormData();
  //   this.uploadedFiles.forEach(v => {
  //     fileData.append('file', v);
  //   });
  //   console.log(fileData.getAll('file'));
  //
  //   this.confirmationService.confirm({
  //     message: `确认要上传吗？`,
  //     header: '上传提醒',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       // this.ownreService.uploadFile(fileData).subscribe(
  //       //   (value) => {
  //       //     console.log(value);
  //       //   }
  //       // );
  //       this.messageService.clear();
  //       this.messageService.add({severity: 'success', summary: '操作成功', detail: '上传成功'});
  //       this.cleanTimer = setTimeout(() => {
  //         this.messageService.clear();
  //       }, 3000);
  //       this.uploadedFiles = [];
  //     },
  //     reject: () => {
  //       console.log('这里是上传信息');
  //
  //       // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
  //     }
  //   });
  // }

}
