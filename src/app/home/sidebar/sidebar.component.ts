import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MenuItem, MessageService} from 'primeng/api';
import {PanelMenu} from 'primeng/primeng';
import {NavigationEnd, Router} from '@angular/router';
import {Location} from '@angular/common';
import {LocalStorageService} from '../../common/services/local-storage.service';
import {HomeService} from '../../common/services/home.service';
import {PublicMethedService} from '../../common/public/public-methed.service';
import {ThemeService} from '../../common/public/theme.service';
@Component({
  selector: 'rbi-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent implements OnInit , OnChanges, AfterViewInit {
  @Input()public data: any;
  public items: MenuItem[] = [];
  public slidinghight: number;
  public slidingTop: number;
  public url: any = null;
  public sidebarItem = [];
  public ItemData = [];
  public flag: boolean;
  public cleanTimer: any; // 清除时钟
  public ft = '#8F9198';
  public ftHover = '#3A79DD';
  // public items: MenuItem[];
  constructor(
    private router: Router,
    private location: Location,
    private localSrv: LocalStorageService,
    private homeSrv: HomeService,
    private messageService: MessageService,
    private toolSrv: PublicMethedService,
    private themeSrv: ThemeService

  ) {
    this.themeSrv.changeEmitted$.subscribe(value => {
      console.log(value);
      this.ftHover = value.siderbar.ftHover;
      this.ft  = value.siderbar.ft;
      this.sidebarRouterStatus(this.url);
    });
  }

  ngOnInit() {
    if(this.themeSrv.setTheme !== undefined) {
      this.ftHover = this.themeSrv.setTheme.siderbar.ftHover;
      this.ft  = this.themeSrv.setTheme.siderbar.ft;
    }
  }

  // change the text Color
  public sidebarColorClick(e): void {
    const li = document.getElementsByClassName('ui-panelmenu-header-link');
    for (let i  = 0 ; i < li.length; i++) {
      // @ts-ignore
      li[i].style.color = this.ft;
    }
    if (e.target.className === 'ui-menuitem-text') {
      e.path[1].style.color = this.ftHover;
    } else {
      e.path[0].style.color = this.ftHover;
    }
  }

  // Mouse movement change the text Color
  public sidebarColorMove(e): void {
    if (e.target.className === 'ui-menuitem-text') {
      this.slidingTop = e.path[1].offsetTop;
      this.slidinghight = e.path[1].offsetHeight;
    } else {
      this.slidingTop = e.path[1].offsetTop;
      this.slidinghight = e.path[1].offsetHeight;
    }
   }

  // Mouse leave  change the text Color
  public  sidebarColorMoveout(): void {
       this.slidinghight = 0;
       this.slidingTop = 0;
   }

  // View route activation
  public  sidebarRouterStatus(url): void {
    let position = 0;
    this.items.map((prop) => {
          position = position + 1;
          if (prop.routerLink.toString().split('/', 4)[3].indexOf(url) === 0) {
            const li = document.getElementsByClassName('ui-panelmenu-header-link');
            // @ts-ignore
            li[position - 1].style.color = this.ftHover;
            for (let i = position; i < li.length; i++) {
              // @ts-ignore
              li[i].style.color = this.ft;
            }
            for (let i = 0; i < position - 1; i++) {
              // @ts-ignore
              li[i].style.color = this.ft;
            }
          }
        });
  }
  // Listening to the parent component
  ngOnChanges(changes: SimpleChanges): void {
    this.ItemData = [
      { title: '基础信息', item: [], routingItem: [
          {label: '业主资料', icon: 'pi pi-fw ', routerLink: ['/home/baseinfo/owner']},
          {label: '租户资料', icon: 'pi pi-fw ', routerLink: ['/home/baseinfo/tenantinfo']},
          {label: '收费项目', icon: 'pi pi-fw ', routerLink: ['/home/baseinfo/toll']},
          {label: '收费项目配置', icon: 'pi pi-fw ', routerLink: ['/home/baseinfo/roomCharge']},
          // {label: '工作组', icon: 'pi pi-fw ', routerLink: ['/home/baseinfo/workgroup']},
          {label: '员工档案', icon: 'pi pi-fw ', routerLink: ['/home/baseinfo/staff']},
          {label: '优惠券', icon: 'pi pi-fw ', routerLink: ['/home/baseinfo/coupon']},
          {label: '车位信息', icon: 'pi pi-fw ', routerLink: ['/home/baseinfo/parkingspace']},
          {label: '车辆信息', icon: 'pi pi-fw ', routerLink: ['/home/baseinfo/vehicle']},
        ] },
      { title: '关联设置', item: [] , routingItem: [
          {label: '员工分组', icon: 'pi pi-fw', routerLink: ['/home/assoc/assocstaff']},
        ]},
      { title: '首页', item: [] , routingItem: []},
      { title: '收费管理', item: [], routingItem:  [
          {label: '物业缴费', icon: 'pi pi-fw ', routerLink: ['/home/charge/payment']},
          {label: '缴费记录', icon: 'pi pi-fw ', routerLink: ['/home/charge/details']},
          {label: '报表导出', icon: 'pi pi-fw ', routerLink: ['/home/charge/export']},
          // {label: '保证金', icon: 'pi pi-fw ', routerLink: ['/home/charge/margin']},
          // {label: '退款记录', icon: 'pi pi-fw ', routerLink: ['/home/charge/record']},
          // {label: '欠款记录', icon: 'pi pi-fw ', routerLink: ['/home/charge/arrears']},
          {label: '预缴记录', icon: 'pi pi-fw ', routerLink: ['/home/charge/prepayment']},
          // {label: '历史报表', icon: 'pi pi-fw ', routerLink: ['/home/charge/historicalreport']},
          {label: '车位管理', icon: 'pi pi-fw ', routerLink: ['/home/charge/parkspace']},
          // {label: '优惠券', icon: 'pi pi-fw ', routerLink: ['/home/charge/coupon']},
        ] },
      { title: '事件监视', item: [], routingItem: [
          {label: '日志监视', icon: 'pi pi-fw', routerLink: ['/home/monitor/log']},
          {label: '异常管理', icon: 'pi pi-fw', routerLink: ['/home/monitor/deviant']},
          {label: '投诉管理', icon: 'pi pi-fw', routerLink: ['/home/monitor/complaint']},
          {label: '巡检记录', icon: 'pi pi-fw', routerLink: ['/home/monitor/check']},
        ]},
      { title: '系统设置', item: [],  routingItem: [
          // {label: '车辆种类', icon: 'pi pi-fw ', routerLink: ['/home/system/carkind']},
          // {label: '车辆品牌', icon: 'pi pi-fw ', routerLink: ['/home/system/carbrand']},
          // {label: '民族管理', icon: 'pi pi-fw ', routerLink: ['/home/system/nation']},
          {label: '系统配置', icon: 'pi pi-fw ', routerLink: ['/home/system/config']},
          {label: '角色信息', icon: 'pi pi-fw ', routerLink: ['/home/system/part']},
          {label: '用户角色配置', icon: 'pi pi-fw ', routerLink: ['/home/system/role']},
          {label: '角色权限配置', icon: 'pi pi-fw ', routerLink: ['/home/system/permission']},
        ]},
      { title: '优惠券', item: [],  routingItem : [
          {label: '优惠券信息', icon: 'pi pi-fw ', routerLink: ['/home/coupon/total']},
          {label: '优惠券初审', icon: 'pi pi-fw ', routerLink: ['/home/coupon/review']},
          {label: '优惠券复审', icon: 'pi pi-fw ', routerLink: ['/home/coupon/pandingreview']},
          {label: '已审核', icon: 'pi pi-fw ', routerLink: ['/home/coupon/audited']},
        ] },
      { title: '退款', item: [],  routingItem: [
          {label: '退款信息', icon: 'pi pi-fw ', routerLink: ['/home/refund/info']},
          {label: '未退款', icon: 'pi pi-fw ', routerLink: ['/home/refund/no']},
          {label: '已退款', icon: 'pi pi-fw ', routerLink: ['/home/refund/already']},
          {label: '申请退款', icon: 'pi pi-fw ', routerLink: ['/home/refund/applicationInfo']},
          {label: '退款初审', icon: 'pi pi-fw ', routerLink: ['/home/refund/review']},
          {label: '退款复审', icon: 'pi pi-fw ', routerLink: ['/home/refund/pendreview']},
          {label: '退款已审核', icon: 'pi pi-fw ', routerLink: ['/home/refund/audited']},
        ] },
      { title: '违约金', item: [],  routingItem: [
          {label: '业主信息', icon: 'pi pi-fw ', routerLink: ['/home/latepayment/owner']},
          {label: '违约金信息', icon: 'pi pi-fw ', routerLink: ['/home/latepayment/latepaytotle']},
          {label: '待审核', icon: 'pi pi-fw ', routerLink: ['/home/latepayment/review']},
          {label: '待复审', icon: 'pi pi-fw ', routerLink: ['/home/latepayment/pendreview']},
          {label: '审核拒绝', icon: 'pi pi-fw ', routerLink: ['/home/latepayment/nopass']},
          {label: '审核通过', icon: 'pi pi-fw ', routerLink: ['/home/latepayment/audited']},
        ] }
    ];
    if (this.localSrv.getObject('sidebarItem') === 1 || this.localSrv.getObject('sidebarItem') === null ) {
      this.localSrv.getObject('item').forEach(v => {
        this.ItemData.forEach( h => {
          if (v.title === h.title) {
            this.items = [];
            this.homeSrv.getChildrenRouter({parentCode: v.permisCode}).subscribe(
              (value) => {
                value.data.forEach( data => {
                  h.routingItem.forEach( val => {
                    if (val.label === data.title) {
                      this.sidebarItem.push({parentCode: data.parentCode, label: data.title });
                      h.item.push(val);
                    }
                  });
                });
                this.localSrv.remove('sidebarItem');
                this.localSrv.setObject('sidebarItem', this.ItemData);
              }
            );
          }
        });
      });
    } else {
      this.ItemData = this.localSrv.getObject('sidebarItem');
    }
    try {
      this.ItemData.forEach( v => {
        if (this.data === v.title) {
          this.items  = v.item;
        }
      });
    } catch (e) {
      this.toolSrv.setToast('error', '操作失败', '该用户没有权限');
    }
  }
  // View rendering
  ngAfterViewInit(): void {
    this.url = this.location.path().split('/', 4)[3];
    this.sidebarRouterStatus(this.url);
    // 定略获取路由
    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd) {
          this.url = event.url.split('/', 4)[3];
          this.sidebarRouterStatus(this.url);
        }
      }
    );
  }

}
