import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'rbi-bf-toll',
  templateUrl: './bf-toll.component.html',
  styleUrls: ['./bf-toll.component.less']
})
export class BfTollComponent implements OnInit {
  public activeItem: MenuItem;
  public tabItems = [
    {label: '项目信息', icon: 'pi pi-fw pi-folder-open', routerLink: 'info'},
    {label: '待审核', icon: 'pi pi-fw pi-folder', routerLink: 'audit'},
    {label: '待复审', icon: 'pi pi-fw pi-folder', routerLink: 'review'},
    {label: '审核通过', icon: 'pi pi-fw pi-folder', routerLink: 'audited'},
  ];

  ngOnInit(): void {
    console.log(this.activeItem);
  }
}
