import {Component, OnDestroy, OnInit} from '@angular/core';
import {BfOwnerService} from '../../../common/services/bf-owner.service';
import {LatePaymentService} from '../../../common/services/late-payment.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {SearchOwner} from '../../../common/model/bf-owner.model';
import {DialogModel, FormValue} from '../../../common/components/basic-dialog/dialog.model';
import {FormGroup} from '@angular/forms';
import {CalaPaymentData} from '../../../common/model/latepayment.model';
import {DatePipe} from '@angular/common';
import {ThemeService} from '../../../common/public/theme.service';
import {Subscription} from 'rxjs';
import {GlobalService} from '../../../common/services/global.service';
import {LocalStorageService} from '../../../common/services/local-storage.service';

@Component({
  selector: 'rbi-latepayment-owner',
  templateUrl: './latepayment-owner.component.html',
  styleUrls: ['./latepayment-owner.component.less']
})
export class LatepaymentOwnerComponent implements OnInit, OnDestroy {
  public tableContents: any;
  public optionTable: any;
  public ownerSelect: any[] = [];
  // 详情相关
  public dialogOption: any;
  // 其他相关
  public pageOption: any;
  public loadHidden = true;
  // 计算违约金相关
  public CalcPaymentData: CalaPaymentData = new CalaPaymentData();

  public form: FormValue[] = [];
  public formgroup: FormGroup;
  public formdata: any[];
  public optionDialog: DialogModel = new DialogModel();
  // 查询相关
  public searchOwerData: SearchOwner = new SearchOwner();
  // 按钮权限相关
  public btnHiden = [
    {label: '计算违约金', hidden: true},
    {label: '搜索', hidden: true},
  ];
  public themeSub: Subscription;
  public table = {
    tableheader: {background: '', color: ''},
    tableContent: [
      {background: '', color: ''},
      {background: '', color: ''}],
    detailBtn: ''
  };
  public serchData: any;

  constructor(
    private ownerSrv: BfOwnerService,
    private lateSrv: LatePaymentService,
    private toolSrv: PublicMethedService,
    private globalSrv: GlobalService,
    private localSrv: LocalStorageService,
    private datePipe: DatePipe,
    private themeSrv: ThemeService,
  ) {
    this.themeSub =  this.themeSrv.changeEmitted$.subscribe(
      value => {
        this.table.tableheader = value.table.header;
        this.table.tableContent = value.table.content;
        this.table.detailBtn = value.table.detailBtn;
        this.setTableOption(this.tableContents);
      }
    );
  }

  ngOnInit() {
    this.setBtnIsHidden();
    if (this.themeSrv.setTheme !== undefined) {
      this.table.tableheader = this.themeSrv.setTheme.table.header;
      this.table.tableContent = this.themeSrv.setTheme.table.content;
      this.table.detailBtn = this.themeSrv.setTheme.table.detailBtn;
    }
    this.searchOwerData.pageNo = 1;
    this.searchOwerData.pageSize = 10;
    this.queryData(this.searchOwerData);
  }
  ngOnDestroy(): void {
    this.themeSub.unsubscribe();
  }

  // 计算违约金
  public  CalculationClick(): void {
    this.CalcPaymentData.roomCodeAndMobilePhoneDTOS = [];
    if (this.ownerSelect.length > 0) {
      this.ownerSelect.forEach( v => {
        this.CalcPaymentData.roomCodeAndMobilePhoneDTOS.push({roomCode: v.roomCode, mobilePhone: v.mobilePhone});
      });
      this.optionDialog = {
        type: 'add',
        title: '选择时间',
        width: '800',
        dialog: true
      };
      const list = ['startTime', 'endTime', 'liquidatedDamageDueTime'];
      list.forEach(val => {
          this.form.push({key: val, disabled: false, required: true, value: ''});
      });
      this.formgroup = this.toolSrv.setFormGroup(this.form);
      this.formdata = [
        {label: '开始时间', type: 'date', name: 'startTime', option: '', placeholder: '请选择开始时间'},
        {label: '结束时间', type: 'date', name: 'endTime', option: '', placeholder: '请选择结束时间'},
        {label: '违约金到期', type: 'date', name: 'liquidatedDamageDueTime', option: '', placeholder: '请选择违约金到期时间'},
      ];
    } else {
      this.toolSrv.setToast('error', '操作错误', '请选择需要计算的项');
    }
  }

  public  ownerSearchClick(): void {
      
  }
  // set table data
  public  setTableOption(data1): void {
    this.optionTable = {
      width: '101.4%',
      header: {
        data:  [
          {field: 'villageName', header: '小区名称'},
          {field: 'regionName', header: '地块名称'},
          {field: 'buildingName', header: '楼栋名称'},
          {field: 'unitName', header: '单元名称'},
          {field: 'roomCode', header: '房间编号'},
          {field: 'roomSize', header: '房间大小'},
          {field: 'operating', header: '操作'}
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
  // query fata
  // query data
  public  queryData(data): void {
    // this.SearchData.pageSize = 10;
    this.loadHidden = false;
    this.ownerSrv.queryOwerDataList(data).subscribe(
      value => {
        this.loadHidden = true;
        if (value.status === '1000') {
          this.tableContents = value.data.contents;
          this.setTableOption(value.data.contents);
          this.pageOption = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        } else {
          this.toolSrv.setToast('error', '请求失败', value.message);
        }
      }
    );
  }

  // set detail dialog data
  public  detailClick(e): void {
    const poptitle = [
      {field: 'villageName', header: '小区名称'},
      {field: 'regionName', header: '地块名称'},
      {field: 'buildingName', header: '楼栋名称'},
      {field: 'unitName', header: '单元名称'},
      {field: 'roomCode', header: '房间编号'},
      {field: 'roomSize', header: '房间大小'},
      {field: 'roomType', header: '房屋类型'},
      {field: 'roomStatus', header: '房屋状态'},
      {field: 'renovationStatus', header: '装修情况'},
      {field: 'renovationStartTime', header: '装修开始日期'},
      {field: 'ownerTimeDetailHide', header: '装修结束日期'},
    ];
    this.ownerSrv.queryOwerInfoDetail({roomCode: e.roomCode}).subscribe(
      value => {
        console.log(value);
        if (value.data.length !== 0) {
          this.dialogOption = {
            dialog: true,
            tableHidden: true,
            width: '1000',
            type: 2,
            title: '详情',
            poplist: {
              popContent: e,
              popTitle: poptitle,
            },
            tablelist: {
              width: '100%',
              title: '违约金信息',
              tableHeader: {
                data: [
                  {field: 'surname', header: '客户姓氏'},
                  {field: 'sex', header: '性别'},
                  {field: 'mobilePhone', header: '客户电话'},
                  {field: 'identity', header: '身份'},
                  {field: 'normalPaymentStatus', header: '是否正常缴费'},
                  {field: 'startBillingTime', header: '物业费开始既费时间'},
                  {field: 'remarks', header: '备注'},
                ],
                style: {background: '#ffffff', color: '#000000', height: '6vh'},
              },
              tableContent: {
                data: value.data,
                styleone: {background: '#ffffff', color: '#000', textAlign: 'center', height: '2vw'},
                styletwo: {background: '#ffffff', color: '#000', textAlign: 'center', height: '2vw'}
              },
            }
          };
        } else {
          this.dialogOption = {
            dialog: true,
            tableHidden: false,
            width: '1000',
            type: 2,
            title: '详情',
            poplist: {
              popContent: e,
              popTitle:  poptitle,
            }
          };
        }
      }
    );
  }

  // select data
  public  selectData(e): void {
      this.ownerSelect = e;
  }

  public  nowpageEventHandle(e): void {
    this.searchOwerData.pageNo = e;
    this.queryData(this.searchOwerData);
  }

  public  eventClick(e): void {
      // if (！e)
    if (e === 'false') {
      this.optionDialog.dialog = false;
      this.ownerSelect = [];
    } else {
      for (const key in e.value.value) {
           this.CalcPaymentData[key] = this.datePipe.transform(e.value.value[key], 'yyyy-MM-dd');
      }
      this.calcLatepayment(this.CalcPaymentData);
    }
  }

  public  calcLatepayment(data): void {
    console.log(data);
    this.lateSrv.calcLatepayment(data).subscribe(
        value => {
          console.log(value);
        }
      );
  }
  // 设置按钮显示隐藏
  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '业主信息') {
        this.globalSrv.getChildrenRouter({parentCode: v.parentCode}).subscribe(value => {
          console.log(value);
          value.data.forEach( item => {
            this.btnHiden.forEach( val => {
              if (item.title === val.label) {
                val.hidden = false;
                console.log(val);
              }
            });
          });
        });
      }
    });
  }
}
