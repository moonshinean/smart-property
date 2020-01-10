import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {GlobalService} from '../../../common/services/global.service';
import {LocalStorageService} from '../../../common/services/local-storage.service';
import {ThemeService} from '../../../common/public/theme.service';
import {SetRoleService} from '../../../common/services/set-role.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'rbi-login-log',
  templateUrl: './login-log.component.html',
  styleUrls: ['./login-log.component.less']
})
export class LoginLogComponent implements OnInit, OnDestroy {

  public logTableContent: any;
  public logSelect: [];
  public logOption: any;
  // 搜索相关
  public searchData = {
    pageNo: 1,
    pageSize: 10,
    startTime: '',
    endTime: '',
    username: '',
    realName: '',
  };
  public searchType = 0;
  public searchInput: any;
  public SearchTypeOption = [
    {label: '用户名', value: 1},
    {label: '真实姓名', value: 2},
    // {label: '时间段', value: 3}
  ];
  public btnHiden = [
    {label: '搜索', hidden: true},
  ];
  // 其他相关
  public option: any;
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
  public logDialog: any;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private logSrv: SetRoleService,
    public toolSrv: PublicMethedService,
    private globalSrv: GlobalService,
    private localSrv: LocalStorageService,
    private themeSrv: ThemeService,
    private datePipe: DatePipe,
  ) {
    this.themeSub = this.themeSrv.changeEmitted$.subscribe(
      value => {
        this.table.tableheader = value.table.header;
        this.table.tableContent = value.table.content;
        this.table.detailBtn = value.table.detailBtn;
        this.setTableOption(this.logTableContent);
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
    this.logInitialization();
  }
  ngOnDestroy(): void {
    this.themeSub.unsubscribe();
  }
  // initialization log
  public  logInitialization(): void {
    this.loadHidden = false;
    this.querylogPageData();
  }
  // // condition search click
  public  logSearchClick(): void {
    switch (this.searchType) {
      case 0: this.toolSrv.setToast('error', '操作错误', '请选择查询条件'); break;
      case 1: this.clearSeachData('username', 'username'); this.searchData.username = this.searchInput; this.querylogPageData(); break;
      case 2: this.clearSeachData('realName', 'realName');  this.searchData.realName = this.searchInput; this.querylogPageData(); break;
      // case 3: this.clearSeachData('endTime', 'startTime'); this.logDialog = true; break;
    }
  }
  public  judgSearchType(): void {
    switch (this.searchType) {
      case 1: this.clearSeachData('username', 'username'); this.querylogPageData(); break;
      case 2: this.clearSeachData('realName', 'realName');  this.querylogPageData(); break;
      case 3: this.clearSeachData('endTime', 'startTime'); this.querylogPageData(); break;
    }
  }
  public  clearSeachData(data, data1): void {
    for(const key in this.searchData) {
      if (key !== data && key !== data1) {
        this.searchData[key] = '';
      }
      this.searchData.pageNo = this.pageNo ;
      this.searchData.pageSize = 10;
    }
  }
  // public logSureClick(): void {
  //   if (this.searchData.endTime !== '' || this.searchData.startTime !== '') {
  //     this.logDialog = false;
  //     this.querylogPageData();
  //   } else {
  //     this.toolSrv.setToast('error', '操作错误', '时间不能为空');
  //   }

  // }
  // 条件查询 {}

  // initialization data
  public initializationData(): void {
    this.logSelect = [];
  }
  // paging query
  public  nowpageEventHandle(event: any): void {
    this.pageNo = event;
    this.judgSearchType();
    this.logSelect = [];
  }

  // public  logCloseClick(): void {
  //     this.logDialog = false;
  // }
  // 设置表格
  public  setTableOption(data1): void {
    this.logOption = {
      width: '101.4%',
      header: {
        data:   [
          {field: 'idt', header: '时间'},
          {field: 'username', header: '用户名'},
          {field: 'realName', header: '真实姓名'},
          {field: 'ipAddress', header: 'IP地址'},
          {field: 'event', header: '事件'},
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
    this.logSelect = e;
  }

  public  querylogPageData(): void {
    this.logSrv.queryLoginLog(this.searchData).subscribe(
      (value) => {
        this.loadHidden = true;
        this.logTableContent = value.data.contents;
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

  public  logSelectClick(data): void {
    console.log(this.searchData.endTime);
    if (data === 'endTime') {
      if (this.searchData.endTime !== '' && this.searchData.startTime !== '') {


        this.clearSeachData('endTime', 'startTime');
        this.searchData.startTime = this.datePipe.transform(this.searchData.startTime, 'yyyy-MM-dd hh:mm');
        this.searchData.endTime = this.datePipe.transform(this.searchData.endTime, 'yyyy-MM-dd hh:mm');
        this.searchType = 3;
        this.querylogPageData();
      } else {
        this.toolSrv.setToast('warn', '操作成功', '请选择开始时间');
      }
    } else {
      // if ( )
      if (this.searchData.endTime !== '' && this.searchData.startTime !== '') {
        // this.searchData.endTime = this.datePipe.transform(this.searchData.endTime, 'yyyy-MM-dd');
        // this.searchData.startTime = this.datePipe.transform(this.searchData.startTime, 'yyyy-MM-dd');
        this.clearSeachData('endTime', 'startTime');
        this.querylogPageData();
      } else {
        this.toolSrv.setToast('warn', '操作成功', '请选择结束时间');
      }
    }
  }
}
