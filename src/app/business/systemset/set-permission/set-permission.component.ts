import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, Dropdown, MessageService} from 'primeng/primeng';

import {GlobalService} from '../../../common/services/global.service';
import {SetPermissionService} from '../../../common/services/set-permission.service';
import {AddSetPermission, ModifySetPermission, PermitDTO, SetPermission} from '../../../common/model/set-peimission.model';
import {TreeNode} from '../../../common/model/shared-model';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {Subscription} from 'rxjs';
import {ThemeService} from '../../../common/public/theme.service';
import {LocalStorageService} from '../../../common/services/local-storage.service';

@Component({
  selector: 'rbi-set-permission',
  templateUrl: './set-permission.component.html',
  styleUrls: ['./set-permission.component.less']
})
export class SetPermissionComponent implements OnInit, OnDestroy {
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
  public primitDatas: any[] = [];
  public primitData: any[] = [];
  public primitDataList: any[] = [];
  public primitDeleteList: any[] = [];
  public primitDatasList: any[] = [];

  // 角色的权限列表
  public primitRoleList: any[] = [];

  // 删除相关
  public ids: any[] = [];

  // 按钮权限相关
  public btnHiden = [
    {label: '配置', hidden: true},
    {label: '删除', hidden: true},
  ];
  // 其他相关
  public option: any;
  public setlimitCodeOption: any[] = [];
  public pageNo = 1;

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
    private permissionSrv: SetPermissionService,
    private toolSrv: PublicMethedService,
    private globalSrv: GlobalService,
    private localSrv: LocalStorageService,
    private themeSrv: ThemeService
  ) {
    this.themeSub = this.themeSrv.changeEmitted$.subscribe(
      value => {
        this.table.tableheader = value.table.header;
        this.table.tableContent = value.table.content;
        this.table.detailBtn = value.table.detailBtn;
        this.setTableOption(this.permissionTableContent);
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
    this.permissionInitialization();
  }
  ngOnDestroy(): void {
    this.themeSub.unsubscribe();
  }

  // Initialize permission data
  public  permissionInitialization(): void {
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
        console.log(this.RoleCodeList);
        this.permissionAddDialog = true;
      }
    );
    this.permissionSrv.queryPerimitList({}).subscribe(
      (value) => {
        if (value.status === '1000') {
          console.log(value.data);
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
    this.primitDeleteList = [];
    this.primitDataList = [];
    if (this.primitDatas.length > 0) {
      this.toolSrv.setConfirmation('修改', '修改', () => {
        this.primitDataList = this.primitDatas.filter( v => {
          return this.primitData.indexOf(v) === -1;
        });
        const primitList = [];
        this.primitDataList.forEach(v => {
          primitList.push(v.value);
        });
        this.permissionSrv.addRolePerimit({roleCode: this.RoleCode, permisCodes: primitList.join(',')}).subscribe(
          (data) => {
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
        this.primitDeleteList = this.primitData.filter(v => {
          return this.primitDatas.indexOf(v) === -1;
        });
        this.primitDeleteList.forEach( (item, index) => {
          if (item.label === '总平台' || item.label === '物业管理智慧策略系统') {
            this.primitDeleteList.splice(index, 1);
          }
        });
        this.primitDeleteList.forEach( val => {
          this.primitRoleList.forEach( v => {
            if ( v.label  === val.label && val.value === v.permisCode) {
              // console.log(v);
              // console.log(val);
              this.ids.push({roleCode: v.roleCode, permisCode: v.permisCode});
            }

          });
        });
        // console.log(this.primitDeleteList);
        // console.log(this.primitRoleList);
        // console.log(this.ids);
        // this.permissionSrv.deleteRolePerimit({roleAndPermitCodes: this.ids}).subscribe(
        //   (value) => {
        //     if (value.status === '1000') {
        //       this.permissionInitialization();
        //       this.toolSrv.setToast('success', '操作成功', '删除成功');
        //       this.permissionAddDialog = false;
        //       this.permissionSelect = [];
        //     } else {
        //       this.toolSrv.setToast('error', '操作失败', value.message);
        //     }
        //   }
        // );
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
          this.ids.push({roleCode: v.roleCode, permisCode: v.permisCode});
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
    this.primitDatas = [];
    this.primitData = [];
    this.primitRoleList = [];
    this.permissionSrv.queryRolePermit({roleCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach( v => {
          this.primitDatasList.push(v.permisCode);
          this.primitRoleList.push({label: v.title, roleCode: v.roleCode, permisCode: v.permisCode});
        });
        this.checkNode(this.primitTree, this.primitDatasList);
        this.primitData = this.primitDatas.map(v => {
          return v;
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
      childnode.roleCode = data[i].roleCode;
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
        if (value.status === '1000') {
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
        style: {background: this.table.tableheader.background, color: this.table.tableheader.color, height: '6vh'}
      },
      Content: {
        data: data1,
        styleone: {background: this.table.tableContent[0].background, color: this.table.tableContent[0].color, textAlign: 'center', height: '2vw'},
        styletwo: {background: this.table.tableContent[1].background, color: this.table.tableContent[1].color, textAlign: 'center', height: '2vw'},
      },
      type: 1,
      tableList:  []
    };
  }

  public  selectData(e): void {
    this.permissionSelect = e;
  }
  // 设置按钮显示权限
  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '角色权限配置') {
        this.globalSrv.getChildrenRouter({parentCode: v.parentCode}).subscribe(value => {
          console.log(value);
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
}
