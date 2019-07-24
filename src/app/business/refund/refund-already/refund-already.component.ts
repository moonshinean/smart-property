import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {RefundAlreadyService} from '../../../common/services/refund-already.service';
import {GlobalService} from '../../../common/services/global.service';

@Component({
  selector: 'rbi-refund-already',
  templateUrl: './refund-already.component.html',
  styleUrls: ['./refund-already.component.less']
})
export class RefundAlreadyComponent implements OnInit {


  @ViewChild('input') input: Input;
  public alreadyTableTitle: any;
  public alreadyTableContent: any[];
  public alreadyTableTitleStyle: any;
  public alreadySelect: any[];
  // 添加相关
  public alreadyAddDialog: boolean;
  public alreadyAdd: any;
  public  licensePlateColorOption: any[] = [];
  public  licensePlateTypeOption: any[] = [];
  public  alreadyOriginalTypeOption: any[] = [];
  // 修改相关
  public alreadyModifayDialog: boolean;
  public alreadyModify: any;
  public licensePlateColorModify: any;
  public licensePlateTypeModify: any;
  public alreadyOriginalTypeModify: any;
  // 详情相关
  public alreadyDetailDialog: boolean;
  public alreadyDetail: any;

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
    private alreadySrv: RefundAlreadyService,
    private globalSrv: GlobalService,
  ) {
  }

  ngOnInit() {
    this.alreadyInitialization();
  }

  // initialization already
  public alreadyInitialization(): void {
    console.log('这里是信息的初始化');
    this.alreadyTableTitle = [
      {field: 'orderId', header: '订单Id'},
      {field: 'payerName', header: '缴费人姓名'},
      {field: 'paymentMethod', header: '支付方式'},
      {field: 'paymentType', header: '支付类型'},
      {field: 'roomCode', header: '房间编号'},
      {field: 'chargeName', header: '项目名称'},
      {field: 'actualMoneyCollection', header: '实收金额'},
      {field: 'operating', header: '操作'},
    ];
    this.loadHidden = false;
    this.alreadySrv.queryRefundAlreadyStatus({settingType: 'AUDIT_STATUS'}).subscribe(
      value => {
        console.log(value);
        if (value.data.length  > 0) {
          this.alreadySrv.queryRefundAlreadyPageInfo({pageNo: this.nowPage, pageSize: 10}).subscribe(
            val => {
              this.loadHidden = true;
              if (val.status === '1000') {
                val.data.contents.forEach( h => {
                  value.data.forEach( v => {
                    // console.log();
                    if (h.auditStatus.toString() === v.settingCode) {
                      h.auditStatus = v.settingName;
                    }
                  });
                });
                this.alreadyTableContent = val.data.contents;
                this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};
              } else {
                this.setToast('error', '请求失败', val.message);
              }
            }
          );
        } else {
          this.alreadySrv.queryRefundAlreadyPageInfo({pageNo: this.nowPage, pageSize: 10}).subscribe(
            val => {
              if (val.status === '1000') {
                this.loadHidden = true;
                this.alreadyTableContent = val.data.contents;
                this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};
              }  else {
                this.setToast('error', '请求失败', val.message);
              }
            }
          );
        }
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
    this.alreadyTableTitleStyle = {background: '#282A31', color: '#DEDEDE', height: '6vh'};
    console.log(this.alreadySelect);

  }

  // village change
  public VillageChange(e): void {
    // console.log(this.test);
    this.loadHidden = false;
    this.SearchOption.region = [];
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.alreadyAdd.villageName = e.originalEvent.target.innerText;
    // this.alreadyAdd.villageCode = e.value;
    this.alreadyModify.villageName = e.originalEvent.target.innerText;
    // this.alreadyModify.villageCode = e.value;
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
    this.alreadyAdd.regionName = e.originalEvent.target.innerText;
    // this.alreadyAdd.regionCode = e.value;
    this.alreadyModify.regionName = e.originalEvent.target.innerText;
    // this.alreadyModify.regionCode = e.value;
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
    this.alreadyAdd.buildingName = e.originalEvent.target.innerText;
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
    this.alreadyAdd.unitName = e.originalEvent.target.innerText;
    // this.alreadySrv.queryRoomCode({unitCode: e.value}).subscribe(
    //   value => {
    //     console.log(value);
    //     value.data.forEach( v => {
    //       this.roonCodeSelectOption.push({label: v.roomCode, value: v.roomCode});
    //     });
    //   }
    // );
  }
  // condition search click
  public alreadySearchClick(): void {
    // @ts-ignore
    console.log(this.input.nativeElement.value);
    console.log('这里是条件搜索');
  }
  // add already
  public alreadyAddClick(): void {
    // this.alreadySrv.queryalreadyAllType({settingType: 'LICENSE_PLATE_COLOR'}).subscribe(
    //   value => {
    //     console.log(value);
    //     value.data.forEach( v => {
    //       // console.log();
    //       this.licensePlateColorOption.push({label: v.settingName, value: v.settingCode});
    //     });
    //   }
    // );
    // this.alreadySrv.queryalreadyAllType({settingType: 'LICENSE_PLATE_TYPE'}).subscribe(
    //   value => {
    //     console.log(value);
    //     value.data.forEach( v => {
    //       // console.log();
    //       this.licensePlateTypeOption.push({label: v.settingName, value: v.settingCode});
    //     });
    //   }
    // );
    // this.alreadySrv.queryalreadyAllType({settingType: 'already_ORIGINA_TYPE'}).subscribe(
    //   value => {
    //     console.log(value);
    //     value.data.forEach( v => {
    //       // console.log();
    //       this.alreadyOriginalTypeOption.push({label: v.settingName, value: v.settingCode});
    //     });
    //   }
    // );
    // this.alreadySrv.queryParkSpaceNatureStatus({settingType: 'CWXZ'}).subscribe(
    //   value => {
    //     this.parkSpaceNatureOption = [];
    //     value.data.forEach(v => {
    //       this.parkSpaceNatureOption.push({label: v.settingName, value: v.settingCode});
    //     });
    //   }
    // );
    // this.alreadySrv.queryParkSpaceNatureStatus({settingType: 'CWLX'}).subscribe(
    //   value => {
    //     this.parkSpaceTypeOption = [];
    //     value.data.forEach(v => {
    //       this.parkSpaceTypeOption.push({label: v.settingName, value: v.settingCode});
    //     });
    //   }
    // );
    this.alreadyAddDialog = true;
  }
  // sure add already
  // public alreadyAddSureClick(): void {
  //   this.confirmationService.confirm({
  //     message: `确认要增加吗？`,
  //     header: '增加提醒',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       console.log(this.alreadyAdd);
  //       this.alreadySrv.addRefunalready(this.alreadyAdd).subscribe(
  //         value => {
  //           if (value.status === '1000') {
  //             this.setToast('success', '操作成功', value.message);
  //             this.clearData();
  //             this.alreadyAddDialog = false;
  //             this.alreadyInitialization();
  //           }
  //         }
  //       );
  //
  //       // this.msgs = [{severity:'already', summary:'Confirmed', detail:'You have accepted'}];
  //     },
  //     reject: () => {
  //       console.log('这里是增加信息');
  //
  //       // this.msgs = [{severity:'already', summary:'Rejected', detail:'You have rejected'}];
  //     }
  //   });
  // }
  //  already detail
  public alreadyDetailClick(e): void {
    this.alreadyDetail = e;
    // this.alreadySrv.queryalreadyAllType({settingType: 'LICENSE_PLATE_COLOR'}).subscribe(
    //   value => {
    //     value.data.forEach( v => {
    //       if (this.alreadyDetail.licensePlateColor === v.settingCode) {
    //         this.licensePlateColorModify = v.settingName;
    //       }
    //     });
    //   }
    // );
    // this.alreadySrv.queryalreadyAllType({settingType: 'LICENSE_PLATE_TYPE'}).subscribe(
    //   value => {
    //     value.data.forEach( v => {
    //       if (this.alreadyDetail.licensePlateType === v.settingCode) {
    //         this.licensePlateTypeModify = v.settingName;
    //       }
    //     });
    //   }
    // );
    // this.alreadySrv.queryalreadyAllType({settingType: 'already_ORIGINA_TYPE'}).subscribe(
    //   value => {
    //     value.data.forEach( v => {
    //       if (this.alreadyDetail.alreadyOriginalType === v.settingCode) {
    //         this.alreadyOriginalTypeModify = v.settingName;
    //       }
    //     });
    //   }
    // );
    this.alreadyDetailDialog = true;

  }
  // already select
  public  alreadyonRowSelect(e): void {
    this.alreadyModify = e.data;
  }
  // modify already
  public alreadyModifyClick(): void {
    if (this.alreadySelect === undefined || this.alreadySelect.length === 0) {
      this.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.alreadySelect.length === 1) {
      // this.alreadySrv.queryalreadyAllType({settingType: 'LICENSE_PLATE_COLOR'}).subscribe(
      //   value => {
      //     value.data.forEach( v => {
      //       // console.log();
      //       this.licensePlateColorOption.push({label: v.settingName, value: v.settingCode});
      //       if (this.alreadyModify.licensePlateColor === v.settingCode) {
      //         this.licensePlateColorModify = v.settingName;
      //       }
      //     });
      //   }
      // );
      // this.alreadySrv.queryalreadyAllType({settingType: 'LICENSE_PLATE_TYPE'}).subscribe(
      //   value => {
      //     value.data.forEach( v => {
      //       // console.log();
      //       this.licensePlateTypeOption.push({label: v.settingName, value: v.settingCode});
      //       if (this.alreadyModify.licensePlateType === v.settingCode) {
      //         this.licensePlateTypeModify = v.settingName;
      //       }
      //     });
      //   }
      // );
      // this.alreadySrv.queryalreadyAllType({settingType: 'already_ORIGINA_TYPE'}).subscribe(
      //   value => {
      //     value.data.forEach( v => {
      //       // console.log();
      //       this.alreadyOriginalTypeOption.push({label: v.settingName, value: v.settingCode});
      //       if (this.alreadyModify.alreadyOriginalType === v.settingCode) {
      //         this.alreadyOriginalTypeModify = v.settingName;
      //       }
      //     });
      //   }
      // );
      this.alreadyModifayDialog = true;
    } else {
      this.setToast('error', '操作错误', '只能选择一项进行修改');
    }
  }

  // sure modify already
  // public alreadyModifySureClick(): void {
  //   this.confirmationService.confirm({
  //     message: `确认要修改吗？`,
  //     header: '修改提醒',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       this.alreadySrv.updateRefunalready(this.alreadyModify).subscribe(
  //         value => {
  //           if (value.status === '1000') {
  //             this.setToast('success', '操作成功', value.message);
  //             this.alreadyModifayDialog = false;
  //             this.clearData();
  //             this.alreadyInitialization();
  //           }
  //         }
  //       );
  //     },
  //     reject: () => {
  //
  //     }
  //   });
  // }

  // delete already
  // public alreadyDeleteClick(): void {
  //   if (this.alreadySelect === undefined || this.alreadySelect.length === 0) {
  //     this.setToast('error', '操作错误', '请选择需要删除的项');
  //   } else {
  //     this.confirmationService.confirm({
  //       message: `确认要删除这${this.alreadySelect.length}项吗`,
  //       header: '删除提醒',
  //       icon: 'pi pi-exclamation-triangle',
  //       accept: () => {
  //         this.alreadySelect.forEach( v => {
  //           this.deleteIds.push(v.id);
  //         });
  //         this.alreadySrv.deleteRefunalready({ids: this.deleteIds.join(',')}).subscribe(
  //           value => {
  //             if (value.status === '1000' ) {
  //               this.setToast('success', '操作成功', value.message);
  //               this.clearData();
  //               this.alreadyInitialization();
  //             }
  //           }
  //         );
  //         // this.msgs = [{severity:'already', summary:'Confirmed', detail:'You have accepted'}];
  //       },
  //       reject: () => {
  //         console.log('这里是删除信息');
  //
  //         // this.msgs = [{severity:'already', summary:'Rejected', detail:'You have rejected'}];
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
    this.alreadyAdd = null;
    this.alreadyModify = null;
    this.licensePlateColorModify = null;
    this.licensePlateTypeModify = null;
    this.licensePlateTypeModify = null;
    this.licensePlateColorOption = [];
    this.licensePlateTypeOption = [];
    this.alreadyOriginalTypeOption = [];
    this.alreadySelect = [];
  }

  // 分页请求
  public nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.alreadySrv.queryRefundAlreadyPageInfo({pageNo: this.nowPage, pageSize: 10}).subscribe(
      value => {
        this.loadHidden = true;
        this.alreadyTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
  }
}
