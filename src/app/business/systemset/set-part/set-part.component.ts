import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfirmationService, MessageService} from 'primeng/api';
import {GlobalService} from '../../../common/services/global.service';
import {AddSetPart, ModifySetPart, SetPart} from '../../../common/model/set-part.model';
import {SetPartService} from '../../../common/services/set-part.service';

@Component({
  selector: 'rbi-set-part',
  templateUrl: './set-part.component.html',
  styleUrls: ['./set-part.component.less']
})
export class SetPartComponent implements OnInit {


  // @ViewChild('addSetType') addSetType: Dropdown;
  @ViewChild('input') input: Input;
  public partTableTitle: any;
  public partTableContent: SetPart[];
  public partTableTitleStyle: any;
  public partSelect: SetPart[];
  // 添加相关
  public partAddDialog: boolean;
  public partAdd: AddSetPart = new AddSetPart();
  // public partCodeList: any[] = [];
  // public primitList: any[] = [];
  // public userCode: any;
  // public partDatas: any[] = [];
  // 修改相关
  public partModifyDialog: boolean;
  public partModify: ModifySetPart = new ModifySetPart();
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
    // private partService: setpartService,
    private partSrv: SetPartService,
    private globalService: GlobalService
  ) { }
  ngOnInit() {
    this.partInitialization();
  }

  // initialization part
  public  partInitialization(): void {
    this.loadHidden = false;
    this.partTableTitle = [
      {field: 'id', header: 'id'},
      {field: 'roleCode', header: '权限编号'},
      {field: 'roleName', header: '权限名称'},
      {field: 'remark', header: '备注'},
      // {field: 'partName', header: '角色名称'},
      // {field: 'remark', header: '备注'},
    ];
    this.partSrv.queryPartPageData({pageNo: 1, pageSize: 10}).subscribe(
      (value) => {
        console.log(value);
        this.loadHidden = true;
        this.partTableContent = value.data.contents;
        // console.log(this.partTableContent);
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        // console.log(123);
      }
    );
    this.partTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};

  }
  // condition search click
  public  partSearchClick(): void {
    // @ts-ignore
    console.log(this.input.nativeElement.value);
    console.log('这里是条件搜索');
  }
  // add  part
  public  partAddClick(): void {
    // this.primitList = [];
    // this.partCodeList = [];
    // this.loadHidden = false;
    this.partAddDialog = true;
    // this.partSrv.addPart({}).subscribe(
    //   (value) => {
    //     console.log(value);
    //     this.loadHidden = true;
    //
    //     value.data.forEach( v => {
    //       this.partCodeList.push({label: v.realName, value: v.userId});
    //     });
    //     console.log(this.partCodeList);
    //     this.partAddDialog = true;
    //   }
    // );
    // this.partSrv.updatePart({}).subscribe(
    //   (value) => {
    //     console.log(value.data);
    //     value.data.forEach( v => {
    //       this.primitList.push({label: v.partName, value:  v.partCode});
    //     });
    //     this.loadHidden = true;
    //
    //   }
    // );
    console.log('这里是添加信息');
  }
  // sure add part
  public  partAddSureClick(): void {
    if (this.partAdd.roleName !== undefined) {
      this.confirmationService.confirm({
        message: `确认要增加吗？`,
        header: '增加提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.loadHidden = false;
          this.partSrv.addPart(this.partAdd).subscribe(
            (value) => {
              console.log(value);
              this.loadHidden = true;
              this.partAddDialog = false;
              this.setToast('success', '操作成功', '角色添加成功');
              this.partInitialization();
            }
          );
        },
        reject: () => {
          // console.log('这里是增加信息');
        }
      });

    } else {
      this.setToast('error' , '操作错误', '未填写角色名称');
    }
  }
  // close add part
  public partAddCloseClick(): void {
    this.initializationData();
    this.partAddDialog = false;
    // this.partCodeList = [];
    this.partInitialization();
  }
  // modify part
  public partModifyClick(): void {
    console.log(this.partSelect);
    if (this.partSelect === undefined || this.partSelect.length === 0 ) {
      this.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.partSelect.length === 1) {
      this.partModifyDialog = true;
      this.partModify.id = this.partSelect[0].id;
      this.partModify.organizationId = this.partSelect[0].organizationId;
      this.partModify.roleCode = this.partSelect[0].roleCode;
      this.partModify.roleName = this.partSelect[0].roleName;
      this.partModify.remark = this.partSelect[0].remark;
      this.partModify.idt = this.partSelect[0].idt;
      this.partModify.udt = this.partSelect[0].udt;
      // this.partModify.id = this.partSelect[0].id;
      // this.partModify.settingType = this.partSelect[0].settingType;
      // this.partModify.settingCode = this.partSelect[0].settingCode;
      // this.partModify.settingName = this.partSelect[0].settingName;
      // this.partModify.organizationId = this.partSelect[0].organizationId;
    } else {
      this.setToast('error', '操作错误', '只能选择一项进行修改');
    }
  }
  // sure modify part
  public  partModifySureClick(): void {
    this.confirmationService.confirm({
      message: `确认要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.partSrv.updatePart(this.partModify).subscribe(
          (value) => {
            console.log(value);
            this.partModifyDialog = false;
            this.setToast('success', '操作成功', '角色信息修改成功');
            this.initializationData();
            this.partInitialization();
          }
        );
      },
      reject: () => {
      }
    });
  }
  // close modify congfig
  public  partModifyCloseClick(): void {
    this.initializationData();
    this.partModifyDialog = false;
  }
  // delete part
  public  partDeleteClick(): void {
    if (this.partSelect === undefined || this.partSelect.length === 0) {
      this.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.confirmationService.confirm({
        message: `确认要删除这${this.partSelect.length}项吗`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.partSelect.forEach(v => {
            this.ids.push(v.id);
          });
          console.log(this.ids.join(','));
          this.partSrv.deletePart({ids: this.ids.join(',')}).subscribe(
            (value) => {
              console.log(value);
              this.setToast('success', '操作成功', '角色信息修改成功');
              this.initializationData();
              this.partInitialization();
            }
          );
        },
        reject: () => {
          // this.partSelect = [];
          // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
        }
      });
    }
  }
  // public  setUserTypeChange(e): void {
  //   this.partAdd.settingType = e.value;
  //   this.partModify.settingType = e.value;
    // console.log(e);
    // this.userCode = e.value;
  // }

  // initialization data
  public initializationData(): void {
    this.partSelect = [];
    this.partAdd = new AddSetPart();
    this.partModify = new ModifySetPart();
    this.setlimitCodeOption = [];
    // this.partDatas = [];
    // this.userCode = '';
  }
  public  nowpageEventHandle(event: any): void {
    console.log(event);
    this.partSrv.queryPartPageData({pageNo: event, pageSize: 10}).subscribe(
      (value) => {
        console.log(value);
        this.loadHidden = true;
        this.partTableContent = value.data.contents;
        // console.log(this.partTableContent);
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        // console.log(123);
      });
    this.partSelect = [];
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
}
