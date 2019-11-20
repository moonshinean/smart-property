import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BfTollService} from '../../../common/services/bf-toll.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AddToll, BfTollTitle, ModifyToll, ModifyTollDrop, Toll, TollMoreInfo} from '../../../common/model/bf-toll.model';
import {validate} from 'codelyzer/walkerFactory/walkerFn';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {defer, Observable, Subscribable, Subscription} from 'rxjs';
import {SharedServiceService} from '../../../common/public/shared-service.service';
import {ThemeService} from '../../../common/public/theme.service';

@Component({
  selector: 'rbi-bf-toll',
  templateUrl: './bf-toll.component.html',
  styleUrls: ['./bf-toll.component.less']
})
export class BfTollComponent implements OnInit, OnDestroy {
  public tableOption: any;
  public tollTableContent: Toll[];
  public tollTableTitleStyle: any;
  public tollSelect: Toll[] = [];
  // 添加相关
  public tollAddDialog: boolean;
  public tollAdd: AddToll[] = [];
  public tollAddinfo: AddToll = new AddToll();
  public tollMoreInfo: TollMoreInfo[] = [];
  public tollTitle: BfTollTitle = new BfTollTitle();

  // 状态相关
  public parkingSpaceTypeOption: any[] = [];
  public parkingSpaceNatureOption: any[] = [];
  public datedifOption: any[] = [];
  public enableOption: any[] = [];
  public refundOption: any[] = [];
  public mustPayOption: any[] = [];
  public chargeTypeOption: any[] = [];
  // 修改相关
  public tollModifyDialog: boolean;
  public tollModify: any[] = [];
  public modifytoll: any[] = [];
  public tollModifyData: ModifyTollDrop = new ModifyTollDrop();
  public tollModifyDatas: ModifyTollDrop[] = [];
  public tollEnableMedify: any;
  public tollrefundMedify: any;
  public tollmustpayMedify: any;
  public tollChargeTypeMedify: any;
  // 删除
  public ids: any[] = [];
  // 详情相关
  public tollDetailDialog: boolean;
  public moreTollMoreTitle = [
    {field: 'id', header: '序号'},
    {field: 'areaMin', header: '面积最小值'},
    {field: 'areaMax', header: '面积最大值'},
    {field: 'datedif', header: '缴费月数'},
    {field: 'money', header: '金额'},
    {field: 'discount', header: '折扣'},
    {field: 'parkingSpaceNature', header: '车位性质'},
    {field: 'parkingSpaceType', header: '车位类型'},
    {field: 'operating', header: '操作'},
  ];
  // 其他相关
  public esDate: any; // 清除时钟
  public option: any; // 清除时钟
  public loadHidden = true;
  public NOW_PAGE = 1;
  public deleteId: any[] = [];
  public tollSub: Subscription;
  public table = {
    tableheader: {background: '', color: ''},
    tableContent: [
      {background: '', color: ''},
      {background: '', color: ''}],
    detailBtn: ''
  };
  constructor(
    private toolSrv: PublicMethedService,
    private tollSrv: BfTollService,
    private shareSrv: SharedServiceService,
    private themeSrv: ThemeService,
  ) {
    this.themeSrv.changeEmitted$.subscribe(
      value => {
        this.table.tableheader = value.table.header;
        this.table.tableContent = value.table.content;
        this.table.detailBtn = value.table.detailBtn;
        this.setTableOption(this.tollTableContent);
      }
    );
  }
  ngOnInit() {
    this.tollSub = this.shareSrv.changeEmitted$.subscribe(value => {
      // console.log(123);
      console.log(value);
    });
    if (this.themeSrv.setTheme !== undefined) {
      this.table.tableheader = this.themeSrv.setTheme.table.header;
      this.table.tableContent = this.themeSrv.setTheme.table.content;
      this.table.detailBtn = this.themeSrv.setTheme.table.detailBtn;
    }
    // console.log(this.shareSrv.SearchData);
    this.tollInitialization();
  }
  ngOnDestroy(): void {
    // 组件销毁时 取消订阅
    this.tollSub.unsubscribe();
  }

  // initialization toll
  public  tollInitialization(): void {
    this.esDate = this.toolSrv.esDate;
    this.toolSrv.getAdmStatus([{settingType: 'CHARGE_TYPE'},
      {settingType: 'ENABLED'}, {settingType: 'DATEDIF'},
      {settingType: 'CWXZ'}, {settingType: 'CWLX'}, {settingType: 'MUST_PAY'},
      {settingType: 'REFUND'}], (data) => {
      // this.queryTollPageData();
      this.enableOption = this.toolSrv.setListMap(data.ENABLED);
      this.refundOption = this.toolSrv.setListMap(data.REFUND);
      this.mustPayOption = this.toolSrv.setListMap(data.MUST_PAY);
      this.chargeTypeOption = this.toolSrv.setListMap(data.CHARGE_TYPE);
      this.parkingSpaceTypeOption = this.toolSrv.setListMap(data.CWLX);
      this.parkingSpaceNatureOption = this.toolSrv.setListMap(data.DATEDIF);
      this.datedifOption = this.toolSrv.setListMap(data.CWXZ);
      this.queryTollPageData();
    });
    this.settollTitleData();
    this.tollTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
  }
  // condition search click
  public  tollSearchClick(): void {
    // @ts-ignore
  }
  // add  toll
  public  tollAddClick(): void {
    this.tollAddDialog = true;
  }
  // sure add toll
  public  tollAddSureClick(): void {
    console.log(this.tollTitle);
    this.toolSrv.setConfirmation('增加', '增加', () => {
      if  (this.tollMoreInfo.length === 0) {
        console.log(this.tollTitle);
        this.tollSrv.queryTollAdd(this.tollTitle).subscribe(
          value => {
            if (value.status === '1000')  {
              this.toolSrv.setToast('success', '操作成功', value.message);
              this.tollInitialization();
              this.tollAddDialog = false;
              this.clearData();
            } else {
              this.toolSrv.setToast('error', '操作错误', '添加失败,' + value.message);
            }
          }
        );
      } else {
        this.tollMoreInfo.forEach( v => {
          for (const Key in this.tollTitle) {
            const name = Key;
            this.tollAddinfo[name] =  this.tollTitle[Key];
          }
          for (const vKey in v) {
            const vName = vKey;
            this.tollAddinfo[vName] = v[vKey];
          }
          this.tollAdd.push(this.tollAddinfo);
          this.tollAddinfo = new AddToll();
        });
        this.tollSrv.addBfTollInfo({data: this.tollAdd}).subscribe(
          value =>  {
            if (value.status === '1000')  {
              this.toolSrv.setToast('success', '操作成功', value.message);
              this.tollInitialization();
              this.tollAddDialog = false;
              this.clearData();
            }
          }
        );
      }
    });
  }
  // modify toll
  public  tollModifyClick(): void {
    if (this.tollSelect === undefined || this.tollSelect.length === 0 ) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.tollSelect.length === 1) {
      this.tollChargeTypeMedify = this.tollTitle.chargeType;
      this.tollEnableMedify = this.tollTitle.enable;
      const setInter = setInterval(() => {
        if (this.mustPayOption.length > 0) {
          clearInterval(setInter);
          if (this.tollTitle.mustPay !== null)  {
            this.mustPayOption.forEach(value => {
              if (this.tollTitle.mustPay.toString() === value.value) {
                this.tollmustpayMedify = value.label;
              }
            });
          }
        }
      }, 500);
      const Time = setInterval( () => {
          clearInterval(Time);
          this.tollSrv.queryTollinfoDetail({chargeCode: this.tollSelect[0].chargeCode}).subscribe(
            value => {
              this.tollMoreInfo = [];
              this.tollModifyDatas = [];
              this.ids = [];
              value.data.forEach( v => {
                this.tollMoreInfo.push({areaMin: v.areaMin, areaMax: v.areaMax, money: v.money, datedif: v.datedif, discount: v.discount, parkingSpaceNature: v.parkingSpaceNature, parkingSpaceType: v.parkingSpaceType});
                this.ids.push({id: v.id});
                this.tollModifyDatas.push(this.tollModifyData);
                this.tollModifyData = new ModifyTollDrop();
              });
            }
          );
      }, 100);
      this.tollModifyDialog = true;
    } else {
      this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
    }
  }
  // sure modify toll
  public  tollModifySureClick(): void {
    this.enableOption.forEach( val => {
      if (this.tollTitle.enable.toString() === val.label) {
        this.tollTitle.enable = val.value;
      }
    });
    this.toolSrv.setConfirmation('修改', '修改', () => {
      if (this.tollMoreInfo.length === 0) {
        this.tollSrv.updateTollInfo(this.tollTitle).subscribe(
          value => {
            if (value.status === '1000') {
              this.toolSrv.setToast('success', '操作成功', value.message);
              this.tollInitialization();
              this.tollModifyDialog = false;
              this.clearData();
            } else {
              this.toolSrv.setToast('error', '操作错误', '修改失败,' + value.message);
            }
          }
        );
      } else {
          this.modifytoll = [];
          this.tollMoreInfo.forEach( (v, index) => {
          for (const Key in this.tollTitle) {
            this.tollAddinfo[Key] =  this.tollTitle[Key];
           }
          for (const vKey in v) {
            this.tollAddinfo[vKey] = v[vKey];
          }
          if (index + 1 <= this.ids.length) {
            this.tollAddinfo.id = this.ids[index].id;
          } else {
            this.tollAddinfo.id = null;
          }
          this.modifytoll.push(this.tollAddinfo);
          this.tollAddinfo = new AddToll();
        });
        this.tollSrv.updateTollListinfo({data: this.modifytoll}).subscribe(
          value => {
            if (value.status === '1000') {
              this.toolSrv.setToast('success', '操作成功', value.message);
              this.tollInitialization();
              this.tollModifyDialog = false;
              this.clearData();
            } else {
              this.toolSrv.setToast('error', '操作错误', '修改失败,' + value.message);
            }
          }
        );
      }
    });
  }
  // delete toll
  public  tollDeleteClick(): void {
    if (this.tollSelect === undefined || this.tollSelect.length === 0) {
      this.toolSrv.setToast('error',  '操作错误', '请选择需要删除的项');
    } else {
      this.toolSrv.setConfirmation('删除', `删除这${this.tollSelect.length}项`, () => {
        this.tollSelect.forEach( v => {
          this.deleteId.push({chargeCode: v.chargeCode});
        });
        this.tollSrv.deleteTollinfo({data: this.deleteId}).subscribe(
          value => {
            if (value.status === '1000') {
              this.toolSrv.setToast('success',  '操作成功', '添加成功' + value.message);
              this.clearData();
              this.tollInitialization();
            } else {
              this.toolSrv.setToast('error', '操作错误', '删除失败,' + value.message);
            }
          }
        );
      });
    }
  }
  // show Detail Dialog
  public  toolDetailClick(e): void {
    this.tollTitle = e;
    this.tollSrv.queryTollinfoDetail({chargeCode: e.chargeCode}).subscribe(
      value => {
        value.data.forEach( v => {
          this.tollModifyDatas.push(this.tollModifyData);
          this.tollModifyData = new ModifyTollDrop();
        });
      }
    );
    this.tollDetailDialog = true;
  }
  // Reset data
  public  clearData(): void {
      this.tollAdd = [];
      this.tollMoreInfo = [];
      this.tollAddinfo = new AddToll();
      this.tollTitle = new BfTollTitle();
      this.tollSelect = [];
      this.tollModifyData = new ModifyTollDrop();
      this.tollModifyDatas = [];
      this.modifytoll = [];
      this.ids = [];
      this.tollmustpayMedify = null;
      this.tollrefundMedify = null;
      this.tollEnableMedify = null;
      this.tollChargeTypeMedify = null;
  }
  // Add a piece of data
  public  addMoreTollClick(): void {
      this.tollMoreInfo.push({areaMin: '', areaMax: '', money: '', datedif: '', discount: '10', parkingSpaceNature: '', parkingSpaceType: ''});
      this.tollModifyData.datedif = '请选择月数';
      this.tollModifyData.parkingSpaceNature = '请选择车位性质';
      this.tollModifyData.parkingSpaceType = '请选择车位类型';
      this.tollModifyDatas.push(this.tollModifyData);
  }
  // delete moreTollMore
  public deleteTollMoreClick(index, e): void {
    if (index + 1 > this.ids.length) {
      this.ids.splice(index, 1);
      this.tollMoreInfo.splice(index, 1);
    } else {
      this.tollSrv.deleteTollList({id: this.ids[index].id}).subscribe(
        value => {
          if (value.status === '1000') {
            // console.log();
            this.ids.splice(index, 1);
            this.tollMoreInfo.splice(index, 1);
          } else {
            this.toolSrv.setToast('error', '删除失败', value.message);
          }
        }
      );
    }
  }
  // set tollTitledata
  public  settollTitleData(): void {
    this.tollTitle.chargeCode = '';
    this.tollTitle.enable = '';
    this.tollTitle.chargeType = '';
    this.tollTitle.refund = '';
    this.tollTitle.chargeUnit = '';
    this.tollTitle.chargeStandard = '';
    this.tollTitle.chargeName = '';
    this.tollTitle.id = '';
  }
  // paging query
  public nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.NOW_PAGE = event;
    this.queryTollPageData();
  }
  public queryTollPageData(): void {
    this.tollSrv.queryBfTollPageInfo({pageNo: this.NOW_PAGE, pageSize: 10}).subscribe(
      value => {
        console.log(value);
        if (value.status === '1000') {
          this.loadHidden = true;
          value.data.contents.forEach(v => {
              v.chargeType = this.toolSrv.setValueToLabel(this.chargeTypeOption, v.chargeType);
              v.enable = this.toolSrv.setValueToLabel(this.enableOption, v.enable);
              v.refund = this.toolSrv.setValueToLabel(this.refundOption, v.refund);
              v.mustPay = this.toolSrv.setValueToLabel(this.mustPayOption, v.mustPay);
          });
          this.tollTableContent = value.data.contents;
          this.setTableOption(value.data.contents);
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        }
      }
    );
  }

  // select data (选择数据)
  public  selectData(e): void {
    this.tollSelect = e;
  }
  // set table data （设置列表数据）
  public  setTableOption(data1): void {
    this.tableOption = {
      width: '101.4%',
      header: {
        data: [
          {field: 'chargeCode', header: '项目编号'},
          {field: 'chargeName', header: '项目名称'},
          {field: 'chargeType', header: '项目类型'},
          {field: 'chargeStandard', header: '收费单价'},
          {field: 'chargeUnit', header: '收费单位'},
          {field: 'enable', header: '是否启用'},
          {field: 'operating', header: '操作'},
        ],
        style: {background: this.table.tableheader.background, color: this.table.tableheader.color, height: '6vh'}
      },
      Content: {
        data: data1,
        styleone: {background: this.table.tableContent[0].background, color: this.table.tableContent[0].color, textAlign: 'center', height: '2vw'},
        styletwo: {background: this.table.tableContent[1].background, color: this.table.tableContent[1].color, textAlign: 'center', height: '2vw'},
      },
      type: 2,
      tableList:  [{label: '详情', color: this.table.detailBtn}]
    };
  }
}
