import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {GlobalService} from '../../../common/services/global.service';
import {Addconfig, Modifyconfig, SetConfig} from '../../../common/model/set-config.model';
import {SetConfigService} from '../../../common/services/set-config.service';
import {isObjectFlagSet} from 'tslint';
import {Dropdown} from 'primeng/primeng';

@Component({
  selector: 'rbi-set-config',
  templateUrl: './set-config.component.html',
  styleUrls: ['./set-config.component.less']
})
export class SetConfigComponent implements OnInit {
  @ViewChild('addSetType') addSetType: Dropdown;
  @ViewChild('input') input: Input;
  public configTableTitle: any;
  public configTableContent: SetConfig[];
  public configTableTitleStyle: any;
  public configSelect: SetConfig[];
  // 添加相关
  public configAddDialog: boolean;
  public configAdd: Addconfig = new Addconfig();
  // 修改相关
  public configModifyDialog: boolean;
  public configModify: Modifyconfig = new Modifyconfig();
  // 删除相关
  public ids: any[] = [];
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  public setTypeOption: any[] = [];
  public loadHidden = true;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    // private configService: setConfigService,
    private configService: SetConfigService,
    private globalService: GlobalService
  ) { }
  ngOnInit() {
    this.configInitialization();
  }

  // initialization config
  public  configInitialization(): void {
    this.loadHidden = false;
    this.configTableTitle = [
      // {field: 'organizationId', header: '集团id'},
      {field: 'settingCode', header: '设置编号'},
      {field: 'settingName', header: '设置名称'},
      {field: 'settingType', header: '设置类型'},
    ];
    this.configService.querySetPage({pageNo: 1, pageSize: 10}).subscribe(
      (value) => {
        console.log(value);
        this.loadHidden = true;
        this.configTableContent = value.data.contents;
        // console.log(this.configTableContent);
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        // console.log(123);
      }
    );
    this.configService.getSetType({}).subscribe(
      (value) => {
        // console.log(value);/
        value.data.forEach( v => {
          this.setTypeOption.push({label: v.settingName, value: v.settingCode});

        });
      }
    );
    console.log('这里是信息的初始化');

    this.configTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};

  }
  // condition search click
  public  configSearchClick(): void {
    // @ts-ignore
    console.log(this.input.nativeElement.value);
    console.log('这里是条件搜索');
  }
  // add  config
  public  configAddClick(): void {
    this.configAddDialog = true;
    console.log('这里是添加信息');
  }
  // sure add config
  public  configAddSureClick(): void {
    this.confirmationService.confirm({
      message: `确认要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadHidden = false;

        this.configService.addSet(this.configAdd).subscribe(
          (value) => {
            console.log(value);
            this.loadHidden = true;

            if (value.status === '1000') {
              this.setToast('success', '操作成功', '添加成功');
              this.configInitialization();
              this.configAddDialog = false;
            } else {
              this.setToast('error', '操作失败', value.message);
            }
          }
        );
        console.log(this.configAdd);
      },
      reject: () => {
        // console.log('这里是增加信息');
      }
    });
  }
  // close add config
  public configAddCloseClick(): void {
      this.initializationData();
      this.configAddDialog = false;
      this.configInitialization();
  }
  // modify config
  public configModifyClick(): void {
    console.log(this.configSelect);
    if (this.configSelect === undefined || this.configSelect.length === 0 ) {
      this.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.configSelect.length === 1) {
      this.configModifyDialog = true;
      this.configModify.id = this.configSelect[0].id;
      this.configModify.settingType = this.configSelect[0].settingType;
      this.configModify.settingCode = this.configSelect[0].settingCode;
      this.configModify.settingName = this.configSelect[0].settingName;
      this.configModify.organizationId = this.configSelect[0].organizationId;
      this.configModify.udt = this.configSelect[0].udt;
      this.configModify.status = this.configSelect[0].status;
      this.configModify.idt = this.configSelect[0].idt;
    } else {
      this.setToast('error', '操作错误', '只能选择一项进行修改');
    }
  }
  // sure modify config
  public  configModifySureClick(): void {
    this.confirmationService.confirm({
      message: `确认要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadHidden = false;
        this.setTypeOption.forEach( v => {
          if (this.configModify.settingType === v.label) {
            // console.log();
            this.configModify.settingType = v.value;
          }
        });
        console.log(this.configModify);
        this.configService.updateSet(this.configModify).subscribe(
          (value) => {
            console.log(value);
            this.loadHidden = true;

            if (value.status === '1000') {
              this.configInitialization();
              this.setToast('success', '操作成功', '修改成功');
              this.configModifyDialog = false;
              this.configSelect = [];
            } else {
              this.setToast('error', '操作失败', value.message);
            }
          }
        );
      },
      reject: () => {
      }
    });
  }
  // close modify congfig
  public  configModifyCloseClick(): void {
    this.initializationData();
    this.configModifyDialog = false;
    this.configInitialization();
  }
  // delete config
  public  configDeleteClick(): void {
    if (this.configSelect === undefined || this.configSelect.length === 0) {
        this.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.confirmationService.confirm({
        message: `确认要删除这${this.configSelect.length}项吗`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          console.log(this.configSelect);
          this.loadHidden = false;

          if (this.configSelect.length === 1) {
            this.configService.delectSet({id: this.configSelect[0].id}).subscribe(
              (value) => {
                console.log(value);
                this.loadHidden = true;

                if (value.status === '1000') {
                  this.configInitialization();
                  this.setToast('success', '操作成功', '删除成功');
                  // this.configModifyDialog = false;
                  this.configSelect = [];
                } else {
                  this.setToast('error', '操作失败', value.message);
                }
              }
            );
          } else if (this.configSelect.length > 1) {
            this.loadHidden = false;

            this.configSelect.forEach(v => {
              this.ids.push({id: v.id});
            });
            console.log(this.ids);
            this.configService.deletemoreSet({data: this.ids}).subscribe(
              (value) => {
                console.log(value);
                this.loadHidden = true;

                if (value.status === '1000') {
                  this.configInitialization();
                  this.setToast('success', '操作成功', '删除成功');
                  // this.configModifyDialog = false;
                  this.configSelect = [];
                } else {
                  this.setToast('error', '操作失败', value.message);
                }
              }
            );
          }
        },
        reject: () => {
          // this.configSelect = [];
          // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
        }
      });
    }
  }
  public  setTypeChange(e): void {
    this.configAdd.settingType = e.value;
    // this.configModify.settingType = e.value;
    console.log(e);
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
  // initialization data
  public initializationData(): void {
    this.configSelect = [];
    this.configAdd = new Addconfig();
    this.configModify = new Modifyconfig();
    this.setTypeOption = [];
    this.addSetType.value = null;
  }
  public  nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.configService.querySetPage({pageNo: event, pageSize: 10}).subscribe(
      (value) => {
        console.log(value);
        this.loadHidden = true;

        this.configTableContent = value.data.contents;
        // console.log(this.configTableContent);
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        // console.log(123);
      }
    );
    this.configSelect = [];
  }
}
