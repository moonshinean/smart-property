import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ConfirmationService} from 'primeng/api';
import {GlobalService} from '../../../common/services/global.service';
import {LocalStorageService} from '../../../common/services/local-storage.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {DatePipe} from '@angular/common';
import {SharedServiceService} from '../../../common/public/shared-service.service';
import {ThemeService} from '../../../common/public/theme.service';
import {FileOption} from '../../../common/components/basic-dialog/basic-dialog.model';
import {ChargePaymentService} from '../../../common/services/charge-payment.service';
import {DataTree} from '../../../common/components/basic-dialog/dialog.model';
import {AddSparkSpace, ChargePaymentAddOrder, RentalAddSparkSpace} from '../../../common/model/charge-payment.model';
import {TreeNode} from '../../../common/model/shared-model';
import {validate} from 'codelyzer/walkerFactory/walkerFn';

@Component({
  selector: 'rbi-charge-pay-parkspace',
  templateUrl: './charge-pay-parkspace.component.html',
  styleUrls: ['./charge-pay-parkspace.component.less']
})
export class ChargePayParkspaceComponent implements OnInit, OnDestroy {

  //
  public paymentParkSpaceTableContnt: any;
  // 状态值相关
  public lincesePlateTypeOption: any;
  public vehicleOriginaTypeOption: any;
  public lincesePlateColorOption: any;
  public parkSpaceTypeOption: any;
  public parkSpacePlaceOption: any;
  public paymentMethodOption: any;
  // 按钮权限相关
  public btnHiden = [

    {label: '车位办理', hidden: true},
    {label: '修改', hidden: true},
    {label: '删除', hidden: true},
    {label: '缴费', hidden: true},
    {label: '车位导入', hidden: true},
    {label: '搜索', hidden: true},
  ];
  public optionSpackTable: any;
  public paymentParkSpaceSelect: any;
  // 搜索相关
  public searchOption = [
    {label: '手机号', value: 1},
    {label: '房间号', value: 2},
    {label: '姓名', value: 3},
    {label: '身份证号', value: 4},
  ];
  public nowPage = 1;
  // 查询相关
  public SearchData = {
    pageSize: 10,
    pageNo: 1,
    code: '',
    level: '',
    type: ''
  };
  public searchType = 0;
  public searchData = '';
  // 上传车位信息
  public UploadFileOption: FileOption = new FileOption();
  public uploadRecordOption: any;
  // 树结构相关
  public treeDialog: boolean;
  public dataTrees: DataTree[];
  public dataTree: DataTree = new DataTree();
  // 车位办理
  public addParkSpaceOptionDialog: boolean;
  public rentalParkSpace: RentalAddSparkSpace  = new RentalAddSparkSpace();
  // 修改车位
  public modifyParkSpaceOptionDialog: boolean;
  // 车位指定
  public addParkSpace: AddSparkSpace = new AddSparkSpace();
  // 详情相关
  public dialogOption: any;
  // 树结构订阅
  public paymentSub: Subscription;
  // 切换主题
  public themeSub: Subscription;
  public table = {
    tableheader: {background: '', color: ''},
    tableContent: [
      {background: '', color: ''},
      {background: '', color: ''}],
    detailBtn: ''
  };
  // 输入缴费月数
  public paymentMonth = 1;
  public MonthDialog: boolean;
  // 缴费信息
  public paymentTotle: any;
  public paymentMoney: any;
  public Balance = 0;
  public paymentOrderAdd: ChargePaymentAddOrder  = new ChargePaymentAddOrder();
  public paymentAddTitle =  [
    {name: '小区名称', value: '', label: 'villageName'},
    {name: '地块名称', value: '', label: 'regionName'},
    {name: '楼栋名称', value: '', label: 'buildingName'},
    {name: '楼层', value: '', label: 'floor'},
    {name: '车位编号', value: '', label: 'parkingSpaceCode'},
    {name: '车位地点', value: '', label: 'parkingSpacePlace'},
    {name: '车位类型', value: '', label: 'parkingSpaceType'},
    {name: '车牌号', value: '', label: 'licensePlateNumber'},
    {name: '车主姓名', value: '', label: 'authorizedPersonName'},
    {name: '车主电话', value: '', label: 'authorizedPersonPhone'},
    {name: '车主身份证', value: '', label: 'authorizedPersonIdNumber'},
    {name: '车牌颜色', value: '', label: 'licensePlateColor'},
    {name: '车牌类型', value: '', label: 'licensePlateType'},
    {name: '原始车辆类型', value: '', label: 'vehicleOriginalType'},
    {name: '项目名称', value: '', label: 'chargeName'},
    {name: '收费标准', value: '', label: 'chargeStandard'},
    {name: '收费单位', value: '', label: 'chargeUnit'},
    {name: '缴费月数', value: '', label: 'datedif'},
    {name: '折扣率', value: '', label: 'discount'},
    {name: '项目类型', value: '', label: 'chargeType'},
    {name: '开始时间', value: '', label: 'startTime'},
    {name: '结束时间', value: '', label: 'dueTime'},
  ];
  public  parkSpaceData: RentalAddSparkSpace = new RentalAddSparkSpace();
  // 打开链接列表
  public openListDataPdf: any[] = [];
  public openListLength: any;
  // 分页
  public option: any;
  public esDate: any;

  // 缴费相关
  public paymentParkSpaceDialog: any;
  constructor(
    private paymentSrv: ChargePaymentService,
    private confirmationService: ConfirmationService,
    private globalSrv: GlobalService,
    private localSrv: LocalStorageService,
    public  toolSrv: PublicMethedService,
    private datePipe: DatePipe,
    private  sharedSrv: SharedServiceService,
    private themeSrv: ThemeService
  ) {
    // this.themeSrv.changeEmitted$
    this.themeSub = this.themeSrv.changeEmitted$.subscribe(
      value => {
        this.table.tableheader = value.table.header;
        this.table.tableContent = value.table.content;
        this.table.detailBtn = value.table.detailBtn;
        console.log(value);
        this.setTableOption(this.paymentParkSpaceTableContnt);
      }
    );
    this.paymentSub = this.sharedSrv.changeEmitted$.subscribe(
      value => {
        console.log(value);
        this.SearchData.level = value.data.level;
        this.SearchData.code = value.data.code;
        this.SearchData.type = value.data.type;
        if (this.SearchData.type === '车位' && this.SearchData.level === '4') {
          this.addParkSpace.parkingSpaceCode = this.SearchData.code;
        }
        this.nowPage = this.SearchData.pageNo = 1;
        // this.reslveSearchData();
        this.queryParrkSpacePaymentPage();
      }
    );
  }

  ngOnInit() {
    this.esDate = this.toolSrv.esDate;
    if (this.themeSrv.setTheme !== undefined) {
      this.table.tableheader = this.themeSrv.setTheme.table.header;
      this.table.tableContent = this.themeSrv.setTheme.table.content;
      this.table.detailBtn = this.themeSrv.setTheme.table.detailBtn;
    }
    if (this.sharedSrv.SearchData !== undefined) {
      this.SearchData.level = this.sharedSrv.SearchData.data.level;
      this.SearchData.code = this.sharedSrv.SearchData.data.code;
      this.SearchData.type = this.sharedSrv.SearchData.data.type;
      if (this.SearchData.type === '车位') {
        this.addParkSpace.parkingSpaceCode = this.SearchData.code;
      }
    }
    this.parkSpacePaymentInit();
    this.setBtnIsHidden();
  }
  ngOnDestroy(): void {
    this.paymentSub.unsubscribe();
    this.themeSub.unsubscribe();
  }

  public  parkSpacePaymentInit(): void {
    this.toolSrv.getAdmStatus([
      {settingType: 'LICENSE_PLATE_COLOR'}, {settingType: 'CWLX'},
      {settingType: 'VEHICLE_ORIGINA_TYPE'}, {settingType: 'LICENSE_PLATE_TYPE'},
      {settingType: 'PAEKING_SPACE_PLACE'}, {settingType: 'CWLX'}, {settingType: 'PAEKING_SPACE_PLACE'},
      {settingType: 'CWLX'}], (data) => {
      this.lincesePlateTypeOption = this.toolSrv.setListMap(data.LICENSE_PLATE_TYPE);
      this.vehicleOriginaTypeOption = this.toolSrv.setListMap(data.VEHICLE_ORIGINA_TYPE);
      this.lincesePlateColorOption = this.toolSrv.setListMap(data.LICENSE_PLATE_COLOR);
      this.parkSpacePlaceOption = this.toolSrv.setListMap(data.PAEKING_SPACE_PLACE);
      this.parkSpaceTypeOption = this.toolSrv.setListMap(data.CWLX);
      this.queryParrkSpacePaymentPage();
      this.globalSrv.getPayMethods({}).subscribe(
        value => {
          console.log(value);
          if (value.status === '1000') {
            this.paymentMethodOption = this.toolSrv.setListMap(value.data.PAYMENT_METHOD);
          } else {
            this.toolSrv.setToast('error', '支付方式查询错误', value.message);
          }
        }
      );

    });
  }
  // set table data （设置列表数据）
  public  setTableOption(data1): void {
    this.optionSpackTable = {
      width: '100.5%',
      header: {
        data:  [
          {field: 'parkingSpaceCode', header: '车位编号'},
          {field: 'contractNumber', header: '合同编号'},
          {field: 'authorizedPersonName', header: '车主姓名'},
          {field: 'authorizedPersonPhone', header: '车主电话'},
          {field: 'authorizedPersonIdNumber', header: '车主身份证号'},
          {field: 'licensePlateNumber', header: '车牌号'},
          {field: 'startTime', header: '开始计费时间'},
          {field: 'licensePlateColor', header: '车牌颜色'},
          {field: 'vehicleOriginalType', header: '车辆原始类型'},
          {field: 'operating', header: '操作'}],
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

  // 判断搜索方式
  public  searchJudgment(page): void {
    switch (this.searchType) {
      case 0:  this.queryParrkSpacePaymentPage(); break;
      case 1:  this.setCondition('phone', '请输入需要搜索的手机号', page); break;
      case 2:  this.setCondition('roomCode', '请输入需要搜索的房间号', page); break;
      case 3:  this.setCondition('surname', '请输入需要搜索的客户名称', page); break;
      case 4:  this.setCondition('idNumber', '请输入需要搜索的身份证号', page); break;
      default: break;
    }
  }
  public  setCondition(confition, message, pageNo): void {
    if (this.searchData !== '') {
      // this.queryTerantPageByCondition(confition, this.searchData, pageNo);
    } else {
      this.toolSrv.setToast('error', '操作错误', message);
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

  // Paging query data （分页查询数据）
  public   queryParrkSpacePaymentPage(): void {
    this.paymentSrv.queryPaymentParkspalceData(this.SearchData).subscribe(
      (val) => {
        console.log(val);
        if (val.status === '1000') {
          val.data.contents.forEach( t => {
            t.licensePlateType = this.toolSrv.setValueToLabel(this.lincesePlateTypeOption, t.licensePlateType);
            t.licensePlateColor = this.toolSrv.setValueToLabel(this.lincesePlateColorOption, t.licensePlateColor);
            t.vehicleOriginalType = this.toolSrv.setValueToLabel(this.vehicleOriginaTypeOption, t.vehicleOriginalType);
          });
          this.paymentParkSpaceTableContnt = val.data.contents;
          this.setTableOption(val.data.contents);
          this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};
        } else {
          this.toolSrv.setToast('error', '请求错误', val.message);
        }
      }
    );
  }
  // 分页查询
  public  nowpageEventHandle(event): void {
    this.nowPage = event;
    this.SearchData.pageNo = event;
    this.paymentSearchClick();
    this.paymentParkSpaceSelect = [];
  }
  // 车位缴费
  public  parkSpacePaymentClick(): void {
    if (this.paymentParkSpaceSelect === undefined || this.paymentParkSpaceSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要缴费的项');
    } else if (this.paymentParkSpaceSelect.length === 1) {
       this.MonthDialog = true;
    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行缴费');
    }
  }
  // condition search 条件搜索）
  public paymentSearchClick(): void {
    this.nowPage = this.SearchData.pageNo = 1;
    if (this.searchData !== '') {
      // this.searchJudgment();
    } else {
      this.toolSrv.setToast('error', '操作错误', '请填写需要搜索的值');
    }
  }
  // select data （选择数据）
  public  selectData(e): void {
    this.paymentParkSpaceSelect = e;
  }
  // show detail dialog (展示详情弹窗)
  public  detailClick(e): void {
      console.log(123);
      this.dialogOption = {
        dialog: true,
        tableHidden: false,
        width: '1000',
        type: 1,
        title: '详情',
        poplist: {
          popContent: e,
          popTitle: [
            {field: 'parkingSpaceCode', header: '车位编号'},
            {field: 'contractNumber', header: '合同编号'},
            {field: 'floor', header: '楼层'},
            {field: 'parkingSpacePlace', header: '车位地点'},
            {field: 'parkingSpaceType', header: '车位类型'},
            {field: 'authorizedPersonName', header: '车主姓名'},
            {field: 'authorizedPersonPhone', header: '车主电话'},
            {field: 'authorizedPersonIdNumber', header: '车主身份证号'},
            {field: 'surname', header: '业主姓名'},
            {field: 'mobilePhone', header: '业主电话'},
            {field: 'idNumber', header: '业主身份证号'},
            {field: 'licensePlateNumber', header: '车牌号'},
            {field: 'startTime', header: '开始时间'},
            {field: 'dueTime', header: '结束时间'},
            {field: 'licensePlateColor', header: '车牌颜色'},
            {field: 'vehicleOriginalType', header: '车辆原始类型'},
          ],
        }
      };
  }
  // 设置按钮显示权限
  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '专有车位缴费') {
        this.globalSrv.getChildrenRouter({parentCode: v.parentCode}).subscribe(value => {
          value.data.forEach(item => {
            this.btnHiden.forEach( val => {
              if (item.title === val.label) {
                val.hidden = false;
              }
            });
          });
        });
      }
    });
  }
  // 车位办理
  public  addParkSpaceClick(): void {
    console.log(this.addParkSpace.parkingSpaceCode);
    if (this.addParkSpace.parkingSpaceCode !== undefined) {
      this.addParkSpaceOptionDialog = true;
    } else {
      this.toolSrv.setToast('error', '操作错误', '请选择树结构上的车位编号');
    }
  }
  // 导入车位文件
  public importParkplaceFilesClick(): void {
    this.UploadFileOption.width = '800';
    this.UploadFileOption.dialog = true;
    this.UploadFileOption.files = [];
  }
  // 确认上传
  public paymentUploadSureClick(e): void {
    if (e.getAll('file').length !== 0) {
      this.paymentSrv.importFilesWithParkSpaceInfo(e).subscribe(
        (value) => {
          if (value.status === '1000') {
            this.UploadFileOption.files = [];
            this.uploadRecordOption = {
              width: '900',
              dialog: true,
              title: '上传记录',
              totalNumber: value.data.totalNumber,
              realNumber: value.data.realNumber,
              uploadOption: {
                width: '102%',
                tableHeader: {
                  data: [
                    {field: 'code', header: '序号'},
                    {field: 'contractNumber', header: '合同编号'},
                    {field: 'packingSpaceCode', header: '车位编号'},
                    {field: 'result', header: '结果'},
                    {field: 'remarks', header: '备注'},
                  ],
                  style: {background: '#F4F4F4', color: '#000', height: '6vh'}
                },
                tableContent: {
                  data: value.data.logParkingSpaceManagementInfoDOS,
                  styleone: {background: '#FFFFFF', color: '#000', height: '2vw', textAlign: 'center'},
                  styletwo: {background: '#FFFFFF', color: '#000', height: '2vw', textAlign: 'center'}
                }
              }
            };
            // this.ownerInfoDialog = true;
            this.toolSrv.setToast('success', '上传成功', value.message);
          } else {
            this.toolSrv.setToast('error', '上传失败', value.message);
          }
        }
      );
    } else {
      this.toolSrv.setToast('error', '操作失败', '请选择需要上传的文件');
    }
  }
  // 确认缴费
  public paymentParkSpaceSureClick(): void {
    console.log('确认');
    console.log(this.paymentParkSpaceSelect);
    if (this.paymentOrderAdd.paymentMethod === undefined) {
      this.toolSrv.setToast('error', '填写错误', '有数据没填写或者选择');
    } else {
      const listKey = ['organizationId', 'villageName',
        'villageCode', 'regionCode', 'regionName', 'buildingCode', 'buildingName', 'unitCode',
        'unitName', 'roomCode', 'roomSize', 'surname', 'mobilePhone', 'idNumber',
        'customerUserId'];
      for (const key of listKey) {
        if (key === 'roomSize') {
           this.paymentOrderAdd[key] = 0;
        } else {
          this.paymentOrderAdd[key] = this.parkSpaceData[key];
        }
      }
      this.paymentOrderAdd.oneMonthPropertyFee = 0;
      this.paymentOrderAdd.surname = this.parkSpaceData.authorizedPersonName;
      this.paymentOrderAdd.mobilePhone = this.parkSpaceData.authorizedPersonPhone;
      this.paymentOrderAdd.idNumber = this.parkSpaceData.authorizedPersonIdNumber;
      this.paymentOrderAdd.payerPhone = this.paymentOrderAdd.payerPhone === undefined ? '' : this.paymentOrderAdd.payerPhone;
      this.paymentOrderAdd.payerName = this.paymentOrderAdd.payerName === undefined ? '' : this.paymentOrderAdd.payerName;
      this.paymentOrderAdd.remark = this.paymentOrderAdd.remark === undefined ? '' : this.paymentOrderAdd.remark;
      this.paymentOrderAdd.amountTotalReceivable = this.paymentTotle;
      this.paymentOrderAdd.actualTotalMoneyCollection = this.paymentMoney;
      this.paymentOrderAdd.billDetailedDOArrayList = [];

      this.parkSpaceData.parkingSpaceType = this.toolSrv.setLabelToValue(this.parkSpaceTypeOption, this.parkSpaceData.parkingSpaceType);
      this.parkSpaceData.vehicleOriginalType = this.toolSrv.setLabelToValue(this.vehicleOriginaTypeOption, this.parkSpaceData.vehicleOriginalType);
      this.parkSpaceData.licensePlateType = this.toolSrv.setLabelToValue(this.lincesePlateTypeOption, this.parkSpaceData.licensePlateType);
      this.parkSpaceData.licensePlateColor = this.toolSrv.setLabelToValue(this.lincesePlateColorOption, this.parkSpaceData.licensePlateColor);
      this.parkSpaceData.parkingSpacePlace = this.toolSrv.setLabelToValue(this.parkSpacePlaceOption, this.parkSpaceData.parkingSpacePlace);
      this.paymentOrderAdd.parkingSpaceCostDetailDOList = [];
      this.paymentOrderAdd.parkingSpaceCostDetailDOList.push(this.parkSpaceData);

      // console.log(this.parkSpaceData);
      // this.paymentOrderAdd.parkingSpaceCostDetailDOList = this.paymentParkSpaceSelect.map(v => {
      //   v.parkingSpaceType = this.toolSrv.setLabelToValue(this.parkSpaceTypeOption, v.parkingSpaceType);
      //   v.vehicleOriginalType = this.toolSrv.setLabelToValue(this.vehicleOriginaTypeOption, v.vehicleOriginalType);
      //   v.licensePlateType = this.toolSrv.setLabelToValue(this.lincesePlateTypeOption, v.licensePlateType);
      //   v.licensePlateColor = this.toolSrv.setLabelToValue(this.lincesePlateColorOption, v.licensePlateColor);
      //   v.parkingSpacePlace = this.toolSrv.setLabelToValue(this.parkSpacePlaceOption, v.parkingSpacePlace);
      //   return v;
      // });
      this.paymentOrderAdd.costDeduction = [];
      this.paymentOrderAdd.correctedAmount = this.Balance;
      console.log(this.paymentOrderAdd);
      this.paymentSrv.addPayOrder(this.paymentOrderAdd).subscribe(
        (value) => {
          if (value.status === '1000') {
            this.confirmationService.confirm({
              message: `是否打印单据吗？`,
              header: '缴费成功',
              icon: 'pi pi-exclamation-triangle',
              accept: () => {
                this.openListLength = value.data.length;
                value.data.forEach(v => {
                  this.printBillDetail(v.orderId, v.organizationId);
                  this.paymentParkSpaceDialog = false;
                  this.paymentParkSpaceSelect = [];
                  this.parkSpacePaymentInit();
                });
              },
              reject: () => {
                this.paymentParkSpaceDialog = false;
                this.paymentParkSpaceSelect = [];
                this.parkSpacePaymentInit();
              }
            });
          } else {
            this.toolSrv.setToast('error', '请求错误', value.message);
          }
        }
      );
    }
  }
  // 取消缴费
  public paymentParkSpaceFaleseClick(): void {
    console.log('取消');
    this.paymentParkSpaceDialog = false;
    this.paymentParkSpaceSelect = [];
    this.addParkSpace = new AddSparkSpace();
  }
  // // 树结构选择
  // public dataTreeSureClick(): void {
  //   this.treeDialog = false;
  //   const dataList = ['villageCode', 'villageName', 'regionCode', 'regionCode', 'buildingCode', 'buildingName', 'parkingSpaceCode'];
  //   for (const itemkey of dataList) {
  //     this.rentalParkSpace[itemkey] = '';
  //   }
  //   this.addParkSpace.parkingSpaceCode = this.dataTree.label;
  // }
  // 删除车位
  public deleteParkSpaceClick(): void {
    if (this.paymentParkSpaceSelect === undefined || this.paymentParkSpaceSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.toolSrv.setConfirmation('删除', `删除这${this.paymentParkSpaceSelect.length}项`, () => {
        const deleteList = this.paymentParkSpaceSelect.map( v => {
          return {id: v.parkingSpaceManagementId};
        });
        console.log(deleteList);
        this.paymentSrv.deletePaymentParksplace({data: deleteList}).subscribe(
          value => {
            if (value.status === '1000') {
              this.parkSpacePaymentInit();
              this.paymentParkSpaceSelect = [];
            } else {
              this.toolSrv.setToast('error', '删除失败', value.message);
            }
          }
        );
      });
    }
  }

  // 修改车位
  public  modifyParkSpaceClick(): void {
   if (this.paymentParkSpaceSelect === undefined || this.paymentParkSpaceSelect.length === 0) {
     this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
   } else if (this.paymentParkSpaceSelect.length === 1) {
     for (let key in this.paymentParkSpaceSelect[0]) {
       this.addParkSpace[key] = this.paymentParkSpaceSelect[0][key];
     }
     // const list = ['parkingSpaceManagementId', 'parkingSpaceCode', 'authorizedPersonName', 'authorizedPersonPhone', 'authorizedPersonIdNumber', 'licensePlateNumber', 'licensePlateColor', 'licensePlateType',
     //   'vehicleOriginalType', 'startTime'];
     // list.forEach(value => {
     //
     // });
     this.addParkSpace.licensePlateColor = this.toolSrv.setLabelToValue(this.lincesePlateColorOption,  this.addParkSpace.licensePlateColor);
     this.addParkSpace.licensePlateType = this.toolSrv.setLabelToValue(this.lincesePlateTypeOption,  this.addParkSpace.licensePlateType);
     this.addParkSpace.vehicleOriginalType = this.toolSrv.setLabelToValue(this.vehicleOriginaTypeOption,  this.addParkSpace.vehicleOriginalType);
     this.modifyParkSpaceOptionDialog = true;
   } else {
     this.toolSrv.setToast('error', '操作错误', '只能选择一项进行修改');
   }
 }
  // 确认添加
  public  addParkSpaceSureClick(): void {
    console.log(this.addParkSpace);
    let passFlag = true;
    const list = ['parkingSpaceCode', 'startTime'];
    list.forEach(v => {
      if ( this.addParkSpace[v] === undefined ||  this.addParkSpace[v] === '') {
        passFlag = false;
      }
    });
    if (this.addParkSpace.startTime) {
      this.addParkSpace.startTime = this.datePipe.transform(this.addParkSpace.startTime, 'yyyy-MM-dd');
    }
    if (passFlag) {
      this.paymentSrv.setRoomCodeBindParkSpace(this.addParkSpace).subscribe(value => {
        console.log(value);
        if (value.status === '1000') {
          this.toolSrv.setToast('success', '请求成功', value.message);
          this.addParkSpaceOptionDialog = false;
          this.addParkSpace = new AddSparkSpace();
          this.paymentParkSpaceSelect = [];
          this.parkSpacePaymentInit();
        } else {
          this.toolSrv.setToast('error', '请求失败', value.message);
        }
      });
    } else {
      this.toolSrv.setToast('error', '操作错误', '参数未填完整');
    }
  }
  // 确认修改
  public  modifyParkSpaceSureClick(): void {
    let passFlag = true;
    const list = ['parkingSpaceManagementId', 'parkingSpaceCode', 'authorizedPersonName', 'authorizedPersonPhone', 'authorizedPersonIdNumber', 'licensePlateNumber', 'licensePlateColor', 'licensePlateType',
      'vehicleOriginalType', 'startTime'];
    list.forEach(v => {
      if (this.addParkSpace[v] === undefined || this.addParkSpace[v] === '') {
        passFlag = false;
      }
    });
    this.addParkSpace.startTime = this.datePipe.transform(this.addParkSpace.startTime, 'yyyy-MM-dd');
    if (passFlag) {
      this.toolSrv.setConfirmation('修改', '修改', () => {
          this.paymentSrv.changeParkSpace(this.addParkSpace).subscribe(value => {
            console.log(value);
            if (value.status === '1000') {
              this.toolSrv.setToast('success', '请求成功', value.message);
              this.modifyParkSpaceOptionDialog = false;
              this.addParkSpace = new AddSparkSpace();
              this.paymentParkSpaceSelect = [];
              this.parkSpacePaymentInit();
            } else {
              this.toolSrv.setToast('error', '请求失败', value.message);
            }
          });
      });
    } else {
        this.toolSrv.setToast('error', '操作错误', '参数未填完整');
    }
  }

  public  calcParkSpaceFree(code, month): void {
      this.paymentSrv.calculateParksplaceFree({parkingSpaceCode: code, datedif: month}).subscribe(
        value => {
          console.log(value);
          if (value.status === '1000') {
            this.parkSpaceData = value.data;
            value.data.licensePlateColor = this.toolSrv.setValueToLabel(this.lincesePlateColorOption,  value.data.licensePlateColor);
            value.data.licensePlateType = this.toolSrv.setValueToLabel(this.lincesePlateTypeOption,  value.data.licensePlateType);
            value.data.vehicleOriginalType = this.toolSrv.setValueToLabel(this.vehicleOriginaTypeOption,  value.data.vehicleOriginalType);
            value.data.parkingSpacePlace = this.toolSrv.setValueToLabel(this.parkSpacePlaceOption,  value.data.parkingSpacePlace);
            value.data.parkingSpaceType = this.toolSrv.setValueToLabel(this.parkSpaceTypeOption,  value.data.parkingSpaceType);
            this.paymentAddTitle.forEach( v => {
              v.value = value.data[v.label];
            });

            this.paymentTotle = value.data.amountReceivable;
            this.paymentMoney = value.data.actualMoneyCollection;
          } else {
            this.toolSrv.setToast('error', '请求失败', value.message);
          }
        }
      );
  }
  // 缴费
  public payParkSpaceSureClick(): void {
    if (this.paymentMonth !== null) {
      this.calcParkSpaceFree(this.paymentParkSpaceSelect[0].parkingSpaceCode, this.paymentMonth);
      this.paymentParkSpaceDialog = true;
      this.MonthDialog = false;
    }else {
      this.toolSrv.setToast('error', '操作错误', '请输入缴费月数');
    }
 }
  // Calculated amount (计算金额)
  public getBalance(e): void {
    this.Balance = parseFloat(( e.target.value - this.paymentTotle).toFixed(2));
  }

  // 打印单据
  public printBillDetail(orderIdData, organizationIdData): void {
    // const newWindow = window.open();
    // console.log(123);
    this.paymentSrv.getPayDocument({orderId: orderIdData, organizationId: organizationIdData}).subscribe(
      (data) => {
        console.log(data);
        if (data.status === '1000') {
          if (data.data !== '' && data.data !== null) {
            this.openListDataPdf.push(data.data);
            console.log(this.openListDataPdf);
            if (this.openListDataPdf.length === this.openListLength) {
              this.openListDataPdf.forEach( (v, index) => {
                window.open(v, index.toString());
              });
              this.parkSpacePaymentInit();
              this.paymentParkSpaceDialog = false;
            }
          } else {
            this.toolSrv.setToast('error', '操作失败', '数据为空');
          }
        } else {
          this.toolSrv.setToast('error', '请求失败', data.message);
        }
      }
    );
  }

  public clearData(): void {
      this.addParkSpace = new AddSparkSpace();
      this.paymentParkSpaceSelect = [];
  }
}
