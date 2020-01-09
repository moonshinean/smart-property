import {Component, OnDestroy, OnInit} from '@angular/core';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {LatePaymentService} from '../../../common/services/late-payment.service';
import {LatePaymentQueryData, ModifyLatePayment} from '../../../common/model/latepayment.model';
import {FileOption} from '../../../common/components/basic-dialog/basic-dialog.model';
import {DialogModel, FormValue} from '../../../common/components/basic-dialog/dialog.model';
import {FormGroup} from '@angular/forms';
import {BtnOption} from '../../../common/components/header-btn/headerData.model';
import {Subscription} from 'rxjs';
import {ThemeService} from '../../../common/public/theme.service';
import {GlobalService} from '../../../common/services/global.service';
import {LocalStorageService} from '../../../common/services/local-storage.service';
import {SharedServiceService} from '../../../common/public/shared-service.service';

@Component({
  selector: 'rbi-latepayment-total',
  templateUrl: './latepayment-total.component.html',
  styleUrls: ['./latepayment-total.component.less']
})
export class LatepaymentTotalComponent implements OnInit, OnDestroy {

  public latepaymentContent: any;
  public optionTable: any;
  public latetotleSelect = [];
  // 基础按钮相关
  public btnOption: BtnOption = new BtnOption();
  // 上传相关
  public UploadFileOption: FileOption = new FileOption();
  // 上传详情记录相关
  public fileRecordoption: any;
  // 详情相关
  public dialogOption: any;
  public detailTitle: any;
  // 修改相关
  public modifyLatePayment: ModifyLatePayment = new ModifyLatePayment();
  // 删除相关
  public ids: any[] = [];
  // 其他相关
  public form: FormValue[] = [];
  public formgroup: FormGroup;
  public formdata: any[];
  public optionDialog: DialogModel = new DialogModel();
  public pageOption: any;
  // 搜索相关
  public SearchData = {
    villageCode: '',
    regionCode: '',
    buildingCode:  '',
    unitCode: '',
    roomCode: '',
    mobilePhone: '',
    idNumber: '',
    surname: '',
    pageNo: 1,
    pageSize: 10
  };
  public searchOption = [
    {label: '手机号', value: 1},
    {label: '房间号', value: 2},
    {label: '姓名', value: 3},
    {label: '身份证号', value: 4},
  ];
  public searchType = 0;
  public searchData = '';
  public nowPage: any;

  public latePaymentSub: Subscription;
  public themeSub: Subscription;
  public table = {
    tableheader: {background: '', color: ''},
    tableContent: [
      {background: '', color: ''},
      {background: '', color: ''}],
    detailBtn: ''
  };

  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private toolSrv: PublicMethedService,
    private lateSrv: LatePaymentService,
    private globalSrv: GlobalService,
    private localSrv: LocalStorageService,
    private sharedSrv: SharedServiceService,
    private themeSrv: ThemeService,
  ) {
    this.themeSub =  this.themeSrv.changeEmitted$.subscribe(
      value => {
        this.table.tableheader = value.table.header;
        this.table.tableContent = value.table.content;
        this.table.detailBtn = value.table.detailBtn;
        this.setTableOption(this.latepaymentContent);
      }
    );
    this.latePaymentSub = this.sharedSrv.changeEmitted$.subscribe(
      value => {
        for (const key in value) {
          if (key !== 'data') {
            this.SearchData[key] = value[key];
          }
        }
        this.nowPage = this.SearchData.pageNo = 1;
        this.reslveSearchData();
        this.queryData();
      }
    );
  }
  ngOnInit() {
    this.btnOption.btnlist = [
      {label: '修改', src: 'assets/images/ic_modify.png', style: {background: '#3A78DA', marginLeft: '2vw'} , hidden: true },
      {label: '删除', src: 'assets/images/ic_delete.png', style: {background: '#A84847', marginLeft: '1vw'} , hidden: true},
      {label: '导入', src: '', style: {background: '#55AB7F', marginLeft: '1vw'} ,  hidden: true},
      {label: '搜索', src: '', style: '' , hidden: true},
    ];
    this.setBtnIsHidden();
    if (this.sharedSrv.SearchData !== undefined) {
      for (const key in this.sharedSrv.SearchData) {
        if (key !== 'data') {
          this.SearchData[key] = this.sharedSrv.SearchData[key];
        }
      }
    }
    if (this.themeSrv.setTheme !== undefined) {
      this.table.tableheader = this.themeSrv.setTheme.table.header;
      this.table.tableContent = this.themeSrv.setTheme.table.content;
      this.table.detailBtn = this.themeSrv.setTheme.table.detailBtn;
    }
    this.latetotleInitialization();
  }
  ngOnDestroy(): void {
    this.themeSub.unsubscribe();
    this.latePaymentSub.unsubscribe();
  }
  // Initialize latetotle data
  public  latetotleInitialization(): void {
    console.log(123);
    this.queryData();
  }

  // show add latetotle dialog
  public  latetotleModifyClick(): void {
     if (this.latetotleSelect.length === undefined || this.latetotleSelect.length === 0 ) {
       this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
     }  else if (this.latetotleSelect.length === 1) {
       this.optionDialog = {
         type: 'add',
         title: '修改信息',
         width: '800',
         dialog: true
       };
       const list = ['id', 'liquidatedDamageDueTime', 'remarks'];
       list.forEach(val => {
         if (val === 'remarks') {
           this.form.push({key: val, disabled: false, required: false, value: ''});
         } else {
           this.form.push({key: val, disabled: false, required: true, value: this.latetotleSelect[0][val]});
         }
       });
       this.formgroup = this.toolSrv.setFormGroup(this.form);
       this.formdata = [
         {label: '违约金到期时间', type: 'input', name: 'liquidatedDamageDueTime', option: '', placeholder: '请输入时间(必填项),例如：2019-04-12'},
         {label: '备注', type: 'textbox', name: 'remarks', option: '', placeholder: this.latetotleSelect[0].remarks, value: {row: 2, col: 6}},
       ];
     } else {
       this.toolSrv.setToast('error', '操作错误', '只能选择一项进行修改');
     }
  }
  // sure add latetotle
  public  latetotleModifySureClick(): void {
    // console.log(this.primitDatas);
    this.toolSrv.setConfirmation('修改', '修改', () => {
      this.lateSrv.updateLatePayment(this.modifyLatePayment).subscribe(
        value => {
          this.toolSrv.setQuestJudgment(value.status, value.message, () => {
            this.optionDialog.dialog = false;
            this.latetotleSelect = [];
            this.queryData();
          });
        }
      );
    });
  }
  // delete latetotle
  public  latetotleDeleteClick(): void {
    if (this.latetotleSelect === undefined || this.latetotleSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.toolSrv.setConfirmation('删除', `删除这${this.latetotleSelect.length}项`, () => {
        this.latetotleSelect.forEach( v => {
          this.ids.push(v.id);
        });
        this.lateSrv.deleteLatePayment({ids: this.ids.join(',')}).subscribe(
          (value) => {
            this.toolSrv.setQuestJudgment(value.status, value.message, () => {
              this.latetotleInitialization();
              this.latetotleSelect = [];
            });
          }
        );
      });
    }
  }
  // paging query
  public  nowpageEventHandle(event: any): void {
    this.SearchData.pageNo = event;
    this.selectSearchType();
    this.latetotleSelect = [];
  }
  // show upload file dialog
  public uploadFileClick(): void {
      this.UploadFileOption.dialog = true;
      this.UploadFileOption.files = [];
      this.UploadFileOption.width = '800';
  }
  // sure upload file
  public  UploadSureClick(e): void {
    this.lateSrv.uploadFile(e).subscribe(
      (value) => {
        if (value.status === '1000') {
         this.toolSrv.setToast('success', '请求成功', '上传成功');
         this.UploadFileOption.files = [];
         // this.UploadFileOption.dialog = false;
         this.fileRecordoption = {
           width: '900',
           dialog: true,
           title: '上传记录',
           totalNumber: value.data.totalNumber,
           realNumber: value.data.realNumber,
           uploadOption: {
             width: '102%',
             tableHeader: {
               data: [
                 {field: 'orderId', header: '导入编号'},
                 {field: 'code', header: '编号'},
                 {field: 'roomCode', header: '房间号'},
                 {field: 'result', header: '结果'},
                 {field: 'remarks' +
                     '', header: '备注'},
               ],
               style: { background: '#F4F4F4', color: '#000', height: '6vh'}
             },
             tableContent: {
               data: value.data.liquidatedDamageLogDOS,
               styleone: { background: '#FFFFFF', color: '#000', height: '2vw', textAlign: 'center'},
               styletwo: { background: '#FFFFFF', color: '#000', height: '2vw', textAlign: 'center'}
             }
           }
         };
         this.queryData();
        }
        console.log(value);
      });
  }
  // set table data
  public  setTableOption(data1): void {
    this.optionTable = {
      width: '101.4%',
      header: {
        data:  [
          {field: 'orderId', header: '订单编号'},
          {field: 'villageName', header: '小区名称'},
          {field: 'roomCode', header: '房间号'},
          {field: 'roomSize', header: '房间大小'},
          {field: 'surname', header: '客户姓'},
          {field: 'mobilePhone', header: '手机号'},
          {field: 'propertyActualMoneyCollection', header: '物业费金额'},
          {field: 'actualTotalMoneyCollection', header: '实收金额'},
          {field: 'month', header: '缴费月数'},
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
  // set detail dialog data
  public  detailClick(e): void {
      this.detailTitle = [
      {field: 'orderId', header: '订单编号'},
      {field: 'villageName', header: '小区名称'},
      {field: 'regionName', header: '地块名称'},
      {field: 'buildingName', header: '楼宇名称'},
      {field: 'unitName', header: '单元名称'},
      {field: 'roomCode', header: '房间号'},
      {field: 'roomSize', header: '房间大小'},
      {field: 'surname', header: '客户姓'},
      {field: 'mobilePhone', header: '手机号'},
      {field: 'amountTotalReceivable', header: '应收总金额'},
      {field: 'actualTotalMoneyCollection', header: '实收总金额'},
      {field: 'surplusTotal', header: '减免金额'},
      {field: 'surplusReason', header: '减免原因'},
      {field: 'auditStatus', header: '审核状态'},
      {field: 'reviserId', header: '修订人'},
      {field: 'auditId', header: '审核人'},
      {field: 'retrialId', header: '复核人'},
      {field: 'propertyActualMoneyCollection', header: '物业费金额'},
      {field: 'month', header: '缴费月数'},
      {field: 'liquidatedDamageDueTime', header: '违约金到期时间'},
      {field: 'startTime', header: '物业费计费开始时间'},
      {field: 'dueTime', header: '物业费计费结束时间'},
      {field: 'oneMonthPropertyFeeAmount', header: '单月物业费'},
      {field: 'tollCollectorName', header: '操作人姓名'},
      {field: 'superfluousAmount', header: '超额物业费'},
      {field: 'reviserName', header: '修订人姓名'},
      {field: 'auditName', header: '审核人姓名'},
      {field: 'retrialName', header: '复审人姓名'},
      {field: 'quarterlyCycleTime', header: '季度周期循环时间'},
      {field: 'remarks', header: '备注'},

    ];
      if (e.liquidatedDamages) {
        this.dialogOption = {
          dialog: true,
          tableHidden: true,
          width: '1000',
          type: 2,
          title: '详情',
          poplist: {
            popContent: e,
            popTitle: this.detailTitle,
          },
          tablelist: {
            width: '100%',
            title: '违约金信息',
            tableHeader: {
              data: [
                {field: 'dueTimeFront', header: '季度初'},
                {field: 'dueTimeAfter', header: '季度末'},
                {field: 'days', header: '欠费天数'},
                {field: 'amountMoney', header: '金额'},
              ],
              style: {background: '#ffffff', color: '#000000', height: '6vh'},
            },
            tableContent: {
              data: JSON.parse(e.liquidatedDamages),
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
            popTitle:  this.detailTitle,
          }
        };
      }
  }
  // query data
  public  queryData(): void {
    this.lateSrv.queryLatePaymentPageData(this.SearchData).subscribe(
      value => {
        console.log(value);
        if (value.status === '1000') {
          this.latepaymentContent = value.data.contents;
          this.setTableOption(value.data.contents);
          this.pageOption = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        } else {
          this.toolSrv.setToast('error', '请求失败', value.message);
        }
      }
    );
  }
  // dialog click event
  public  eventClick(e): void {
    if (e === 'false') {
      this.optionDialog.dialog = false;
      this.latetotleSelect = [];
    } else {
      if (e.invalid) {
        if (e.type === '添加信息') {
          for (const eKey in e.value.value) {
            // const a = eKey;
          }
        } else  {
          for (const eKey in e.value.value) {
            // const a = eKey;
            this.modifyLatePayment[eKey] = e.value.value[eKey];
          }
          this.latetotleModifySureClick();
        }
      } else {
        this.toolSrv.setToast('error', '操作错误', '信息未填完整');
      }
    }
  }
  // select data
  public selectData(e): void {
    this.latetotleSelect = e;
  }
  // btn click event
  public  btnEvent(e): void {
      switch (e) {
        case '修改': this.latetotleModifyClick(); break;
        case '删除': this.latetotleDeleteClick(); break;
        case '导入': this.uploadFileClick(); break;
      }
  }
  // search data
  public  searchClick(e): void {
    this.nowPage = this.SearchData.pageNo = 1;
    this.searchType = e.type;
    this.searchData = e.value;
    if (e.value !== '') {
      this.selectSearchType();
    } else {
      this.toolSrv.setToast('error', '操作错误', '请填写需要搜索的值');
    }
  }
  // 判断搜索方式
  public  selectSearchType(): void {
    switch (this.searchType) {
      case 0: this.reslveSearchData();
              this.queryData(); break;
      case 1: this.setSearData('mobilePhone'); this.SearchData.mobilePhone = this.searchData; this.queryData(); break;
      case 2: this.setSearData('roomCode'); this.SearchData.roomCode = this.searchData; this.queryData(); break;
      case 3: this.setSearData('surname'); this.SearchData.surname = this.searchData;  this.queryData(); break;
      case 4: this.setSearData('idNumber'); this.SearchData.idNumber = this.searchData; this.queryData(); break;
      default:
        break;
    }
  }
  // 重置数据
  public  setSearData(label): void {
    for (const serchKey in this.SearchData) {
      if (serchKey !== label && serchKey !== 'pageSize' && serchKey !== 'pageNo') {
        this.SearchData[serchKey] = '';
      }
    }
  }
  // 重置搜索条件
  public  reslveSearchData(): void {
    this.SearchData.mobilePhone = '';
    this.SearchData.surname = '';
    this.SearchData.idNumber = '';
  }
  // 设置按钮显示权限
  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '违约金信息') {
        this.globalSrv.getChildrenRouter({parentCode: v.parentCode}).subscribe(value => {
          if (value.data.length !== 0) {
            value.data.forEach( vitem => {
              this.btnOption.btnlist.forEach( val => {
                  if (vitem.title === val.label) {
                       val.hidden = false;
                  }
               });
            });
          }
        });
      }
    });
  }
}
