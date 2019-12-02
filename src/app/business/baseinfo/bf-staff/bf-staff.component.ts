import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AddStaff, DepartTree, ModifyStaff, Staff} from '../../../common/model/bf-staff.model';
import {BfStaffService} from '../../../common/services/bf-staff.service';
import {TreeNode} from '../../../common/model/shared-model';
import {DatePipe} from '@angular/common';
import {last} from 'rxjs/operators';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {ThemeService} from '../../../common/public/theme.service';
import {Subscription} from 'rxjs';
import {GlobalService} from '../../../common/services/global.service';
import {LocalStorageService} from '../../../common/services/local-storage.service';

@Component({
  selector: 'rbi-bf-staff',
  templateUrl: './bf-staff.component.html',
  styleUrls: ['./bf-staff.component.less']
})
export class BfStaffComponent implements OnInit, OnDestroy {


  public staffTableTitle: any;
  public staffTableContent: Staff[];
  public staffTableTitleStyle: any;
  public staffSelect: any;
  public optionTable: any;
  // 添加相关
  public staffAddDialog: boolean;
  public staffAdd: AddStaff = new AddStaff();

  public enableOption: any[] = [];
  public loginStatusOption: any[] = [];
  public educationalOption: any[] = [];
  public politicalStatusOption: any[] = [];
  public maritalOption: any[] = [];
  // 修改相关
  public staffModifayDialog: boolean;
  public staffModifay: ModifyStaff = new ModifyStaff();
  public enableModifyDrapPlaceholder: any;
  public loginStatusModifyDrapPlaceholder: any;
  public educationalModifyDrapPlaceholder: any;
  public politicalStatusModifyDrapPlaceholder: any;
  public maritalModifyDrapPlaceholder: any;
   // 详情相关
  public dialogOption: any;
  public staffDetailDialog: boolean;
  public staffDetail: ModifyStaff = new ModifyStaff();
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public esDate: any; // 日期参数
  public option: any; // 分页
  public nowPage = 1; // 分页
  public loadHidden = true;
  public deleteId = [];
  // depart tree
  public departDialog: boolean;
  public departTrees: DepartTree[];
  public departTree: any;
  public themeSub: Subscription;
  public table = {
    tableheader: {background: '', color: ''},
    tableContent: [
      {background: '', color: ''},
      {background: '', color: ''}],
    detailBtn: ''
  };
  // 按钮显示相关
  public btnHiden = [
    {label: '新增', hidden: true},
    {label: '修改', hidden: true},
    {label: '删除', hidden: true},
    // {label: '搜索', hidden: true},
  ];
  constructor(
    private staffSrv: BfStaffService,
    private toolSrv: PublicMethedService,
    private globalSrv: GlobalService,
    private localSrv: LocalStorageService,
    private datePipe: DatePipe,
    private themeSrv: ThemeService
  ) {
    this.themeSub = this.themeSrv.changeEmitted$.subscribe(
      value => {
        this.table.tableheader = value.table.header;
        this.table.tableContent = value.table.content;
        this.table.detailBtn = value.table.detailBtn;
        this.setTableOption(this.staffTableContent);
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
    this.staffInitialization();
  }
  ngOnDestroy(): void {
    this.themeSub.unsubscribe();
  }

  // initialization staff
  public  staffInitialization(): void {
    this.esDate = this.toolSrv.esDate;
    this.loadHidden = false;
    this.toolSrv.getAdmStatus([{settingType: 'ENABLED'},
      {settingType: 'LOGIN_STATUS'}, {settingType: 'EDUCATIONAL_BACKGROUND'}, {settingType: 'POLITICAL_STATUS'},
      {settingType: 'MARITAL_STATUS'}], (data) => {
      console.log(data);
      this.enableOption = this.toolSrv.setListMap(data.ENABLED);
      this.loginStatusOption = this.toolSrv.setListMap(data.LOGIN_STATUS);
      this.educationalOption = this.toolSrv.setListMap(data.EDUCATIONAL_BACKGROUND);
      this.politicalStatusOption = this.toolSrv.setListMap(data.POLITICAL_STATUS);
      this.maritalOption = this.toolSrv.setListMap(data.MARITAL_STATUS);
      this.queryStaffPageData();
    });
  }

  // condition search click
  // public  staffSearchClick(): void {
  //   // @ts-ignore
  // }
  // add staff
  public  staffAddClick(): void {
    this.staffAddDialog = true;
  }
  public  DepartTreeClick(): void {
    this.departDialog = true;
    this.staffSrv.queryDepartTree({}).subscribe(
      value => {
        this.departTrees = this.initializeTree(value.data);
      }
    );
  }
  public  treeSelectDepartClick(): void {
     this.staffAdd.departmentId = this.departTree.value;
     this.staffAdd.departmentName = this.departTree.label;
     this.staffModifay.departmentId = this.departTree.value;
     this.staffModifay.departmentName = this.departTree.label;
     this.departDialog = false;
  }
  // sure add staff
  public  staffAddSureClick(): void {
    this.toolSrv.setConfirmation('增加', '增加', () => {
      this.staffAdd.birthday = this.datePipe.transform(this.staffAdd.birthday , 'yyyy-MM-dd');
      this.staffAdd.hiredate = this.datePipe.transform(this.staffAdd.hiredate , 'yyyy-MM-dd');
      this.staffSrv.addStaffInfo(this.staffAdd).subscribe(
        value => {
          if (value.status === '1000') {
            this.staffAddDialog = false;
            this.toolSrv.setToast('success',  '操作成功', value.message);
            this.clearData();
            this.staffInitialization();
          } else {
            this.toolSrv.setToast('error',  '操作失败', value.message);
          }
        }
      );
    });
  }
  // modify staff
  public  staffModifyClick(): void {
    if (this.staffSelect === undefined || this.staffSelect.length === 0 ) {
      this.toolSrv.setToast('error',  '操作错误',  '请选择需要修改的项');
    } else if (this.staffSelect.length === 1) {
      this.staffModifayDialog = true;
    } else {
      this.toolSrv.setToast('error',  '操作错误',  '只能选择一项进行修改');
    }
  }
  // sure modify staff
  public  staffModifySureClick(): void {
    this.toolSrv.setConfirmation('修改', '修改', () => {
      this.staffModifay.birthday = this.datePipe.transform(this.staffModifay.birthday , 'yyyy-MM-dd');
      this.staffModifay.hiredate = this.datePipe.transform(this.staffModifay.hiredate , 'yyyy-MM-dd');
      this.staffSrv.updateStaffInfo(this.staffModifay).subscribe(
        value => {
          if (value.status === '1000') {
            this.staffModifayDialog = false;
            this.toolSrv.setToast('success',  '操作成功', value.message);
            this.clearData();
            this.staffInitialization();
          }
        }
      );
    });
  }
  // delete staff
  public  staffDeleteClick(): void {
    if (this.staffSelect === undefined || this.staffSelect.length === 0) {
      this.toolSrv.setToast('error',  '操作错误',  '请选择需要删除的项');
    } else {
      this.toolSrv.setConfirmation('删除', `删除这${this.staffSelect.length}项`, () => {
        this.staffSelect.forEach( v => {
          this.deleteId.push({id: v.id});
        });
        this.staffSrv.deleteStaffInfo({data: this.deleteId}).subscribe(
          value => {
            if (value.status === '1000') {
              this.toolSrv.setToast('success', '操作成功', value.message);
              this.clearData();
              this.staffInitialization();
            }
          }
        );
      });
    }
  }
  // Tree node
  public  treeOnNodeSelect(e): void {
    console.log(e);
  }
  // see staffinfo detail
  public  staffDetailClick(e): void {
      // console.log(e);
    this.staffDetail = e;
    this.staffDetailDialog = true;
    this.dialogOption = {
      dialog: true,
      tableHidden: false,
      width: '1000',
      type: 1,
      title: '详情',
      poplist: {
        popContent: e,
        popTitle:  [
          {field: 'organizationName', header: '组织名称'},
          {field: 'departmentName', header: '部门名称'},
          {field: 'userId', header: '用户ID'},
          {field: 'username', header: '用户名'},
          {field: 'realName', header: '真实姓名'},
          {field: 'sex', header: '性别'},
          {field: 'email', header: 'E-mail'},
          {field: 'address', header: '地址'},
          {field: 'mobilePhone', header: '手机号码'},
          {field: 'identity', header: '身份证号'},
          {field: 'identity', header: '登录状态'},
          {field: 'portraitPath', header: '头像地址'},
          {field: 'enabled', header: '是否可用'},
          {field: 'educationalBackground', header: '学历'},
          {field: 'workingYears', header: '工龄'},
          {field: 'hiredate', header: '入职时间'},
          {field: 'nativePlace', header: '籍贯'},
          {field: 'politicalStatus', header: '政治面貌'},
          {field: 'maritalStatus', header: '婚姻状况'},
          {field: 'volk', header: '民族'},
          {field: 'technicalTitle', header: '职称'},
          {field: 'remarks', header: '备注'},
        ],
      }
    };
  }
  // Data formatting
  public initializeTree(data): any {
    const oneChild = [];
    for (let i = 0; i < data.length; i++) {
      const childnode = new TreeNode();
      childnode.label = data[i].deptName;
      childnode.value = data[i].deptId;
      if (data[i].department2DTO != null && data[i].department2DTO.length !== 0 ) {
        childnode.children = this.initializeTree(data[i].department2DTO);
      } else {
        childnode.children = [];
      }
      oneChild.push(childnode);
    }
    return oneChild;
  }
  // Reset data
  public clearData(): void {
      this.staffAdd = new AddStaff();
      this.staffModifay = new AddStaff();
      this.staffSelect = [];
      this.maritalOption = [];
      this.enableOption = [];
      this.politicalStatusOption = [];
      this.loginStatusOption = [];
      this.educationalOption = [];
  }
  // paging query
  public  nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.queryStaffPageData();
  }
  public  queryStaffPageData(): void {
        this.staffSrv.queryStaffInfoPage({pageNo: this.nowPage, pageSize: 10 }).subscribe(
          value => {
            this.loadHidden = true;
            value.data.contents.forEach( v => {
              v.enabled = this.toolSrv.setValueToLabel(this.enableOption, v.enabled);
              v.loginStatus = this.toolSrv.setValueToLabel(this.loginStatusOption, v.loginStatus);
              v.maritalStatus = this.toolSrv.setValueToLabel(this.maritalOption, v.maritalStatus);
              v.politicalStatus = this.toolSrv.setValueToLabel(this.politicalStatusOption, v.politicalStatus);
              v.educationalBackground = this.toolSrv.setValueToLabel(this.educationalOption, v.educationalBackground);
            });
            this.staffTableContent = value.data.contents;
            this. setTableOption(value.data.contents);
            this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
          }
        );
  }

  public  selectData(e): void {
    this.staffSelect = e;
  }
  // set table data （设置列表数据）
  public  setTableOption(data1): void {
    this.optionTable = {
      width: '101.4%',
      header: {
        data: [
          {field: 'username', header: '用户名'},
          {field: 'realName', header: '员工姓名'},
          {field: 'sex', header: '性别'},
          {field: 'mobilePhone', header: '手机号码'},
          // {field: 'organizationName', header: '组织/机构名称'},
          {field: 'departmentName', header: '部门名称'},
          {field: 'enabled', header: '可用状态'},
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
  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '收费项目') {
        this.globalSrv.getChildrenRouter({parentCode: v.parentCode}).subscribe(value => {
          console.log(value);
          value.data.forEach(v => {
            this.btnHiden.forEach( val => {
              if (v.title === val.label) {
                val.hidden = false;
              }
            });
          });
        });
      }
    });
  }
}
