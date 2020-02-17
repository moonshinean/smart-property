import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DatePipe} from '@angular/common';
import {GlobalService} from '../../../common/services/global.service';
import {AddTenant, ModifyTenant, OwerList, RoomTitle, Tenant} from '../../../common/model/bf-tenant.model';
import {BfTenantinfoService} from '../../../common/services/bf-tenantinfo.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {FileOption} from '../../../common/components/basic-dialog/basic-dialog.model';
import {Dropdown} from 'primeng/dropdown';
import {SharedServiceService} from '../../../common/public/shared-service.service';
import {ThemeService} from '../../../common/public/theme.service';
import {LocalStorageService} from '../../../common/services/local-storage.service';
import {UpdateTreeService} from '../../../common/public/update-tree.service';


@Component({
  selector: 'rbi-bf-tenantinfo',
  templateUrl: './bf-tenantinfo.component.html',
  styleUrls: ['./bf-tenantinfo.component.less']
})
export class BfTenantinfoComponent implements OnInit {
  public tenantSelect: any;
  public tenantTableOption: any;
  public tableContent: any;
  // 查询相关
  public searchTenantData = {
    pageSize: 10,
    pageNo: 1,
    code: '',
    level: '',
    type: ''
  };
  public SearchTypeOption  = [
    {label: '手机号', value: 1},
    {label: '房间号', value: 2},
    {label: '业主姓名', value: 3},
    {label: '身份证号', value: 4},
  ];
  public inputSearchData = '';
  public searchType = 0;
  // 状态值相关
  public roomTypeOption: any[] = [];
  public roomStatusOption: any[] = [];
  public renovationStatusOption: any[] = [];
  public sexOption: any[] = [];
  public identityOption: any[] = [];
  public normalChargeOption: any[] = [];

  // 详情相关
  public tenantDetailDialog: boolean;
  public detailrMoreDetailDetail = [
    {field: 'surname', header: '客户姓氏'},
    {field: 'sex', header: '性别'},
    {field: 'identity', header: '身份'},
    {field: 'mobilePhone', header: '客户电话'},
    {field: 'idNumber', header: '身份证号'},
    {field: 'normalPaymentStatus', header: '是否正常缴费'},
    {field: 'startTime', header: '租房开始日期'},
    {field: 'endTime', header: '租房结束日期'},
    {field: 'remarks', header: '备注'},
    {field: 'operating', header: '操作'},
  ];
  public tenantRoomCodeDetailTitle = [
    {field: 'buildingName', header: '楼栋名称'},
    {field: 'roomCode', header: '房间编号'},
    {field: 'roomType', header: '房间类型'},
    {field: 'roomSize', header: '房间面积'},
    {field: 'identity', header: '客户身份'},
    {field: 'rentStatus', header: '出租状态'},
  ];
  public roomList: any[] = [];
  public tenantMoreDetail = [
    {field: 'surname', header: '客户姓氏', value: ''},
    {field: 'sex', header: '性别', value: ''},
    {field: 'mobilePhone', header: '客户电话', value: ''},
    {field: 'identity', header: '身份', value: ''},
    {field: 'normalPaymentStatus', header: '是否正常缴费', value: ''},
    // {field: 'startBillingTime', header: '物业费开始既费时间'},
    {field: 'startTime', header: '租房开始日期', value: ''},
    {field: 'endTime', header: '租房结束日期', value: ''},
    {field: 'remarks', header: '备注', value: ''},
  ];
  // 租客信息相关
  public tenantinfo: OwerList = new OwerList();
  public tenantDialog: boolean;
  public tenantModifyDialog: boolean;

  // 上传文件相关
  public UploadFileOption: FileOption = new FileOption();
  public uploadRecordOption: any;
  // 其他相关
  public option: any;
  public esDate: any;
  public deleteTenant: any[] = [];
  public table = {
    tableheader: {background: '#282A31', color: '#DEDEDE'},
    tableContent: [
      {background: '#33353C', color: '#DEDEDE'},
      {background: '#2E3037', color: '#DEDEDE'}],
    detailBtn: '#6A72A1'
  };
  // 租客信息导出
  public downtenantInfoDialog: boolean;
  public downLoadIndentity: any;
  // public mobileNumber = '';
  public nowPage = 1;
  // 判断是否选择房间
  public roomCode =  '';
  // public msgs: Message[] = []; // 消息弹窗

  // 效验表单
  public keyTenantInfoList =  [false, false, false, false, false, false];
  // 按钮权限相关
  public btnHiden = [
    {label: '新增', hidden: true},
    {label: '修改', hidden: true},
    {label: '注销', hidden: true},
    {label: '删除', hidden: true},
    {label: '导入', hidden: true},
    {label: '导出', hidden: true},
    {label: '搜索', hidden: true},
  ];
  constructor(
    private confirmationService: ConfirmationService,
    private tenantSrv: BfTenantinfoService,
    public toolSrv: PublicMethedService,
    private localSrv: LocalStorageService,
    private globalSrv: GlobalService,
    private datePipe: DatePipe,
    private shareSrv: SharedServiceService,
    private themeSrv: ThemeService
  ) {
    this.themeSrv.changeEmitted$.subscribe(
      value => {
        this.table.tableheader = value.table.header;
        this.table.tableContent = value.table.content;
        this.table.detailBtn = value.table.detailBtn;
        this.setTableOption(this.tableContent);
      }
    );
    this.shareSrv.changeEmitted$.subscribe(value => {
      this.searchTenantData.level = value.data.level;
      this.searchTenantData.code = value.data.code;
      this.searchTenantData.type = value.data.type;
      this.roomCode = value.roomCode;
      this.queryTenantinfoPageData();
    });
  }
  ngOnInit() {
    this.setBtnIsHidden();
    if (this.themeSrv.setTheme !== undefined) {
      this.table.tableheader = this.themeSrv.setTheme.table.header;
      this.table.tableContent = this.themeSrv.setTheme.table.content;
      this.table.detailBtn = this.themeSrv.setTheme.table.detailBtn;
    }
    if (this.shareSrv.SearchData !== undefined) {
     this.searchTenantData.level = this.shareSrv.SearchData.data.level;
     this.searchTenantData.code = this.shareSrv.SearchData.data.code;
     this.searchTenantData.type = this.shareSrv.SearchData.data.type;
      this.roomCode = this.shareSrv.SearchData.roomCode;
   }
    this.tenantInitialization();
  }

  // initialization houseinfo
  public  tenantInitialization(): void {
    // console.log('这里是信息的初始化');
    this.toolSrv.getAdmStatus([{settingType: 'ROOM_TYPE'},
      {settingType: 'ROOM_STATUS'}, {settingType: 'RENOVATION_STATUS'}, {settingType: 'SEX'},
      {settingType: 'NORMAL_PAYMENT_STATUS'}, {settingType: 'IDENTITY' }], (data) => {
      this.roomTypeOption = this.toolSrv.setListMap(data.ROOM_TYPE);
      this.roomStatusOption = this.toolSrv.setListMap(data.ROOM_STATUS);
      this.renovationStatusOption = this.toolSrv.setListMap(data.RENOVATION_STATUS);
      this.sexOption = this.toolSrv.setListMap(data.SEX);
      this.normalChargeOption = this.toolSrv.setListMap(data.NORMAL_PAYMENT_STATUS);
      this.identityOption = this.toolSrv.setListMap(data.IDENTITY).filter(v => {
        return (v.value === '3' || v.value === '6');
        });
      this.queryTenantinfoPageData();
    });
    this.esDate = this.toolSrv.esDate;
  }
  // condition search click
  public  tenantSearchClick(): void {
    this.searchJudgment(1);
  }
  // 判断搜索条件
  public  searchJudgment(page): void {
    switch (this.searchType) {
      case 0:  this.queryTenantinfoPageData(); break;
      case 1:  this.setCondition('phone', '请输入需要搜索的手机号', page); break;
      case 2:  this.setCondition('roomCode', '请输入需要搜索的房间号', page); break;
      case 3:  this.setCondition('surname', '请输入需要搜索的客户名称', page); break;
      case 4:  this.setCondition('idNumber', '请输入需要搜索的身份证号', page); break;
      default: break;
    }
  }
  public  setCondition(confition, message, pageNo): void {
    if (this.inputSearchData !== '') {
      this.queryTerantPageByCondition(confition, this.inputSearchData, pageNo);
    } else {
      this.toolSrv.setToast('error', '操作错误', message);
    }
  }
  public  tenantAddClick(): void {
    if (this.roomCode !== '') {
      this.tenantDialog = true;
    } else  {
      this.toolSrv.setToast('error', '操作错误', '请选择一间房屋');
    }
  }
  // 添加租客
  public  tenantInfoAddClick(): void {
    const tenantList = ['surname', 'mobilePhone', 'idNumber', 'normalPaymentStatus', 'startTime', 'endTime'];
    tenantList.forEach((v, index) => {
      this.keyTenantInfoList[index] = this.tenantinfo[v] === undefined || this.tenantinfo[v] === '' || this.tenantinfo[v] === null;
    });
    const passStatus = tenantList.some(val => {
        return  this.tenantinfo[val] === undefined || this.tenantinfo[val] === '' || this.tenantinfo[val] === null;
    });
   if (!passStatus) {
     this.toolSrv.setConfirmation('增加', '增加', () => {
       this.tenantinfo.identity = 3;
       this.tenantinfo.endTime = this.datePipe.transform( this.tenantinfo.endTime , 'yyyy-MM-dd');
       this.tenantinfo.startTime = this.datePipe.transform( this.tenantinfo.startTime , 'yyyy-MM-dd');
       this.tenantinfo.roomCode = this.roomCode;
       this.tenantSrv.addTenantInfo(this.tenantinfo).subscribe(
         value => {
           if (value.status === '1000') {
             this.toolSrv.setToast('success', '操作成功', '添加成功');
             this.searchJudgment(this.nowPage);
             this.clearData();
             this.tenantDialog = false;
           } else {
             this.toolSrv.setToast('error', '操作失败', value.message);
           }
         });
     });
   } else {
     this.toolSrv.setToast('error', '操作失败', '信息未填完整,带*号的为必填字段');
   }
  }
  // 检验改变信息
  public  changeInput(data, index): void {
      this.keyTenantInfoList[index] = !(data !== null && data !== '');
  }
  // detail tenantInfo
  public  tenantDetailClick(e): void {
    this.tenantSrv.findTenantDetail({roomCode: e.roomCode, customerUserId: e.customerUserId}).subscribe(value => {
      if (value.status === '1000') {
        console.log(value);
        this.tenantMoreDetail = this.tenantMoreDetail.map(v => {
          v.value = e[v.field];
          return v;
        });
        this.roomList =  value.data.roomInfo.map(val => {
          val.roomType = this.toolSrv.setValueToLabel(this.roomTypeOption,  val.roomType);
          val.identity = this.toolSrv.setValueToLabel(this.identityOption, val.identity);
          return val;
        });
        this.tenantDetailDialog = true;
      } else {
        this.toolSrv.setToast('error', '操作错误', value.message);
      }
    });

  }
  // modify tenant
  public  tenantModifyClick(): void {
    if (this.tenantSelect === undefined || this.tenantSelect.length === 0 ) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.tenantSelect.length === 1) {
      const list = ['surname', 'idNumber', 'mobilePhone', 'customerUserId', 'identity', 'remarks', 'startTime', 'endTime', 'normalPaymentStatus', 'roomCode']
      for (const key of list) {
        if (key === 'identity') {
          this.tenantinfo[key] = 3;
        } else if (key === 'normalPaymentStatus') {
          this.tenantinfo[key] = this.toolSrv.setLabelToValue(this.normalChargeOption, this.tenantSelect[0][key]);
        } else {
          this.tenantinfo[key] = this.tenantSelect[0][key];
        }
      }
      this.tenantModifyDialog = true;
    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行修改');
    }
  }
  // ower modify
  public  owerInfoModifyClick(): void {
    const tenantList = ['surname', 'mobilePhone', 'idNumber', 'normalPaymentStatus', 'startTime', 'endTime'];
    tenantList.forEach((v, index) => {
      this.keyTenantInfoList[index] = this.tenantinfo[v] === undefined || this.tenantinfo[v] === '' || this.tenantinfo[v] === null;
    });
    const passStatus = tenantList.some(val => {
      return  this.tenantinfo[val] === undefined || this.tenantinfo[val] === '' || this.tenantinfo[val] === null;
    });
    if(!passStatus) {
      this.toolSrv.setConfirmation('修改', '修改', () => {
        this.tenantinfo.endTime = this.datePipe.transform( this.tenantinfo.endTime , 'yyyy-MM-dd');
        this.tenantinfo.startTime = this.datePipe.transform( this.tenantinfo.startTime , 'yyyy-MM-dd');
        this.tenantSrv.addTenantInfo(this.tenantinfo).subscribe(
          value => {
            if (value.status === '1000') {
              this.toolSrv.setToast('success', '操作成功', '修改成功');
              this.searchJudgment(this.nowPage);
              this.clearData();
              this.tenantModifyDialog = false;
            } else {
              this.toolSrv.setToast('error', '操作失败', value.message);
            }
          });
      });
    } else {
      this.toolSrv.setToast('error', '操作失败', '信息未填完整,带*号的为必填字段');
    }
  }

  public  tenantLogoutClick(): void {
    if (this.tenantSelect.length === undefined || this.tenantSelect.length === 0 ) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要注销的项');
    } else {
      const loginOutData = [];
      this.toolSrv.setConfirmation('注销', `注销这${this.tenantSelect.length}项`, () => {
        this.tenantSelect.forEach(v => {
          loginOutData.push({roomCode: v.roomCode, customerUserId: v.customerUserId, identity: this.toolSrv.setLabelToValue(this.identityOption, v.identity)});
        });
        this.tenantSrv.logoutOwnerInfo({data: loginOutData}).subscribe(
          value => {
            if (value.status === '1000') {
              this.searchJudgment(this.nowPage);
              this.clearData();
              this.toolSrv.setToast('success', '请求成功', value.message);
            } else {
              this.toolSrv.setToast('error', '请求失败', value.message);
            }
          }
        );
      });
      // this.queryOwnerUpdateData(this.ownerSelect[0].roomCode);
      // this.ownerModifayDialog = true;
    }
  }
  // delete tenant
  public  tenantDeleteClick(): void {
    if (this.tenantSelect === undefined || this.tenantSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.toolSrv.setConfirmation('删除', `删除这${this.tenantSelect.length}项`, () => {
        this.tenantSelect.forEach( v => {
          this.deleteTenant.push({roomCode: v.roomCode, customerUserId: v.customerUserId});
        });
        this.tenantSrv.deleteSingleTeanantrInfo({data: this.deleteTenant}).subscribe(
          value => {
            if (value.status === '1000') {
              this.searchJudgment(this.nowPage);
              this.clearData();
              this.toolSrv.setToast('success', '请求成功', value.message);
            } else {
              this.toolSrv.setToast('error', '请求失败', value.message);
            }
          }
        );
      });
    }
  }

  // add more info Dialog
  public  AddMoreClick(): void {
    this.UploadFileOption.files = [];
    this.UploadFileOption.dialog = true;
    this.UploadFileOption.width = '800';
  }

  // upload file
  public  tenantUploadSureClick(e): void {
    if (e.getAll('file').length !== 0) {
      this.tenantSrv.uploadTenantInfoFile(e).subscribe(
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
                    {field: 'roomCode', header: '房间编号'},
                    {field: 'surname', header: '客户姓氏'},
                    {field: 'phone', header: '客户电话'},
                    {field: 'result', header: '结果'},
                  ],
                  style: { background: '#F4F4F4', color: '#000', height: '6vh'}
                },
                tableContent: {
                  data: value.data.logOwnerInformationDOS,
                  styleone: { background: '#FFFFFF', color: '#000', height: '2vw', textAlign: 'center'},
                  styletwo: { background: '#FFFFFF', color: '#000', height: '2vw', textAlign: 'center'}
                }
              }
            };
            this.toolSrv.setToast('success', '上传成功', value.message);
            this.tenantInitialization();
          } else {
            this.toolSrv.setToast('error', '上传失败', value.message);
          }
        }
      );
    } else  {
      this.toolSrv.setToast('error', '操作失败', '请选择需要上传的文件');
    }

  }
  // 清楚选择
  public  clearData(): void {
    this.tenantSelect = [];
    this.tenantinfo = new OwerList();
    this.keyTenantInfoList =  [false, false, false, false, false, false];
  }
  // 分页请求
  public  nowpageEventHandle(event: any): void {
    this.nowPage = event;
    this.searchTenantData.pageNo = this.nowPage;
    this.tenantSelect = [];
  }

//  选择数据
  public  selectData(e): void {
      this.tenantSelect = e;
  }

  // set table data （设置列表数据）
  public  setTableOption(data1): void {
    this.tenantTableOption = {
      width: '100%',
      header: {
        data: [
          {field: 'buildingName', header: '楼栋名称'},
          {field: 'roomCode', header: '房间编号'},
          {field: 'roomType', header: '房间类型'},
          {field: 'roomSize', header: '建筑面积'},
          {field: 'surname', header: '客户名称'},
          {field: 'identity', header: '客户身份'},
          {field: 'sex', header: '客户性别'},
          {field: 'mobilePhone', header: '客户电话'},
          {field: 'idNumber', header: '身份证号'},
          {field: 'operating', header: '操作'}
        ],
        style: {background: this.table.tableheader.background, color: this.table.tableheader.color, height: '6vh'}
      },
      Content: {
        data: data1,
        styleone: {
          background: this.table.tableContent[0].background,
          color: this.table.tableContent[0].color,
          textAlign: 'center',
          height: '2vw'
        },
        styletwo: {
          background: this.table.tableContent[1].background,
          color: this.table.tableContent[1].color,
          textAlign: 'center',
          height: '2vw'
        },
      },
      type: 2,
      tableList: [{label: '详情', color: this.table.detailBtn}]
    };
  }

  // 分页查询
  public  queryTenantinfoPageData(): void {
    this.tenantSrv.queryTenantDataList(this.searchTenantData).subscribe(
      (value) => {
        console.log(value);
        if (value.status === '1000') {
          if (value.data.contents) {
            this.tableContent = value.data.contents;
            this.setQueryDataValueToLabel(value.data.contents);
          }
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        } else {
          this.toolSrv.setToast('error', '操作错误', value.message);
        }
      }
    );
  }
  // 条件查询
  public  queryTerantPageByCondition(conditions, data, nowPage): void {
    this.tenantSrv.queryTenantfoListByCondition({condition: conditions, value: data, pageSize: 10,  pageNo: nowPage }).subscribe(
      value => {

        if (value.status === '1000') {
          this.tableContent = value.data.contents;
          this.setQueryDataValueToLabel(value.data.contents);
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        } else {
          this.toolSrv.setToast('error', '查询失败', value.message);
        }
      }
    );
  }
  // 设置值转成名字
  public  setQueryDataValueToLabel(list): void {
    this.tableContent = list.map(v => {
      v.sex = this.toolSrv.setValueToLabel(this.sexOption, v.sex);
      v.identity = this.toolSrv.setValueToLabel(this.identityOption, v.identity);
      v.roomType = this.toolSrv.setValueToLabel(this.roomTypeOption, v.roomType);
      v.roomStatus = this.toolSrv.setValueToLabel(this.roomStatusOption, v.roomStatus);
      v.normalPaymentStatus = this.toolSrv.setValueToLabel(this.normalChargeOption, v.normalPaymentStatus);
      v.renovationStatus = this.toolSrv.setValueToLabel(this.renovationStatusOption, v.renovationStatus);
      return v;
    });
    this.setTableOption(this.tableContent);
  }

  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '租户资料') {
        this.globalSrv.getChildrenRouter({parentCode: v.parentCode}).subscribe(value => {
          console.log(value);
          value.data.forEach(v => {
            this.btnHiden.forEach( val => {
              if (v.title === val.label){
                val.hidden = false;
              }
            });
          });
        });
      }
    });
  }

// 导出按钮点击
  public  importOutFileClick(): void {
    if (this.searchTenantData.level !== '' && this.searchTenantData.code !== '') {
      this.downtenantInfoDialog = true;
    } else {
      this.toolSrv.setToast('error', '操作错位', '请先选择需要导出的小区');
    }
  }

  public  downloadFileOwnerInfo(): void {
    console.log(this.downLoadIndentity);
    if (this.downLoadIndentity) {
      this.tenantSrv.downloadTenantInfo({level: this.searchTenantData.level, code: this.searchTenantData.code , identity: this.downLoadIndentity}).subscribe(
        value => {
          console.log(value);
          if (value.status === '1000') {
            window.open(value.data);
            this.downtenantInfoDialog = false;
          } else {
            this.toolSrv.setToast('error', '请求失败', value.message);
          }
        }
      );
    } else {
      this.toolSrv.setToast('error', '操作失败', '请选择客户身份');
    }
  }
}
