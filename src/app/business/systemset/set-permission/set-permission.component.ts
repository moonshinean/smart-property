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
  public permissionTableTitle: any;
  public permissionTableContent: SetPermission[];
  public permissionTableTitleStyle: any;
  public permissionSelect: SetPermission[];
  // 添加相关
  public permissionAddDialog: boolean;
  public permissionAdd: AddSetPermission = new AddSetPermission();
  public RoleCodeList: any[] = [];
  public primitTree: PermitDTO[]; // 权限树
  public primitTreeSelect: PermitDTO[]; // 权限树
  public RoleCode: any;
  public primitDatas: any[] = [];
  public primitData: any[] = [];

  // 删除相关
  public ids: any[] = [];
  // 其他相关
  public option: any;
  public setlimitCodeOption: any[] = [];
  public loadHidden = true;
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
    this.permissionTableTitle = [
      {field: 'roleCode', header: '角色编码'},
      {field: 'roleName', header: '角色名称'},
      {field: 'permisCode', header: '权限代码'},
      {field: 'title', header: '权限名称'},
      // {field: 'remark', header: '备注'},
    ];
    this.permissionSrv.queryPermissionData({pageNo: 1, pageSize: 10}).subscribe(
      (value) => {
        this.loadHidden = true;
        this.permissionTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
    this.permissionTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};

  }
  // // condition search click
  // public  permissionSearchClick(): void {
  //   // @ts-ignore
  //   console.log(this.input.nativeElement.value);
  //   console.log('这里是条件搜索');
  // }
  // show add permission dialog
  public  permissionConfigClick(): void {
    this.primitTree = [];
    this.RoleCodeList = [];
    this.loadHidden = false;
    this.permissionSrv.queryRoleCodeCodeList({}).subscribe(
      (value) => {
        // console.log(value);
        value.data.forEach( v => {
          this.RoleCodeList.push({label: v.roleName, value: v.roleCode});
        });
        // console.log(this.RoleCodeList);
        this.permissionAddDialog = true;
      }
    );
    this.permissionSrv.queryPerimitList({}).subscribe(
      (value) => {
        this.loadHidden = true;
        this.primitTree = this.initializeTree(value.data);
      }
    );
  }
  // sure add permission
  public  permissionAddSureClick(): void {
    if (this.RoleCode !== undefined && this.primitDatas !== []) {
      const flag = [];
      this.primitData.forEach(v => {
        this.primitDatas.forEach( item => {
          if (v === item) {
            flag.push(v);
            this.primitDatas.splice( this.primitDatas.indexOf(item), 1);
          }
        });
      });

      flag.forEach(item => {
        this.primitData.forEach( v => {
          if (v === item) {
            this.primitData.splice(this.primitData.indexOf(v), 1);
          }
        });
      });
      this.toolSrv.setConfirmation('增加', '增加', () => {
        if (this.primitDatas.length >= 1) {
          this.loadHidden = false;
          this.permissionSrv.addRolePerimit({roleCode: this.RoleCode, permisCodes: this.primitDatas.join(',')}).subscribe(
            (data) => {
              this.loadHidden = true;
              this.toolSrv.setToast('success', '操作成功', data.message);
              this.permissionAddDialog = false;
              this.permissionInitialization();
              this.initializationData();
            }
          );
        }
        if (this.primitData.length >= 1) {
          this.loadHidden = false;
          this.permissionTableContent.forEach( v => {
            this.primitData.forEach(item => {
              if (v.roleCode === this.RoleCode && v.permisCode === item) {
                this.ids.push(v.id);
              }
            });
          });
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
    this.permissionSrv.queryPerimitList({}).subscribe(
      (value) => {
        this.primitTree = this.initializeTree(value.data);
        this.loadHidden = true;
      }
    );
    this.permissionSrv.queryRolePermit({roleCode: e.value}).subscribe(
      (value) => {
        this.primitDatas = [];
        value.data.forEach( v => {
          this.primitDatas.push(v.permisCode);
          this.primitData = this.primitDatas;
        });
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
  // get  selected data
  public  getCheckBox(e, fa): void {
      let flagfa = true;
      this.primitDatas.forEach(v => {
        if (v === fa) {
          flagfa = false;
        }
      });
      if (flagfa) {
        this.primitDatas.push(fa);
      }
  }
  // paging query
  public  nowpageEventHandle(event: any): void {
    this.permissionSrv.queryPermissionData({pageNo: event, pageSize: 10}).subscribe(
      (value) => {
        this.permissionTableContent = value.data.contents;
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
}
