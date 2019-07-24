import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {RefundNoService} from '../../../common/services/refund-No.service';
import {GlobalService} from '../../../common/services/global.service';
import {ApplicationRefund} from '../../../common/model/refund-no.model';
import {ModifyRefundInfo} from '../../../common/model/refund-info.model';

@Component({
  selector: 'rbi-refund-no',
  templateUrl: './refund-no.component.html',
  styleUrls: ['./refund-no.component.less']
})
export class RefundNoComponent implements OnInit {


  @ViewChild('input') input: Input;
  public refundNoTableTitle: any;
  public refundNoTableContent: any[];
  public refundNoTableTitleStyle: any;
  public refundNoSelect: any[];
  // 添加相关
  public refundNoAddDialog: boolean;
  public refundNoAdd: any;
  public  licensePlateColorOption: any[] = [];
  public  licensePlateTypeOption: any[] = [];
  public  refundNoOriginalTypeOption: any[] = [];
  // 修改相关
  public refundNoModifayDialog: boolean;
  public refundNoModify: any;
  public licensePlateColorModify: any;
  public licensePlateTypeModify: any;
  public refundNoOriginalTypeModify: any;
  public paymentTypeDetail: any;
  public refundStatusDetail: any;
  // 详情相关
  public refundNoDetailDialog: boolean;
  public refundNoDetail: ModifyRefundInfo = new ModifyRefundInfo();

  // 申请退款
  public RefundDialog: any;
  public ApplicationRefund: ApplicationRefund = new ApplicationRefund();
  public refundReason: any;
  // public msgs: Message[] = []; // 消息弹窗
  public SearchOption = {
    village: [],
    region: [],
    building: [],
    unit: []
  };
  public deleteIds: any[] = [];
  public option: any;
  public loadHidden = true;
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public nowPage = 1;
  public roonCodeSelectOption: any[] = [];

  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private refundNoSrv: RefundNoService,
    private globalSrv: GlobalService,
  ) {
  }

  ngOnInit() {
    this.refundNoInitialization();
  }

  // initialization refundNo
  public refundNoInitialization(): void {
    console.log('这里是信息的初始化');
    this.ApplicationRefund.remark = null;
    this.refundNoTableTitle = [
      {field: 'orderId', header: '订单Id'},
      {field: 'payerName', header: '缴费人姓名'},
      {field: 'paymentMethod', header: '支付方式'},
      {field: 'roomCode', header: '房间编号'},
      {field: 'chargeName', header: '项目名称'},
      {field: 'actualMoneyCollection', header: '实收金额'},
      {field: 'operating', header: '操作'},
    ];
    this.loadHidden = false;
    this.refundNoSrv.queryRefundNoInfoPage({pageNo: this.nowPage, pageSize: 10}).subscribe(
      value => {
        this.loadHidden = true;
        console.log(value);
        this.refundNoTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
    this.globalSrv.queryVillageInfo({}).subscribe(
      (data) => {
        console.log(data);
        data.data.forEach(v => {
          this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
          // = v.villageName;
        });
        // this.villageplaceholder =  this.SearchOption.village[0].label;
      }
    );
    this.refundNoTableTitleStyle = {background: '#282A31', color: '#DEDEDE', height: '6vh'};
    console.log(this.refundNoSelect);

  }

  // village change
  public VillageChange(e): void {
    // console.log(this.test);
    this.loadHidden = false;
    this.SearchOption.region = [];
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.refundNoAdd.villageName = e.originalEvent.target.innerText;
    // this.refundNoAdd.villageCode = e.value;
    this.refundNoModify.villageName = e.originalEvent.target.innerText;
    // this.refundNoModify.villageCode = e.value;
    this.globalSrv.queryRegionInfo({villageCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach(v => {
          this.loadHidden = true;
          this.SearchOption.region.push({label: v.regionName, value: v.regionCode});
        });
      }
    );
  }
  public regionChange(e): void {
    this.loadHidden = false;
    this.SearchOption.unit = [];
    this.refundNoAdd.regionName = e.originalEvent.target.innerText;
    // this.refundNoAdd.regionCode = e.value;
    this.refundNoModify.regionName = e.originalEvent.target.innerText;
    // this.refundNoModify.regionCode = e.value;
    console.log(e.value);
    this.globalSrv.queryBuilingInfo({regionCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach(v => {
          this.SearchOption.building.push({label: v.buildingName, value: v.buildingCode});
        });
        this.loadHidden = true;

      }
    );
  }
  public buildingChange(e): void {
    this.SearchOption.unit = [];
    this.refundNoAdd.buildingName = e.originalEvent.target.innerText;
    this.globalSrv.queryunitInfo({buildingCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach(v => {
          this.SearchOption.unit.push({label: v.unitName, value: v.unitCode});
        });
      }
    );
  }
  public unitChange(e): void {
    console.log(e.value);
    this.refundNoAdd.unitName = e.originalEvent.target.innerText;
    // this.refundNoSrv.queryRoomCode({unitCode: e.value}).subscribe(
    //   value => {
    //     console.log(value);
    //     value.data.forEach( v => {
    //       this.roonCodeSelectOption.push({label: v.roomCode, value: v.roomCode});
    //     });
    //   }
    // );
  }
  // condition search click
  public refundNoSearchClick(): void {
    // @ts-ignore
    console.log(this.input.nativeElement.value);
    console.log('这里是条件搜索');
  }
  public  InfoRefundClick(e): void {
    console.log(e);
    this.ApplicationRefund.refundableAmount = e.refundableAmount;
    this.ApplicationRefund.actualMoneyCollection = e.actualMoneyCollection;
    this.ApplicationRefund.orderId = e.orderId;
    this.ApplicationRefund.organizationId = e.organizationId;
    this.refundReason = e.reasonForDeduction;
    this.RefundDialog = true;
  }
  public  refundSureClick(): void {
    if (Number(this.ApplicationRefund.transferCardAmount) + Number(this.ApplicationRefund.deductionPropertyFee) === Number(this.ApplicationRefund.refundableAmount)) {
      this.refundNoSrv.applicationRefund(this.ApplicationRefund).subscribe(
        value => {
          console.log(value);
          if (value.status === '1000') {
            this.setToast('success', '操作成功', '申请退款成功');
            this.RefundDialog = false;
            this.ApplicationRefund = new ApplicationRefund();
            this.refundNoInitialization();
          }
        }
      );
    } else {
      this.setToast('error', '操作错误', '输入金额与退还总金额不匹配,请重新输入');
    }
  }
  // add refundNo
  public refundNoAddClick(): void {
    // this.refundNoSrv.queryrefundNoAllType({settingType: 'LICENSE_PLATE_COLOR'}).subscribe(
    //   value => {
    //     console.log(value);
    //     value.data.forEach( v => {
    //       // console.log();
    //       this.licensePlateColorOption.push({label: v.settingName, value: v.settingCode});
    //     });
    //   }
    // );
    // this.refundNoSrv.queryrefundNoAllType({settingType: 'LICENSE_PLATE_TYPE'}).subscribe(
    //   value => {
    //     console.log(value);
    //     value.data.forEach( v => {
    //       // console.log();
    //       this.licensePlateTypeOption.push({label: v.settingName, value: v.settingCode});
    //     });
    //   }
    // );
    // this.refundNoSrv.queryrefundNoAllType({settingType: 'refundNo_ORIGINA_TYPE'}).subscribe(
    //   value => {
    //     console.log(value);
    //     value.data.forEach( v => {
    //       // console.log();
    //       this.refundNoOriginalTypeOption.push({label: v.settingName, value: v.settingCode});
    //     });
    //   }
    // );
    // this.refundNoSrv.queryParkSpaceNatureStatus({settingType: 'CWXZ'}).subscribe(
    //   value => {
    //     this.parkSpaceNatureOption = [];
    //     value.data.forEach(v => {
    //       this.parkSpaceNatureOption.push({label: v.settingName, value: v.settingCode});
    //     });
    //   }
    // );
    // this.refundNoSrv.queryParkSpaceNatureStatus({settingType: 'CWLX'}).subscribe(
    //   value => {
    //     this.parkSpaceTypeOption = [];
    //     value.data.forEach(v => {
    //       this.parkSpaceTypeOption.push({label: v.settingName, value: v.settingCode});
    //     });
    //   }
    // );
    this.refundNoAddDialog = true;
  }
  // sure add refundNo
  // public refundNoAddSureClick(): void {
  //   this.confirmationService.confirm({
  //     message: `确认要增加吗？`,
  //     header: '增加提醒',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       console.log(this.refundNoAdd);
  //       this.refundNoSrv.addRefunrefundNo(this.refundNoAdd).subscribe(
  //         value => {
  //           if (value.status === '1000') {
  //             this.setToast('success', '操作成功', value.message);
  //             this.clearData();
  //             this.refundNoAddDialog = false;
  //             this.refundNoInitialization();
  //           }
  //         }
  //       );
  //
  //       // this.msgs = [{severity:'refundNo', summary:'Confirmed', detail:'You have accepted'}];
  //     },
  //     reject: () => {
  //       console.log('这里是增加信息');
  //
  //       // this.msgs = [{severity:'refundNo', summary:'Rejected', detail:'You have rejected'}];
  //     }
  //   });
  // }
  //  refundNo detail
  public refundNoDetailClick(e): void {
    this.refundNoDetail = e;
    this.refundNoSrv.queryRefundStatus({settingType: 'ARREARS_STATUS'}).subscribe(
      value => {
        if (value.data.length > 0) {
          value.data.forEach( v => {
            if (this.refundNoDetail.refundStatus.toString() === v.settingCode) {
              this.refundStatusDetail = v.settingName;
            }
          });
        }
      }
    );
    this.refundNoSrv.queryRefundStatus({settingType: 'CHARGE_TYPE'}).subscribe(
      value => {
        if (value.data.length > 0) {
          value.data.forEach( v => {
            if (this.refundNoDetail.paymentType.toString() === v.settingCode) {
              this.paymentTypeDetail = v.settingName;
            }
          });
        }
      }
    );
    // this.refundNoSrv.queryrefundNoAllType({settingType: 'LICENSE_PLATE_COLOR'}).subscribe(
    //   value => {
    //     value.data.forEach( v => {
    //       if (this.refundNoDetail.licensePlateColor === v.settingCode) {
    //         this.licensePlateColorModify = v.settingName;
    //       }
    //     });
    //   }
    // );
    // this.refundNoSrv.queryrefundNoAllType({settingType: 'LICENSE_PLATE_TYPE'}).subscribe(
    //   value => {
    //     value.data.forEach( v => {
    //       if (this.refundNoDetail.licensePlateType === v.settingCode) {
    //         this.licensePlateTypeModify = v.settingName;
    //       }
    //     });
    //   }
    // );
    // this.refundNoSrv.queryrefundNoAllType({settingType: 'refundNo_ORIGINA_TYPE'}).subscribe(
    //   value => {
    //     value.data.forEach( v => {
    //       if (this.refundNoDetail.refundNoOriginalType === v.settingCode) {
    //         this.refundNoOriginalTypeModify = v.settingName;
    //       }
    //     });
    //   }
    // );
    this.refundNoDetailDialog = true;

  }
  // refundNo select
  public  refundNoonRowSelect(e): void {
    this.refundNoModify = e.data;
  }
  public  transferCardAmountChange(): void {
    this.ApplicationRefund.deductionPropertyFee = 2000 - Number(this.ApplicationRefund.transferCardAmount)
  }
  // modify refundNo
  public refundNoModifyClick(): void {
    if (this.refundNoSelect === undefined || this.refundNoSelect.length === 0) {
      this.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.refundNoSelect.length === 1) {
      // this.refundNoSrv.queryrefundNoAllType({settingType: 'LICENSE_PLATE_COLOR'}).subscribe(
      //   value => {
      //     value.data.forEach( v => {
      //       // console.log();
      //       this.licensePlateColorOption.push({label: v.settingName, value: v.settingCode});
      //       if (this.refundNoModify.licensePlateColor === v.settingCode) {
      //         this.licensePlateColorModify = v.settingName;
      //       }
      //     });
      //   }
      // );
      // this.refundNoSrv.queryrefundNoAllType({settingType: 'LICENSE_PLATE_TYPE'}).subscribe(
      //   value => {
      //     value.data.forEach( v => {
      //       // console.log();
      //       this.licensePlateTypeOption.push({label: v.settingName, value: v.settingCode});
      //       if (this.refundNoModify.licensePlateType === v.settingCode) {
      //         this.licensePlateTypeModify = v.settingName;
      //       }
      //     });
      //   }
      // );
      // this.refundNoSrv.queryrefundNoAllType({settingType: 'refundNo_ORIGINA_TYPE'}).subscribe(
      //   value => {
      //     value.data.forEach( v => {
      //       // console.log();
      //       this.refundNoOriginalTypeOption.push({label: v.settingName, value: v.settingCode});
      //       if (this.refundNoModify.refundNoOriginalType === v.settingCode) {
      //         this.refundNoOriginalTypeModify = v.settingName;
      //       }
      //     });
      //   }
      // );
      this.refundNoModifayDialog = true;
    } else {
      this.setToast('error', '操作错误', '只能选择一项进行修改');
    }
  }

  // sure modify refundNo
  // public refundNoModifySureClick(): void {
  //   this.confirmationService.confirm({
  //     message: `确认要修改吗？`,
  //     header: '修改提醒',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       this.refundNoSrv.updateRefunrefundNo(this.refundNoModify).subscribe(
  //         value => {
  //           if (value.status === '1000') {
  //             this.setToast('success', '操作成功', value.message);
  //             this.refundNoModifayDialog = false;
  //             this.clearData();
  //             this.refundNoInitialization();
  //           }
  //         }
  //       );
  //     },
  //     reject: () => {
  //
  //     }
  //   });
  // }

  // delete refundNo
  // public refundNoDeleteClick(): void {
  //   if (this.refundNoSelect === undefined || this.refundNoSelect.length === 0) {
  //     this.setToast('error', '操作错误', '请选择需要删除的项');
  //   } else {
  //     this.confirmationService.confirm({
  //       message: `确认要删除这${this.refundNoSelect.length}项吗`,
  //       header: '删除提醒',
  //       icon: 'pi pi-exclamation-triangle',
  //       accept: () => {
  //         this.refundNoSelect.forEach( v => {
  //           this.deleteIds.push(v.id);
  //         });
  //         this.refundNoSrv.deleteRefunrefundNo({ids: this.deleteIds.join(',')}).subscribe(
  //           value => {
  //             if (value.status === '1000' ) {
  //               this.setToast('success', '操作成功', value.message);
  //               this.clearData();
  //               this.refundNoInitialization();
  //             }
  //           }
  //         );
  //         // this.msgs = [{severity:'refundNo', summary:'Confirmed', detail:'You have accepted'}];
  //       },
  //       reject: () => {
  //         console.log('这里是删除信息');
  //
  //         // this.msgs = [{severity:'refundNo', summary:'Rejected', detail:'You have rejected'}];
  //       }
  //     });
  //   }
  // }

  public setToast(type, title, message): void {
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
    this.refundNoAdd = null;
    this.refundNoModify = null;
    this.licensePlateColorModify = null;
    this.licensePlateTypeModify = null;
    this.licensePlateTypeModify = null;
    this.licensePlateColorOption = [];
    this.licensePlateTypeOption = [];
    this.refundNoOriginalTypeOption = [];
    this.refundNoSelect = [];
    this.ApplicationRefund = new ApplicationRefund();
  }

  // 分页请求
  public nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.refundNoSrv.queryRefundNoInfoPage({pageNo: this.nowPage, pageSize: 10}).subscribe(
      value => {
        this.loadHidden = true;
        this.refundNoTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
  }
}
