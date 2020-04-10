import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {LocalStorageService} from '../../../common/services/local-storage.service';
import {GlobalService} from '../../../common/services/global.service';

@Component({
  selector: 'rbi-bf-toll',
  templateUrl: './bf-toll.component.html',
  styleUrls: ['./bf-toll.component.less']
})
export class BfTollComponent implements OnInit {
  public activeItem: MenuItem;
  public tabItems = [
    {label: '项目信息', icon: 'pi pi-fw pi-folder-open', routerLink: 'info'},
    {label: '变动记录', icon: 'pi pi-fw pi-folder-open', routerLink: 'changeinfo'},
    {label: '待初审', icon: 'pi pi-fw pi-folder', routerLink: 'audit'},
    {label: '待复审', icon: 'pi pi-fw pi-folder', routerLink: 'review'},
    {label: '审核通过', icon: 'pi pi-fw pi-folder', routerLink: 'audited'},
  ];
  public tabItemMenu = [];
  constructor(
    private globalSrv: GlobalService,
    private localSrv: LocalStorageService,
  ) {
  }

  ngOnInit(): void {
    // console.log(this.activeItem);
    this.setBtnIsHidden();
  }
  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '收费项目') {
        this.globalSrv.getChildrenRouter({parentCode: v.parentCode}).subscribe(value => {
          // console.log(value);
          this.tabItems.forEach(val => {
            value.data.forEach(res => {
              if (val.label === res.title) {
                this.tabItemMenu.push(val);
              }
            });
          });
          // console.log(this.tabItemMenu);
        });
      }
    });
  }
}
