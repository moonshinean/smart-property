import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {GlobalService} from '../../../common/services/global.service';
import {AddSetRole, ModifySetRole, SetRole} from '../../../common/model/set-role.model';
import {SetRoleService} from '../../../common/services/set-role.service';
import {isObjectFlagSet} from 'tslint';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {Subscription} from 'rxjs';
import {ThemeService} from '../../../common/public/theme.service';
import {LocalStorageService} from '../../../common/services/local-storage.service';

@Component({
  selector: 'rbi-set-role',
  templateUrl: './set-role.component.html',
  styleUrls: ['./set-role.component.less']
})
export class SetRoleComponent implements OnInit, OnDestroy {

  public roleTableContent: any;
  public roleSelect: SetRole[];
  public roleOption: any;
  // 添加相关
  public roleAddDialog: boolean;
  public roleAdd: AddSetRole = new AddSetRole();
  public RoleCodeList: any[] = [];
  public primitList: any[] = [];
  public userCode: any;
  public roleDatas: any[] = [];
  public roleData: any[] = [];

  // 删除相关
  public ids: any[] = [];
  // 其他相关
  public option: any;
  public setlimitCodeOption: any[] = [];
  public loadHidden = true;
  public pageNo = 1;

  public themeSub: Subscription;
  public table = {
    tableheader: {background: '', color: ''},
    tableContent: [
      {background: '', color: ''},
      {background: '', color: ''}],
    detailBtn: ''
  };
  // 按钮权限相关
  public btnHiden = [
    {label: '配置', hidden: true},
    {label: '删除', hidden: true},
  ];
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private roleSrv: SetRoleService,
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
        this.setTableOption(this.roleTableContent);
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
    this.roleInitialization();
  }
  ngOnDestroy(): void {
    this.themeSub.unsubscribe();
  }
  // initialization role
  public  roleInitialization(): void {
    this.loadHidden = false;
    this.queryRolePageData();
  }
  // // condition search click
  // public  roleSearchClick(): void {
  //   // @ts-ignore
  //   console.log(this.input.nativeElement.value);
  //   console.log('这里是条件搜索');
  // }
  // showe add  role dialog
  public  roleConfigClick(): void {
    this.primitList = [];
    this.RoleCodeList = [];
    this.loadHidden = false;
    this.roleSrv.queryUserInfo({}).subscribe(
      (value) => {
        this.loadHidden = true;
        value.data.forEach( v => {
          this.RoleCodeList.push({label: v.realName, value: v.userId});
        });
        this.roleAddDialog = true;
      }
    );
    this.roleSrv.queryRoleInfo({}).subscribe(
      (value) => {
        value.data.forEach( v => {
          this.primitList.push({label: v.roleName, value:  v.roleCode});
        });
        this.loadHidden = true;

      }
    );
  }
  // add role quest
  public  roleAddSureClick(): void {
    const flag = [];
    if (this.userCode !== undefined && this.roleDatas !== []) {
      this.toolSrv.setConfirmation('增加', '增加', () => {
        this.roleData.forEach(v => {
          this.roleDatas.forEach( item => {
            if (v === item) {
              flag.push(v);
              this.roleDatas.splice( this.roleDatas.indexOf(item), 1);
            }
          });
        });

        flag.forEach(item => {
          this.roleData.forEach( v => {
            if (v === item) {
              this.roleData.splice(this.roleData.indexOf(v), 1);
            }
          });
        });
        console.log(this.roleDatas.length);
        if (this.roleDatas.length >= 1) {
          this.roleSrv.addUserRole({userId: this.userCode , roleCodes: this.roleDatas.join(',')}).subscribe(
            (value ) => {
              if (value.status === '1000') {
                this.toolSrv.setToast('success', '操作成功', '新增成功');
                this.roleAddDialog = false;
                this.roleInitialization();
                this.initializationData();
              } else  {
                this.toolSrv.setToast('error', '新增失败', value.message);
              }
            }
          );
        } else {
          this.toolSrv.setToast('error', '操作失败', '没有改变权限');
        }
        if (this.roleData.length >= 1) {
          this.loadHidden = false;
          this.roleTableContent.forEach(v => {
            this.roleData.forEach(item => {
              if (this.userCode === v.userId) {
                if (v.roleCode === item) {
                  this.ids.push(v.id);
                }
              }
            });
          });
          this.roleSrv.deleteUserInfo({ids: this.ids.join(',')}).subscribe(
            (value) => {
              if (value.status === '1000') {
                this.roleInitialization();
                this.toolSrv.setToast('success', '操作成功', '删除成功');
                this.roleAddDialog = false;

                this.roleSelect = [];
              } else {
                this.toolSrv.setToast('error', '操作失败', value.message);
              }
            }
          );
        }else {
          this.toolSrv.setToast('error', '操作失败', '没有改变权限');
        }
      });
    } else {
      this.toolSrv.setToast('error' , '操作错误', '未选择数据');
    }
  }
  // close add role dialog
  public roleAddCloseClick(): void {
    this.initializationData();
    this.roleAddDialog = false;
    this.RoleCodeList = [];
    this.roleInitialization();
  }
  // delete role data
  public  roleDeleteClick(): void {
    if (this.roleSelect === undefined || this.roleSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.toolSrv.setConfirmation('删除', `删除这${this.roleSelect.length}项`, () => {
        this.roleSelect.forEach(v => {
          this.ids.push(v.id);
        });
        this.roleSrv.deleteUserInfo({ids: this.ids.join(',')}).subscribe(
          (value) => {
            if (value.status === '1000') {
              this.roleInitialization();
              this.toolSrv.setToast('success', '操作成功', '删除成功');
              // this.roleModifyDialog = false;
              this.roleSelect = [];
            } else {
              this.toolSrv.setToast('error', '操作失败', value.message);
            }
          }
        );
      });
    }
  }
  // Select user type
  public  setUserTypeChange(e): void {
    this.userCode = e.value;
    this.roleSrv.queryRoleInfo({}).subscribe(
      (value) => {
        this.primitList = [];
        value.data.forEach( v => {
          this.primitList.push({label: v.roleName, value:  v.roleCode});
        });
        this.loadHidden = true;

      }
    );
    this.roleSrv.queryUserRole({userId: e.value}).subscribe(
      (value) => {
        this.roleDatas = [];
        value.data.forEach( v => {
          this.roleDatas.push(v.roleCode);
          this.roleData = this.roleDatas;
        });
      }
    );
  }
  // initialization data
  public initializationData(): void {
    this.roleSelect = [];
    this.roleAdd = new AddSetRole();
    this.setlimitCodeOption = [];
    this.roleDatas = [];
    this.userCode = '';
  }
  // paging query
  public  nowpageEventHandle(event: any): void {
    this.pageNo = event;
    this.queryRolePageData();
    this.roleSelect = [];
  }

  // 设置表格
  public  setTableOption(data1): void {
    this.roleOption = {
      width: '101.4%',
      header: {
        data:   [
          {field: 'userId', header: '用户ID'},
          {field: 'username', header: '用户名称'},
          {field: 'realName', header: '真实姓名'},
          {field: 'roleCode', header: '角色编码'},
          {field: 'roleName', header: '角色名称'},
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
    this.roleSelect = e;
  }

  public  queryRolePageData(): void {
    this.roleSrv.queryRoleList({pageNo: this.pageNo, pageSize: 10}).subscribe(
      (value) => {
        this.loadHidden = true;
        this.roleTableContent = value.data.contents;
        this.setTableOption(value.data.contents);
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
  }
  // 设置按钮显示权限
  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '用户角色配置') {
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
