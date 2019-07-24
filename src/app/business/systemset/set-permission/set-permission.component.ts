import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, Dropdown, MessageService} from 'primeng/primeng';

import {GlobalService} from '../../../common/services/global.service';
import {SetPermissionService} from '../../../common/services/set-permission.service';
import {AddSetPermission, ModifySetPermission, PermitDTO, SetPermission} from '../../../common/model/set-peimission.model';
import {TreeNode} from '../../../common/model/shared-model';

@Component({
  selector: 'rbi-set-permission',
  templateUrl: './set-permission.component.html',
  styleUrls: ['./set-permission.component.less']
})
export class SetPermissionComponent implements OnInit {
  // @ViewChild('addSetType') addSetType: Dropdown;
  @ViewChild('input') input: Input;
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
  public cleanTimer: any; // 清除时钟
  public option: any;
  public setlimitCodeOption: any[] = [];
  public loadHidden = true;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    // private permissionService: setpermissionService,
    private permissionSrv: SetPermissionService,
    private globalService: GlobalService
  ) { }
  ngOnInit() {
    this.permissionInitialization();
  }

  // initialization permission
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
        // console.log(this.permissionTableContent);
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        // console.log(123);
      }
    );
    this.permissionTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};

  }
  // condition search click
  public  permissionSearchClick(): void {
    // @ts-ignore
    console.log(this.input.nativeElement.value);
    console.log('这里是条件搜索');
  }
  // add  permission
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
        console.log(value.data);
        this.loadHidden = true;

        // this.primitTree = value.data;
        this.primitTree = this.initializeTree(value.data);
        console.log(this.primitTree);

        // value.data.forEach( v => {
        //   this.primitList.push({label: v.title, value:  v.permisCode});
        // });
      }
    );
  }
  // sure add permission
  public  permissionAddSureClick(): void {
    if (this.RoleCode !== undefined && this.primitDatas !== []) {
      const flag = [];
      console.log(this.RoleCode);
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
      console.log(this.primitDatas);
      console.log(this.primitData);
      this.confirmationService.confirm({
        message: `确认要增加吗？`,
        header: '增加提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {

          console.log(this.primitDatas);
          if (this.primitDatas.length >= 1) {
              this.loadHidden = false;
              this.permissionSrv.addRolePerimit({roleCode: this.RoleCode, permisCodes: this.primitDatas.join(',')}).subscribe(
                (data) => {
                  console.log(data);
                  this.loadHidden = true;
                  this.setToast('success', '操作成功', data.message);
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
                console.log(value);
                if (value.status === '1000') {
                  this.permissionInitialization();
                  this.setToast('success', '操作成功', '删除成功');
                  this.permissionAddDialog = false;
                  this.permissionSelect = [];
                } else {
                  this.setToast('error', '操作失败', value.message);
                }
              }
            );
          }
        },
        reject: () => {
          // console.log('这里是增加信息');
        }
      });
    } else {
      this.setToast('error' , '操作错误', '未选择数据');

    }
  }
  // close add permission
  public permissionAddCloseClick(): void {
    this.initializationData();
    this.permissionAddDialog = false;
    this.RoleCodeList = [];
    this.permissionInitialization();
  }

  // delete permission
  public  permissionDeleteClick(): void {
    if (this.permissionSelect === undefined || this.permissionSelect.length === 0) {
      this.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.confirmationService.confirm({
        message: `确认要删除这${this.permissionSelect.length}项吗`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.permissionSelect.forEach( v => {
            this.ids.push(v.id);
          });
          console.log({ids: this.ids.join(',')});
          this.permissionSrv.deleteRolePerimit({ids: this.ids.join(',')}).subscribe(
            (value) => {
              console.log(value);
              if (value.status === '1000') {
                  this.permissionInitialization();
                  this.setToast('success', '操作成功', '删除成功');
                  // this.permissionModifyDialog = false;
                  this.permissionSelect = [];
                } else {
                  this.setToast('error', '操作失败', value.message);
              }
            }
          );
        },
        reject: () => {
          // this.permissionSelect = [];
          // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
        }
      });
    }
  }
  public  setRoleNameChange(e): void {
    this.RoleCode = e.value;
    this.permissionSrv.queryPerimitList({}).subscribe(
      (value) => {
        this.primitTree = this.initializeTree(value.data);
        console.log(this.primitTree);
        this.loadHidden = true;
      }
    );
    this.permissionSrv.queryRolePermit({roleCode: e.value}).subscribe(
      (value) => {
        this.primitDatas = [];
        console.log(value);
        value.data.forEach( v => {
          this.primitDatas.push(v.permisCode);
          this.primitData = this.primitDatas;
        });
      }
    );
    // this.permissionSrv.
  }

  // initialization data
  public initializationData(): void {
    // this.ids = [];
    this.permissionSelect = [];
    this.permissionAdd = new AddSetPermission();
    // console.log(this.addSetType.value);
    this.setlimitCodeOption = [];
    this.primitDatas = [];
    this.RoleCode = '';
  }
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
  public  nowpageEventHandle(event: any): void {
    console.log(event);
    this.permissionSrv.queryPermissionData({pageNo: event, pageSize: 10}).subscribe(
      (value) => {
        console.log(value);
        this.permissionTableContent = value.data.contents;
        // console.log(this.permissionTableContent);
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        // console.log(123);
      }
    );
    this.permissionSelect = [];
  }
  // Toast
  public  setToast(type, title, message): void {
    if (this.cleanTimer) {
      clearTimeout(this.cleanTimer);
    }
    this.messageService.clear();
    this.messageService.add({severity: type, summary: title, detail: message});
    this.cleanTimer = setTimeout(() => {
      this.messageService.clear();
    }, 3000);
  }

  public initializeTree(data): any {
    // console.log(oneChild);
    const oneChild = [];
    for (let i = 0; i < data.length; i++) {
      const childnode = new TreeNode();
      childnode.value = data[i].permisCode;
      childnode.id = data[i].id;
      childnode.label = data[i].title;
      childnode.parentCode = data[i].parentCode;
      // childnode.children = data[i].permitDTO;
      if (data[i].permitDTO != null && data[i].permitDTO.length !== 0 ) {
        childnode.children = this.initializeTree(data[i].permitDTO);
      } else {
        childnode.children = [];
      }
      oneChild.push(childnode);
      // console.log(childnode);
    }
    return oneChild;
  }
}
