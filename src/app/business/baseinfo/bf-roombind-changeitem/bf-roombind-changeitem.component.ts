import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {GlobalService} from '../../../common/services/global.service';
import {DatePipe} from '@angular/common';
import {AddRoomBindChargeItem, ModifyRoomBindChargeItem} from '../../../common/model/bf-roomBindChargeItem.model';
import {BfRoomBindChargeitemService} from '../../../common/services/bf-room-bind-chargeitem.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';

@Component({
  selector: 'rbi-bf-roombind-changeitem',
  templateUrl: './bf-roombind-changeitem.component.html',
  styleUrls: ['./bf-roombind-changeitem.component.less']
})
export class BfRoombindChangeitemComponent implements OnInit {


  @ViewChild('input') input: Input;
  // @ViewChild('file') file: Input;
  public roombindTableTitle: any;
  public roombindTableContent: any[];
  public roombindTableTitleStyle: any;
  public roombindSelect: any;
  public nowPage = 1;
  // 查询相关
  public SearchOption = {village: [], region: [], building: [], unit: [], room: []};
  // 添加相关
  public roombindAddDialog: boolean;
  public roombindAdd: AddRoomBindChargeItem = new AddRoomBindChargeItem();
  public chargeItemOption: any[] = [];
  // 修改相关
  public roombindModifayDialog: boolean;
  public roombindModify: ModifyRoomBindChargeItem = new ModifyRoomBindChargeItem();
  public roombindDetailDialog: boolean;
  public roombindDetail: ModifyRoomBindChargeItem = new ModifyRoomBindChargeItem();
  public chargeItemName: any;
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  public esDate: any;
  public loadHidden = true;
  public deleteId: any[] = [];
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private roomBindChargeSrv: BfRoomBindChargeitemService,
    private toolSrv: PublicMethedService,
    private globalSrv: GlobalService,
  ) { }
  ngOnInit() {
    this.roombindInitialization();
  }

  // initialization houseinfo
  public  roombindInitialization(): void {
    this.roombindTableTitle = [
      {field: 'villageName', header: '小区名称'},
      {field: 'regionName', header: '地块名称'},
      {field: 'buildingName', header: '楼栋名称'},
      {field: 'unitName', header: '单元名称'},
      {field: 'roomCode', header: '房间编号'},
      {field: 'chargeCode', header: '缴费项目'},
      {field: 'operating', header: '操作'}
    ];
    this.loadHidden = false;
    this.roomBindChargeSrv.queryRoomChangeInfoById({}).subscribe(
      value => {
        console.log(value);
        value.data.forEach( v => {
          this.chargeItemOption.push({label: v.chargeName, value: v.chargeCode});
        });
        this.roomBindChargeSrv.queryRoomChangeInfoPage({pageNo: this.nowPage, pageSize: 10}).subscribe(
          (val) => {
            this.loadHidden = true;
            if (val.status === '1000') {
              val.data.contents.forEach( v => {
                this.chargeItemOption.forEach( data =>{
                  if (v.chargeCode === data.value) {
                    v.chargeCode = data.label;
                  }
                });
              });
              this.roombindTableContent = val.data.contents;
              this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};
            } else {
              this.toolSrv.setToast('error', '请求错误', val.message);
            }
          }
        );
      }
    );

    this.globalSrv.queryVillageInfo({}).subscribe(
      (data) => {
        data.data.forEach( v => {
          this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
          // = v.villageName;
        });
      }
    );
    this.esDate = this.toolSrv.esDate;


    this.roombindTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
  }
  // select village
  public  VillageChange(e): void {
    this.loadHidden = false;
    this.roombindAdd.roomCode = null;
    this.SearchOption.region = [];
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.roombindAdd.villageName = e.originalEvent.target.innerText;
    this.roombindModify.villageName = e.originalEvent.target.innerText;

    this.globalSrv.queryRegionInfo({villageCode: e.value}).subscribe(
      (value) => {
        this.loadHidden = true;
        if (value.status === '1000') {
          if (value.data.length !== 0) {
            value.data.forEach( v => {
              this. SearchOption.region.push({label: v.regionName, value: v.regionCode});
            });
          } else {
            this.toolSrv.setToast('warn', '请求成功', '数据为空');
          }
        }  else {
          this.toolSrv.setToast('error', '请求失败', value.message);
        }
      }
    );
  }
  // select region
  public  regionChange(e): void {
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.roombindAdd.roomCode = null;
    this.roombindAdd.regionName = e.originalEvent.target.innerText;
    this.roombindModify.regionName = e.originalEvent.target.innerText;
    this.globalSrv.queryBuilingInfo({regionCode: e.value}).subscribe(
      (value) => {
        if (value.status === '1000') {
          if (value.data.length !== 0) {
            value.data.forEach( v => {
              this. SearchOption.building.push({label: v.buildingName, value: v.buildingCode});
            });
          } else {
            this.toolSrv.setToast('warn', '请求成功', '数据为空');
          }
        }  else {
          this.toolSrv.setToast('error', '请求失败', value.message);
        }

      }
    );
  }
  // select building
  public  buildingChange(e): void {
    this.roombindAdd.roomCode = null;
    this.roombindAdd.buildingName = e.originalEvent.target.innerText;
    this.roombindModify.buildingName = e.originalEvent.target.innerText;
    this.globalSrv.queryunitInfo({buildingCode: e.value}).subscribe(
      (value) => {
        if (value.status === '1000') {
          if (value.data.length !== 0) {
            value.data.forEach( v => {
              this. SearchOption.unit.push({label: v.unitName, value: v.unitCode});
            });
          } else {
            this.toolSrv.setToast('error', '请求成功', '数据为空');
          }
        } else {
          this.toolSrv.setToast('error', '请求失败', value.message);
        }
      }
    );
  }
  // select unit
  public  unitChange(e): void {
    this.roombindAdd.unitName = e.originalEvent.target.innerText;
    this.roombindModify.unitName = e.originalEvent.target.innerText;
    this.globalSrv.queryRoomCode({unitCode: e.value}).subscribe(
      value => {
        value.data.forEach( v => {
          this.SearchOption.room.push({label: v.roomCode, value: v.roomCode});
        });
      }
    );
  }
  // condition search click
  public  roombindSearchClick(): void {
  }
  // add roombind
  public  roombindAddClick(): void {
    this.SearchOption.village = [];
    this.globalSrv.queryVillageInfo({}).subscribe(
      (data) => {
        data.data.forEach( v => {
          this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
          // = v.villageName;
        });
      }
    );
    // this.roomBindChargeSrv.queryRoomChangeInfoById({}).subscribe(
    //   value => {
    //     value.data.forEach( v => {
    //       this.chargeItemOption.push({label: v.chargeName, value: v.chargeCode});
    //     });
    //   }
    // );
    this.roombindAddDialog = true;
  }
  // sure add houseinfo
  public  roombindAddSureClick(): void {
    this.toolSrv.setConfirmation('增加', '增加', () => {
      this.loadHidden = false;
      this.roomBindChargeSrv.addRoomChangeInfo(this.roombindAdd).subscribe(
        value => {
          this.loadHidden = true;
          if (value.status === '1000') {
            this.toolSrv.setToast('success', '操作成功', '添加成功');
            this.clearData();
            this.roombindAddDialog = false;
            this.roombindInitialization();
          } else {
            this.toolSrv.setToast('error', '操作失败', value.message);
          }
        });
    });
  }
  // detail roombindInfo
  public  roombindDetailClick(e): void {
    this.roombindDetail = e;
    this.chargeItemName = this.roombindDetail.chargeCode;
    this.roombindDetailDialog = true;
  }
  // modify roombind
  public roombindModifyClick(): void {
    if (this.roombindSelect === undefined || this.roombindSelect.length === 0 ) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.roombindSelect.length === 1) {
      this.SearchOption.village = [];
      this.chargeItemName = this.roombindModify.chargeCode;
      this.globalSrv.queryVillageInfo({}).subscribe(
        (data) => {
          data.data.forEach( v => {
            this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
          });
        }
      );
      // this.roomBindChargeSrv.queryRoomChangeInfoById({}).subscribe(
      //   value => {
      //     value.data.forEach( v => {
      //       this.chargeItemOption.push({label: v.chargeName, value: v.chargeCode});
      //       if (this.roombindModify.chargeCode === v.chargeCode) {
      //         this.chargeItemName = v.chargeName;
      //       }
      //     });
      //   }
      // );
      this.globalSrv.queryRegionInfo({villageCode: this.roombindModify.villageCode}).subscribe(
        (value) => {
          value.data.forEach( v => {
            this.loadHidden = true;
            this. SearchOption.region.push({label: v.regionName, value: v.regionCode});
          });
        }
      );
      this.globalSrv.queryBuilingInfo({regionCode: this.roombindModify.regionCode}).subscribe(
        (value) => {
          value.data.forEach( v => {
            this. SearchOption.building.push({label: v.buildingName, value: v.buildingCode});
          });
          this.loadHidden = true;

        }
      );
      this.globalSrv.queryunitInfo({buildingCode: this.roombindModify.buildingCode}).subscribe(
        (value) => {
          value.data.forEach( v => {
            this. SearchOption.unit.push({label: v.unitName, value: v.unitCode});
          });
        }
      );
      this.globalSrv.queryRoomCode({unitCode: this.roombindModify.unitCode}).subscribe(
        value => {
          value.data.forEach( v => {
            this.SearchOption.room.push({label: v.roomCode, value: v.roomCode});
          });
        }
      );
      this.roombindModifayDialog = true;
    } else {
      this.toolSrv.setToast('success', '操作成功', '只能选择一项进行修改');
    }
  }
  // sure modify roombind
  public  roombindModifySureClick(): void {
    this.toolSrv.setConfirmation('修改', '修改', () => {
      this.loadHidden = false;
      this.roomBindChargeSrv.updateRoomChangeInfo(this.roombindModify).subscribe(
        value => {
          this.loadHidden = true;
          if (value.status === '1000') {
            this.roombindModifayDialog = false;
            this.toolSrv.setToast('success', '操作成功', value.message);
            this.roombindInitialization();
            this.clearData();
          } else {
            this.toolSrv.setToast('error', '操作失败', value.message);
          }
        }
      );
    });
  }
  // delete roombind
  public  roombindDeleteClick(): void {
    if (this.roombindSelect === undefined || this.roombindSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.toolSrv.setConfirmation('删除', `删除这${this.roombindSelect.length}项`, () => {
        this.loadHidden = false;
        this.roombindSelect.forEach( v => {
          this.deleteId.push(v.id);
        });
        this.roomBindChargeSrv.deleteRoomChangeInfo({ids: this.deleteId.join(',')}).subscribe(
          value => {
            this.loadHidden = true;
            if (value.status === '1000') {
              this.toolSrv.setToast('success', '操作成功', value.message);
              this.roombindInitialization();
              this.clearData();
            } else {
              this.toolSrv.setToast('error', '操作失败', value.message);
            }
          }
        );
      });
    }
  }
  // select houseinfo
  public  roombindonRowSelect(e): void {
    this.roombindModify = e.data;
  }
  // Reset data
  public  clearData(): void {
    this.roombindAdd = new AddRoomBindChargeItem();
    this.roombindModify = new ModifyRoomBindChargeItem();
    this.roombindDetail = new ModifyRoomBindChargeItem();
    this.SearchOption.building = [];
    this.SearchOption.region = [];
    this.SearchOption.room = [];
    this.SearchOption.unit = [];
    this.chargeItemOption = [];
    this.roombindSelect = [];
  }
  // paging query
  public  nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.roomBindChargeSrv.queryRoomChangeInfoById({}).subscribe(
      value => {
        value.data.forEach( v => {
          this.chargeItemOption.push({label: v.chargeName, value: v.chargeCode});
        });
        this.roomBindChargeSrv.queryRoomChangeInfoPage({pageNo: this.nowPage, pageSize: 10}).subscribe(
          (val) => {
            this.loadHidden = true;
            if (val.status === '1000') {
              val.data.contents.forEach( v => {
                this.chargeItemOption.forEach( data =>{
                  if (v.chargeCode === data.value) {
                    v.chargeCode = data.label;
                  }
                });
              });
              this.roombindTableContent = val.data.contents;
              this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};
            } else {
              this.toolSrv.setToast('error', '请求错误', val.message);
            }
          }
        );
      }
    );
    }
}
