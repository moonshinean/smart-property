import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, Dropdown, MessageService} from 'primeng/primeng';

import {GlobalService} from '../../../common/services/global.service';
import {SetPermissionService} from '../../../common/services/set-permission.service';
import {AddSetPermission, ModifySetPermission, PermitDTO, SetPermission} from '../../../common/model/set-peimission.model';
import {TreeNode} from '../../../common/model/shared-model';
import {PublicMethedService} from '../../../common/public/public-methed.service';

@Component({
  selector: 'rbi-set-permission',
  templateUrl: './set-permission.component.html',
  styleUrls: ['./set-permission.component.less']
})
export class SetPermissionComponent implements OnInit {
  public permissionOption: any;
  public permissionTableContent = [];
  public permissionSelect: SetPermission[];
  // 添加相关
  public permissionAddDialog: boolean;
  public permissionAdd: AddSetPermission = new AddSetPermission();
  public RoleCodeList: any[] = [];
  public primitTree: PermitDTO[]; // 权限树
  public primitTreeSelect: PermitDTO[]; // 权限树
  public RoleCode: any;
  public primitDatas: any[]= [];
  public primitData: any[] = [];
  public primitDatasList: any[] = [];

  // 删除相关
  public ids: any[] = [];
  // 其他相关
  public option: any;
  public setlimitCodeOption: any[] = [];
  public loadHidden = true;
  public pageNo = 1;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private permissionSrv: SetPermissionService,
    private toolSrv: PublicMethedService
  ) { }
  ngOnInit() {
    this.permissionInitialization();
  }

  // Initialize permission data
  public  permissionInitialization(): void {
    this.loadHidden = false;
    this.queryPrimissionPageData();
  }
  // show add permission dialog
  public  permissionConfigClick(): void {
    this.primitTree = [];
    this.RoleCodeList = [];
    this.permissionSrv.queryRoleCodeCodeList({}).subscribe(
      (value) => {
        value.data.forEach( v => {
          this.RoleCodeList.push({label: v.roleName, value: v.roleCode});
        });
        // console.log(this.RoleCodeList);
        this.permissionAddDialog = true;
      }
    );
    this.permissionSrv.queryPerimitList({}).subscribe(
      (value) => {
        if (value.status === '1000') {
          this.primitTree = this.initializeTree(value.data);
        } else {
          this.toolSrv.setToast('error', '请求失败', value.message);
        }

      }
    );
    // this.permissionAddDialog = true;
  }
  // sure add permission
  public  permissionAddSureClick(): void {
    // console.log(this.primitDatas);
    if (this.primitDatas.length > 0) {
      this.primitData = [];
      this.toolSrv.setConfirmation('增加', '增加', () => {
        if (this.permissionTableContent.length <= this.primitDatas.length) {
          if (this.permissionTableContent.length === 0) {
              this.primitDatas.forEach(v => {
                this.primitData.push(v.value);
            });
          } else {
            this.permissionTableContent.forEach(val => {
              this.primitDatas.forEach((v, index) => {
                if (v.value === val.permisCode) {
                  this.primitDatas.splice(index, 1);
                }
              });
            });
            this.primitDatas.forEach( v => {
              this.primitData.push(v.value);
            });
          }
          if (this.primitData.length > 0) {
            this.loadHidden = false;
            this.permissionSrv.addRolePerimit({roleCode: this.RoleCode, permisCodes: this.primitData.join(',')}).subscribe(
              (data) => {
                this.loadHidden = true;
                if (data.status === '1000') {
                  this.toolSrv.setToast('success', '操作成功', data.message);
                  this.permissionAddDialog = false;
                  this.permissionInitialization();
                  this.initializationData();
                } else {
                  this.toolSrv.setToast('error', '操作失败', data.message);
                }
              }
            );
          }
        } else {
          const list = this.permissionTableContent;
          this.primitDatas.forEach( v => {
                 list.forEach( (val, index) => {
                 if (v.value === val.permisCode) {
                   list.splice(index, 1);
                 }
             });
          });
          list.forEach(v => {
            this.ids.push(v.id);
          });
          if (this.ids.length > 0) {
            this.permissionSrv.deleteRolePerimit({ids: this.ids.join(',')}).subscribe(
              (value) => {
                if (value.status === '1000') {
                  this.permissionInitialization();
                  this.toolSrv.setToast('success', '操作成功', '删除成功');
                  this.permissionAddDialog = false;
                  this.permissionSelect = [];
                } else {
                  this.toolSrv.setToast('error', '操作失败', value.message);
                }
              }
            );
          }
        }
      });
    } else {
      this.toolSrv.setToast('error' , '操作错误', '未选择数据');

    }
  }
  // close  add permission dialog
  public permissionAddCloseClick(): void {
    this.initializationData();
    this.permissionAddDialog = false;
    this.RoleCodeList = [];
    this.permissionInitialization();
  }
  // delete permission
  public  permissionDeleteClick(): void {
    if (this.permissionSelect === undefined || this.permissionSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.toolSrv.setConfirmation('删除', `删除这${this.permissionSelect.length}项`, () => {
        this.permissionSelect.forEach( v => {
          this.ids.push(v.id);
        });
        this.permissionSrv.deleteRolePerimit({ids: this.ids.join(',')}).subscribe(
          (value) => {
            if (value.status === '1000') {
              this.permissionInitialization();
              this.toolSrv.setToast('success', '操作成功', '删除成功');
              this.permissionSelect = [];
            } else {
              this.toolSrv.setToast('error', '操作失败', value.message);
            }
          }
        );
      });
    }
  }
  // Privilege name selection
  public  setRoleNameChange(e): void {
    this.RoleCode = e.value;
    this.primitDatasList = [];
    this.permissionSrv.queryRolePermit({roleCode: e.value}).subscribe(
      (value) => {
        value.data.forEach( v => {
          this.primitDatasList.push(v.permisCode);
        });
        this.checkNode(this.primitTree, this.primitDatasList);
      }
    );
  }
  // initialization data
  public initializationData(): void {
    this.permissionSelect = [];
    this.permissionAdd = new AddSetPermission();
    this.setlimitCodeOption = [];
    this.primitDatas = [];
    this.RoleCode = '';
  }
  // paging query
  public  nowpageEventHandle(event: any): void {
    this.permissionSrv.queryPermissionData({pageNo: event, pageSize: 10}).subscribe(
      (value) => {
        this.permissionTableContent = value.data.contents;
        this.setTableOption(value.data.contents);
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
    this.permissionSelect = [];
  }
  // Initialize tree structure data
  public initializeTree(data): any {
    // console.log(oneChild);
    const oneChild = [];
    for (let i = 0; i < data.length; i++) {
      const childnode = new TreeNode();
      childnode.value = data[i].permisCode;
      childnode.id = data[i].id;
      childnode.label = data[i].title;
      childnode.check = false;
      childnode.parentCode = data[i].parentCode;
      if (data[i].permitDTO != null && data[i].permitDTO.length !== 0 ) {
        childnode.children = this.initializeTree(data[i].permitDTO);
      } else {
        childnode.children = [];
      }
      oneChild.push(childnode);
    }
    return oneChild;
  }

  public  checkNode(nodes: TreeNode[], str: any[]): any {
    for (let i = 0 ; i < nodes.length ; i++) {
      if (!nodes[i].check) {
        for (let j = 0 ; j < nodes[i].children.length ; j++) {
          if (str.includes(nodes[i].children[j].value)) {
            if (!this.primitDatas.includes(nodes[i].children[j])) {
              this.primitDatas.push(nodes[i].children[j]);
            }
          }
        }
      }
      if (nodes[i].check) {
        return;
      }
      this.checkNode(nodes[i].children, str);
      const count = nodes[i].children.length;
      let c = 0;
      for (let j = 0 ; j < nodes[i].children.length ; j++) {
        if (this.primitDatas.includes(nodes[i].children[j])) {
          c++;
        }
        if (nodes[i].children[j].partialSelected) { nodes[i].partialSelected = true; }
      }
      if (c === 0) {} else if (c === count) {
        nodes[i].partialSelected = false;
        if (!this.primitDatas.includes(nodes[i])) {
          this.primitDatas.push(nodes[i]);
        }
      } else {
        nodes[i].partialSelected = true;
      }
    }
  }

  public  queryPrimissionPageData(): void {
    this.permissionSrv.queryPermissionData({pageNo: this.pageNo, pageSize: 10}).subscribe(
      (value) => {
        console.log(value);
        if (value.status === '1000') {
          this.loadHidden = true;
          this.permissionTableContent = value.data.contents;
          this.setTableOption(value.data.contents);
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        } else {
          this.toolSrv.setToast('error', '查询错误', value.message);
        }

      }
    );
  }
  // 设置表格
  public  setTableOption(data1): void {
    this.permissionOption = {
      width: '101.4%',
      header: {
        data:   [
          {field: 'roleName', header: '角色名称'},
          {field: 'title', header: '权限名称'},
        ],
        style: {background: '#282A31', color: '#DEDEDE', height: '6vh'}
      },
      Content: {
        data: data1,
        styleone: {background: '#33353C', color: '#DEDEDE', textAlign: 'center', height: '2vw'},
        styletwo: {background: '#2E3037', color: '#DEDEDE', textAlign: 'center', height: '2vw'},
      },
      type: 1,
      tableList:  []
    };
  }

  public  selectData(e): void {
    this.permissionSelect = e;
  }
}
