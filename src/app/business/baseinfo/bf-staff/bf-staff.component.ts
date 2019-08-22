import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AddStaff, DepartTree, ModifyStaff, Staff} from '../../../common/model/bf-staff.model';
import {BfStaffService} from '../../../common/services/bf-staff.service';
import {TreeNode} from '../../../common/model/shared-model';
import {DatePipe} from '@angular/common';
import {last} from 'rxjs/operators';
import {PublicMethedService} from '../../../common/public/public-methed.service';

@Component({
  selector: 'rbi-bf-staff',
  templateUrl: './bf-staff.component.html',
  styleUrls: ['./bf-staff.component.less']
})
export class BfStaffComponent implements OnInit {
  
  public staffTableTitle: any;
  public staffTableContent: Staff[];
  public staffTableTitleStyle: any;
  public staffSelect: any;
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
  constructor(
    private staffSrv: BfStaffService,
    private toolSrv: PublicMethedService,
    private datePipe: DatePipe,
  ) { }
  ngOnInit() {
    this.staffInitialization();
  }

  // initialization staff
  public  staffInitialization(): void {
    this.staffTableTitle = [
      {field: 'username', header: '用户名'},
      {field: 'realName', header: '员工姓名'},
      {field: 'sex', header: '性别'},
      {field: 'mobilePhone', header: '手机号码'},
      // {field: 'organizationName', header: '组织/机构名称'},
      {field: 'departmentName', header: '部门名称'},
      {field: 'enabled', header: '可用状态'},
      {field: 'operating', header: '操作'},
    ];
    this.esDate = this.toolSrv.esDate;
    this.loadHidden = false;
    this.toolSrv.getAdminStatus('ENABLED', (data) => {
      if (data.length > 0 ) {
        this.staffSrv.queryStaffInfoPage({pageNo: this.nowPage, pageSize: 10 }).subscribe(
          value => {
            this.loadHidden = true;
            value.data.contents.forEach( v => {
              v.enabled = this.setDataName(data, v.enabled);
            });
            this.staffTableContent = value.data.contents;
            this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
          }
        );
      }
    });
    this.staffTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
  }
  // condition search click
  public  staffSearchClick(): void {
    // @ts-ignore
  }
  // add staff
  public  staffAddClick(): void {
    this.getDownLoadData('', '', '', '', '');
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
      this.getDownLoadData(this.staffModifay.enabled, this.staffModifay.loginStatus, this.staffModifay.educationalBackground, this.staffModifay.politicalStatus, this.staffModifay.maritalStatus);
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
  // select staff
  public  staffonRowSelect(e): void {
    this.staffModifay = e.data;
  }
  // see staffinfo detail
  public  staffDetailClick(e): void {
      // console.log(e);
    this.staffDetail = e;
    this.getDownLoadData(e.enabled, e.loginStatus, e.educationalBackground, e.politicalStatus, e.maritalStatus);
    this.staffDetailDialog = true;
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
  // get DownLoad data
  public  getDownLoadData(enable, loginStatus, educational, political, marital): void {
    this.toolSrv.getAdminStatus('ENABLED', (data) => {
      if (data.length > 0 ) {
        this.toolSrv.setDataFormat(data, enable, (list, label) => {
          this.enableOption = list;
          this.enableModifyDrapPlaceholder = label;
        });
      }
    });
    this.toolSrv.getAdminStatus('LOGIN_STATUS', (data) => {
      if (data.length > 0 ) {
        this.toolSrv.setDataFormat(data, loginStatus, (list, label) => {
          this.loginStatusOption = list;
          this.loginStatusModifyDrapPlaceholder = label;
        });
      }
    });
    this.toolSrv.getAdminStatus('EDUCATIONAL_BACKGROUND', (data) => {
      if (data.length > 0 ) {
        this.toolSrv.setDataFormat(data, educational, (list, label) => {
          this.educationalOption = list;
          this.educationalModifyDrapPlaceholder = label;
        });
      }
    });
    this.toolSrv.getAdminStatus('POLITICAL_STATUS', (data) => {
      if (data.length > 0 ) {
        this.toolSrv.setDataFormat(data, political, (list, label) => {
          this.politicalStatusOption = list;
          this.politicalStatusModifyDrapPlaceholder = label;
        });
      }
    });
    this.toolSrv.getAdminStatus('MARITAL_STATUS', (data) => {
      if (data.length > 0 ) {
        this.toolSrv.setDataFormat(data, marital, (list, label) => {
          this.maritalOption = list;
          this.maritalModifyDrapPlaceholder = label;
        });
      }
    });
  }
  // paging query
  public  nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.staffSrv.queryStaffInfoPage({pageNo: this.nowPage, pageSize: 10 }).subscribe(
      value => {
        this.loadHidden = true;
        this.staffTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
    this.staffTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
  }
  public  setDataName(option , label): any {
    option.forEach( v => {
      if ( label.toString()  === v.settingCode) {
        label = v.settingName;
      }
    });
    return label;
  }
}
