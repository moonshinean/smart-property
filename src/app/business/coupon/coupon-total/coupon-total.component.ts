import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {CouponTotalService} from '../../../common/services/coupon-total.service';
import {AddCouponTotal, CouponTotal, SearchCoupon} from '../../../common/model/coupon-total.model';
import {GlobalService} from '../../../common/services/global.service';

@Component({
  selector: 'rbi-coupon-total',
  templateUrl: './coupon-total.component.html',
  styleUrls: ['./coupon-total.component.less']
})
export class CouponTotalComponent implements OnInit {


  @ViewChild('input') input: Input;
  // @ViewChild('file') file: Input;
  public couponTotalTableTitle: any;
  public couponTotalTableContent: CouponTotal[];
  // public couponTotalTableContent: any;
  public couponTotalTableTitleStyle: any;
  public couponTotalSelect: any;
  // 添加相关
  public couponTotalAddDialog: boolean;
  public AddcouponTotal: AddCouponTotal = new AddCouponTotal();
  public couponTotalDetail: CouponTotal = new CouponTotal();
  // 条件查询
  public SearchCoupon: SearchCoupon = new SearchCoupon();
  // public SearchData: SearchCoupon = new SearchCoupon();
  // public couponAdd: any;
  // 修改相关
  public couponTotalModifayDialog: boolean;
  // public couponModify: any;
  public couponTotalDetailDialog: boolean;
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
  // public couponTotalUploadFileDialog: boolean;
  // public uploadedFiles: any[] = [];
  // 其他相关
  public deleteIds: any[] = [];
  public cleanTimer: any; // 清除时钟
  public option: any;
  public loadingHide = true;
  // public couponTotalSeachData: any;

  public nowPage = 1;
  public SearchOption = {
    village: [],
    region: [],
    building: [],
    unit: [],
    room: []
  };
  public couponSelectOption: any[] = [];
  public roonCodeSelectOption: any[] = [];
  public couponTypeName: any;
  public couponMoney: any;
  public couponEffectiveTime: any;
  public pastDueOption: any[] = [];
  public auditStatusOption: any[] = [];
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private couponTotalSrv: CouponTotalService,
    private globalSrv: GlobalService
  ) {
  }

  ngOnInit() {
    this.couponTotalInitialization();
  }

  // initialization houseinfo
  public couponTotalInitialization(): void {
    console.log('这里是信息的初始化');
    this.AddcouponTotal.mobilePhone = null;
    this.AddcouponTotal.roomCode = null;
    this.AddcouponTotal.remarks = null;
    this.couponTotalTableTitle = [
      {field: 'roomCode', header: '房间代码'},
      {field: 'couponName', header: '优惠券名称'},
      {field: 'surname', header: '客户名称'},
      {field: 'mobilePhone', header: '客户电话'},
      {field: 'effectiveTime', header: '有效时长'},
      {field: 'money', header: '金额'},
      {field: 'auditStatus', header: '审核状态'},
      {field: 'pastDue', header: '过期状态'},
      {field: 'operating', header: '操作'}
    ];
    this.loadingHide = false;
    this.couponTotalSrv.queryCouponInfoStatus({settingType: 'PAST_DUE'}).subscribe(
      value => {
        console.log(value);
        value.data.forEach( v => {
          this.pastDueOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    );
    this.couponTotalSrv.queryCouponInfoStatus({settingType: 'AUDIT_STATUS'}).subscribe(
      value => {
        console.log(value);
        value.data.forEach( v => {
          this.auditStatusOption.push({label: v.settingName, value: v.settingCode});

        });
      }
    );
      const page = setInterval(() => {
        if (this.pastDueOption.length > 0 && this.auditStatusOption.length > 0) {

          this.couponTotalSrv.queryCouponPageData({pageNo: this.nowPage, pageSize: 10}).subscribe(
          (value) => {
            console.log(value);
            clearInterval(page);
            this.loadingHide = true;
            if (value.status === '1000') {
              value.data.contents.forEach( h => {
                this.pastDueOption.forEach(v => {
                  if (h.pastDue.toString() === v.value) {
                    h.pastDue = v.label;
                  }
                });
                this.auditStatusOption.forEach(v => {
                  if (h.auditStatus.toString() === v.value){
                    h.auditStatus = v.label;
                  }
                });
              });
              this.couponTotalTableContent = value.data.contents;
              this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
            }  else  {
              this.setToast('error', '请求成功', value.message);
            }
          }
        );
       }
      }, 100);

    this.couponTotalTableTitleStyle = {background: '#282A31', color: '#DEDEDE', height: '6vh'};
    this.globalSrv.queryVillageInfo({}).subscribe(
      (data) => {
        console.log(data);
        data.data.forEach( v => {
          this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
          // = v.villageName;
        });
        // this.villageplaceholder =  this.SearchOption.village[0].label;
      }
    );
  }

  public  VillageChange(e): void {
    this.SearchCoupon.villageCode = '';
    this.SearchCoupon.regionCode = '';
    this.SearchCoupon.buildingCode = '';
    this.SearchCoupon.unitCode = '';
    this.SearchOption.region = [];
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    // this.SearchCoupon.villageCode = e.value;
    this.AddcouponTotal.villageName = e.originalEvent.target.innerText;
    this.globalSrv.queryRegionInfo({villageCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach( v => {
          this. SearchOption.region.push({label: v.regionName, value: v.regionCode});
        });
      }
    );
  }
  public  regionChange(e): void {
    this.SearchCoupon.regionCode = '';
    this.SearchCoupon.buildingCode = '';
    this.SearchCoupon.unitCode = '';
    this.SearchCoupon.regionCode = e.value;
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.AddcouponTotal.regionName = e.originalEvent.target.innerText;
    console.log(e.value);
    this.globalSrv.queryBuilingInfo({regionCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach( v => {
          this. SearchOption.building.push({label: v.buildingName, value: v.buildingCode});
        });
      }
    );
  }
  public  buildingChange(e): void {
    this.SearchCoupon.buildingCode = '';
    this.SearchCoupon.unitCode = '';
    this.SearchOption.unit = [];
    this.SearchCoupon.buildingCode = e.value;
    this.SearchOption.unit = [];
    this.AddcouponTotal.buildingName = e.originalEvent.target.innerText;
    this.globalSrv.queryunitInfo({buildingCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach( v => {
          this. SearchOption.unit.push({label: v.unitName, value: v.unitCode});
        });
      }
    );
  }
  public  unitChange(e): void {
    this.SearchCoupon.unitCode = '';
    this.SearchCoupon.unitCode = e.value;
    this.roonCodeSelectOption = [];
    this.AddcouponTotal.unitName = e.originalEvent.target.innerText;

    this.couponTotalSrv.queryRoomCode({unitCode: e.value}).subscribe(
      value => {
        console.log(value);
        value.data.forEach( v => {
          this.roonCodeSelectOption.push({label: v.roomCode, value: v.roomCode});
          this.SearchOption.room.push({label: v.roomCode, value: v.roomCode});
        });
      }
    );

  }

  // condition search click
  public couponTotalSearchClick(): void {
    if (this.SearchCoupon.buildingCode === '' && this.SearchCoupon.mobilePhone === undefined) {
      this.setToast('error', '搜索失败', '搜索信息条件请具体到楼栋');
    } else {
      this.SearchCoupon.pageNo = 1;
      this.SearchCoupon.pageSize = 10;
      // @ts-ignore
      this.loadHidden = false;
      console.log(this.SearchCoupon);
      this.couponTotalSrv.queryCouponPageData(this.SearchCoupon).subscribe(
        value => {
          console.log(value);
          if (value.status === '1000') {
            this.loadingHide = true;
            if (value.data.contents) {
              this.setToast('success', '搜索成功', value.message);

              this.couponTotalTableContent = value.data.contents;
            } else {
              this.setToast('success', '搜索成功', '数据为空');
            }
          } else {
            this.setToast('error', '搜索失败', value.message);

          }
        }
      );
    }
    console.log('这里是条件搜索');
  }

  // add coupon
  public couponTotalAddClick(): void {
    this.couponSelectOption = [];
    this.couponTotalSrv.queryCouponList({}).subscribe(
      value => {
        console.log(value);
        value.data.forEach( val => {
          this.couponSelectOption.push({label: val.couponName, value: val.couponCode});
        });
      }
    );
    this.couponTotalAddDialog = true;
    console.log('这里是添加信息');
  }
  // search userInfo
  public getUserInfo(): void {
      if (this.AddcouponTotal.mobilePhone !== null && this.AddcouponTotal.roomCode !== null) {
         this.couponTotalSrv.queryCouponUserInfo({roomCode: this.AddcouponTotal.roomCode, mobilePhone: this.AddcouponTotal.mobilePhone}).subscribe(
           value => {
             this.AddcouponTotal.surname = value.data.customerInfoDO.surname;
             this.AddcouponTotal.userId = value.data.customerInfoDO.userId;
           }
         );
      }
  }
  // 选择优惠卷
  public couponSelectChange(e): void {
    this.AddcouponTotal.couponName = e.originalEvent.target.innerText;
    this.couponTotalSrv.queryCouponInfo({couponCode: this.AddcouponTotal.couponCode}).subscribe(
      value => {
        console.log(value);
        this.AddcouponTotal.effectiveTime = value.data.effectiveTime;
        this.AddcouponTotal.money = value.data.money;
        this.couponMoney = '￥' + this.AddcouponTotal.money;
        this.AddcouponTotal.organizationId = value.data.organizationId;
        this.AddcouponTotal.chargeCode = value.data.chargeCode;
        if (value.data.effectiveTime === 0 ) {
          this.couponEffectiveTime = '无期限';
        } else  {
          this.couponEffectiveTime = value.data.effectiveTime + '天';
        }
        this.AddcouponTotal.couponType = value.data.couponType;
        this.couponTotalSrv.queryCouponType({}).subscribe(
          val => {
            console.log(val);
            val.data.forEach( v => {
              if (this.AddcouponTotal.couponType === v.settingCode) {
                this.couponTypeName = v.settingName;
              }
            });
          }
        );
      }
    );
    console.log(this.AddcouponTotal.couponName);
  }
  // sure add houseinfo
  public couponTotalAddSureClick(): void {
    this.confirmationService.confirm({
      message: `确认要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(this.AddcouponTotal);
        this.couponTotalSrv.addCouponInfo(this.AddcouponTotal).subscribe(
          value => {
            console.log(value);
            this.setToast('success', '操作成功', value.message);
            this.couponTotalInitialization();
            this.couponTotalAddDialog = false;
            this.clearData();
          }
        );
        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
        console.log('这里是增加信息');

        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }

  // detail couponTotalInfo
  public couponTotalDetailClick(e): void {
    this.couponTotalDetailDialog = true;
    this.couponTotalDetail = e;
    if (e.effectiveTime === 0 ) {
      this.couponEffectiveTime = '无期限';
    } else  {
      this.couponEffectiveTime = e.effectiveTime + '天';
    }
    this.couponTotalSrv.queryCouponType({}).subscribe(
      val => {
        val.data.forEach( v => {
          if (e.couponType === v.settingCode) {
            this.couponTypeName = v.settingName;
          }
        });
      }
    );
    this.couponTotalSrv.queryCouponInfoStatus({settingType: 'USE_STATUS'}).subscribe(
      value => {
        console.log(value);
        value.data.forEach( v => {
          if (e.usageState.toString() === v.settingCode) {
            this.couponTotalDetail.usageState = v.settingName;
          }
        });
      }
    );
    this.couponTotalSrv.queryCouponInfoStatus({settingType: 'PAST_DUE'}).subscribe(
      value => {
        console.log(value);
        value.data.forEach( v => {
          if (e.pastDue.toString() === v.settingCode) {
            this.couponTotalDetail.pastDue = v.settingName;
          }
        });
      }
    );
    this.couponTotalSrv.queryCouponInfoStatus({settingType: 'AUDIT_STATUS'}).subscribe(
      value => {
        console.log(value);
        value.data.forEach( v => {
          if (e.auditStatus.toString() === v.settingCode) {
            this.couponTotalDetail.auditStatus = v.settingName;
          }
        });
      }
    );
    console.log(e);
  }

  // modify couponTotal
  public couponTotalModifyClick(): void {
    console.log(this.couponTotalSelect);
    if (this.couponTotalSelect === undefined || this.couponTotalSelect.length === 0) {
      this.setToast('error', '操作错误', '请选择需要修改的项');

    } else if (this.couponTotalSelect.length === 1) {
      this.couponTotalModifayDialog = true;
      console.log('这里是修改信息');
    } else {
      this.setToast('error', '操作错误', '只能选择一项进行修改');

    }
  }

  // sure modify coupon
  public couponTotalModifySureClick(): void {
    this.confirmationService.confirm({
      message: `确认要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(this.couponTotalSelect);
        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
        console.log('这里是修改信息');

        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }

  // delete coupon
  public couponTotalDeleteClick(): void {
    if (this.couponTotalSelect === undefined || this.couponTotalSelect.length === 0) {
      this.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.confirmationService.confirm({
        message: `确认要删除这${this.couponTotalSelect.length}项吗`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          console.log(this.couponTotalSelect);
          this.couponTotalSelect.forEach( v => {
            this.deleteIds.push(v.id);
          });
          console.log(this.deleteIds.join(','));
          this.couponTotalSrv.deleteCouponInfo({ids: this.deleteIds.join(',')}).subscribe(
            value => {
              console.log(value);
              this.setToast('success', '操作成功', value.message);
              this.couponTotalInitialization();
            }
          );

          // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
        },
        reject: () => {
          console.log('这里是删除信息');

          // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
        }
      });
    }
  }
  // 分页请求
  public nowpageEventHandle(event: any): void {
    this.loadingHide = false;
    this.nowPage = event;
    this.couponTotalSrv.queryCouponPageData({pageNo: event, pageSize: 10}).subscribe(
      (value) => {
        console.log(value);
        this.loadingHide = true;
        this.couponTotalTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};

      }
    );
    this.couponTotalSelect = [];
  }

  public  setToast(type, title, message): void {
    if (this.cleanTimer) {
      clearTimeout(this.cleanTimer);
    }
    this.messageService.clear();
    this.messageService.add({severity: type, summary: title, detail: message});
    this.cleanTimer = setTimeout(() => {
      this.messageService.clear();
    }, 3000);
  }
  public clearData(): void {
    this.AddcouponTotal = new AddCouponTotal();
    this.couponTypeName = null;
    this.couponMoney = null;
    this.couponEffectiveTime = null;
    this.SearchOption = {village: [], region: [], building: [], unit: [], room: []};
    this.couponSelectOption = [];
    this.roonCodeSelectOption = [];
  }

}
