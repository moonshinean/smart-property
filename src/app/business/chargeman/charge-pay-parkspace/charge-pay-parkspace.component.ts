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
import {AddSparkSpace, RentalAddSparkSpace} from '../../../common/model/charge-payment.model';
import {TreeNode} from '../../../common/model/shared-model';

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
  // 按钮权限相关
  public btnHiden = [
    {label: '缴费', hidden: true},
    {label: '车位办理', hidden: true},
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
    private  toolSrv: PublicMethedService,
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
    this.toolSrv.getAdmStatus([
      {settingType: 'LICENSE_PLATE_COLOR'}, {settingType: 'CWLX'},
      {settingType: 'VEHICLE_ORIGINA_TYPE'}, {settingType: 'LICENSE_PLATE_TYPE'},
      {settingType: 'PAEKING_SPACE_PLACE'}, {settingType: 'CWLX'}], (data) => {
      this.lincesePlateTypeOption = this.toolSrv.setListMap(data.LICENSE_PLATE_TYPE);
      this.vehicleOriginaTypeOption = this.toolSrv.setListMap(data.VEHICLE_ORIGINA_TYPE);
      this.lincesePlateColorOption = this.toolSrv.setListMap(data.LICENSE_PLATE_COLOR);
      this.parkSpacePlaceOption = this.toolSrv.setListMap(data.PAEKING_SPACE_PLACE);
      this.parkSpaceTypeOption = this.toolSrv.setListMap(data.CWLX);
      this.queryParrkSpacePaymentPage();
    });
    this.setBtnIsHidden();
  }
  ngOnDestroy(): void {
    this.paymentSub.unsubscribe();
    this.themeSub.unsubscribe();
  }

  // set table data （设置列表数据）
  public  setTableOption(data1): void {
    this.optionSpackTable = {
      width: '100.5%',
      header: {
        data:  [
          {field: 'parkingSpaceCode', header: '车位编号'},
          {field: 'contractNumber', header: '合同编号'},
          {field: 'roomSize', header: '房屋面积'},
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
    this.paymentParkSpaceDialog = true;
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
    if (e.parkingSpaceManagementDOS.length !== 0) {
      this.dialogOption = {
        dialog: true,
        tableHidden: true,
        width: '1000',
        type: 1,
        title: '详情',
        poplist: {
          popContent: e,
          popTitle:  [
            {field: 'villageName', header: '小区名称'},
            {field: 'regionName', header: '地块名称'},
            {field: 'buildingName', header: '楼栋名称'},
            {field: 'unitName', header: '单元名称'},
            {field: 'roomCode', header: '房间编号'},
            {field: 'roomSize', header: '建筑面积'},
            {field: 'roomType', header: '房间类型'},
            {field: 'surname', header: '客户名称'},
            {field: 'sex', header: '客户性别'},
            {field: 'idNumber', header: '身份证号'},
            {field: 'mobilePhone', header: '客户电话'},
            {field: 'dueTime', header: '物业费到期时间'},
            {field: 'surplus', header: '预存金额'},
            {field: 'prepaidAmount', header: '预缴金额'},
            {field: 'minMonth', header: '欠费月数'},
          ],
        },
        tablelist: {
          width: '102%',
          tableHeader: {
            data: [
              {field: 'buildingName', header: '楼栋名称'},
              {field: 'roomCode', header: '房间编号'},
              {field: 'parkingSpaceCode', header: '车位编号'},
              {field: 'authorizedPersonName', header: '车主姓名'},
              {field: 'authorizedPersonPhone', header: '车主电话'},
              {field: 'remarks', header: '备注'},
            ],
            style: {background: '#F4F4F4', color: '#000', height: '6vh'}
          },
          tableContent: {
            data: e.parkingSpaceManagementDOS,
            styleone: {background: '#FFFFFF', color: '#000', height: '2vw', textAlign: 'center'},
            styletwo: {background: '#FFFFFF', color: '#000', height: '2vw', textAlign: 'center'}
          }
        }
      };
    } else {
      this.dialogOption = {
        dialog: true,
        tableHidden: false,
        width: '1000',
        type: 1,
        title: '详情',
        poplist: {
          popContent: e,
          popTitle: [
            {field: 'villageName', header: '小区名称'},
            {field: 'regionName', header: '地块名称'},
            {field: 'buildingName', header: '楼栋名称'},
            {field: 'unitName', header: '单元名称'},
            {field: 'roomCode', header: '房间编号'},
            {field: 'roomSize', header: '建筑面积'},
            {field: 'roomType', header: '房间类型'},
            {field: 'surname', header: '客户名称'},
            {field: 'sex', header: '客户性别'},
            {field: 'idNumber', header: '身份证号'},
            {field: 'mobilePhone', header: '客户电话'},
            {field: 'dueTime', header: '物业费到期时间'},
            {field: 'surplus', header: '预存金额'},
            {field: 'prepaidAmount', header: '预缴金额'},
            {field: 'minMonth', header: '欠费月数'},
          ],
        }
      };
    }
  }
  // 设置按钮显示权限
  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '物业缴费') {
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

    this.addParkSpaceOptionDialog = true;
  }
  // public  dataTreeClick(): void {
  //     this.treeDialog = true;
  // }
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
  }
  // 取消缴费
  public paymentParkSpaceFaleseClick(): void {
    console.log('取消');
    this.paymentParkSpaceDialog = false;
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
              this.paymentSearchClick();
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
     const list = ['parkingSpaceCode', 'authorizedPersonName', 'authorizedPersonPhone', 'authorizedPersonIdNumber', 'licensePlateNumber', 'licensePlateColor', 'licensePlateType',
       'vehicleOriginalType', 'startTime'];
     list.forEach(value => {
       this.addParkSpace[value] = this.paymentParkSpaceSelect[0][value];
     });
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
    let passFlag = true;
    const list = ['parkingSpaceCode', 'authorizedPersonName', 'authorizedPersonPhone', 'authorizedPersonIdNumber', 'licensePlateNumber', 'licensePlateColor', 'licensePlateType',
      'vehicleOriginalType', 'startTime'];
    list.forEach(v => {
      if ( this.addParkSpace[v] === undefined ||  this.addParkSpace[v] === '') {
        passFlag = false;
      }
    });
    this.addParkSpace.startTime = this.datePipe.transform(this.addParkSpace.startTime, 'yyyy-MM-dd');
    if (passFlag) {
      this.paymentSrv.setRoomCodeBindParkSpace(this.addParkSpace).subscribe(value => {
        console.log(value);
        if (value.status === '1000') {
          this.toolSrv.setToast('success', '请求成功', value.message);
          this.addParkSpaceOptionDialog = false;
          this.addParkSpace = new AddSparkSpace();
          this.paymentParkSpaceSelect = [];
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
    const list = ['parkingSpaceCode', 'authorizedPersonName', 'authorizedPersonPhone', 'authorizedPersonIdNumber', 'licensePlateNumber', 'licensePlateColor', 'licensePlateType',
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
              this.addParkSpaceOptionDialog = false;
              this.addParkSpace = new AddSparkSpace();
              this.paymentParkSpaceSelect = [];
            } else {
              this.toolSrv.setToast('error', '请求失败', value.message);
            }
          });
      });
    } else {
        this.toolSrv.setToast('error', '操作错误', '参数未填完整');
    }
  }
}
