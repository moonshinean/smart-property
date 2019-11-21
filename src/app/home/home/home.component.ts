import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HomeService} from '../../common/services/home.service';
import {ActivatedRoute} from '@angular/router';
import {LocalStorageService} from '../../common/services/local-storage.service';
import {TreeNode} from '../../common/model/shared-model';
import {DataTree} from '../../common/components/basic-dialog/dialog.model';
import {GlobalService} from '../../common/services/global.service';
import {SharedServiceService} from '../../common/public/shared-service.service';
import {ThemeService} from '../../common/public/theme.service';
import {PublicMethedService} from '../../common/public/public-methed.service';

@Component({
  selector: 'rbi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  @ViewChild('mainStyle') mainStyle: Element;
  public sidbarHidden: boolean;
  public sidbarItem: any;
  public sidbarData: any;
  public treeDialog = false;
  public roomtree: any;
  public themeFlag = 0;
  // public themeTitle = '经典黑';
  // public themeColor = '#282A31';
  public themeList = [
    {label: '经典黑', value: '#282A31'},
    {label: '自然绿', value: '#55AA80'},
    {label: '天空蓝', value: '#7EC6F5'},
  ];
  public imageHidden = false;

  public SearchData = {
    villageCode: '',
    regionCode: '',
    buildingCode: '',
    unitCode: '',
    roomCode: '',
    data: {
      level: '',
      code: '',
    }
  };

  public dataTrees: DataTree[];
  public dataTree: DataTree = new DataTree();

  constructor(
    private homeSrv: HomeService,
    private route: ActivatedRoute,
    private localSrv: LocalStorageService,
    private globalSrv: GlobalService,
    private shareSrv: SharedServiceService,
    private toolSrv: PublicMethedService,
  ) { }

  ngOnInit() {
    if (this.localSrv.getObject('theme').value) {
      this.toolSrv.changeTheme(this.localSrv.getObject('theme').value);
      this.themeFlag = this.localSrv.getObject('theme').flag;
    } else {
      this.toolSrv.changeTheme('default');
    }
    if (this.route.snapshot.children[0].url[0].path === 'main') {
      this.sidbarHidden = true;
    }
    this.globalSrv.queryTVillageTree().subscribe(
      value => {
        if (value.status === '1000') {
          this.roomtree = value.data;
          this.dataTrees = this.initializeTree(this.roomtree);
        }
      }
    );
  }
  // sidebar Hidden display
  public homeHiddenSidebar(e): void {
    this.sidbarHidden = e;
    // this.imageHidden = false;
  }

  // sidebar data
  public homeSetsidebarData(e): void {
    this.sidbarItem = e;
  }
  // Set main style
  public  homeSetMainStyle(e): void {
    // @ts-ignore
    this.mainStyle.nativeElement.style.marginLeft = e + 'vw';
  }

  public initializeTree(data): any {
    // console.log(oneChild);
    const oneChild = [];
    for (let i = 0; i < data.length; i++) {
      const childnode = new TreeNode();
      childnode.value = data[i].code;
      childnode.label = data[i].name;
      childnode.level = data[i].level;
      if (data[i].villageChoose2DTO != null && data[i].villageChoose2DTO.length !== 0 ) {
        childnode.children = this.initializeTree(data[i].villageChoose2DTO);
      } else {
        childnode.children = [];
      }
      oneChild.push(childnode);
    }
    return oneChild;
  }

  // Tree structure is not selected
  public  treeOnNodeSelect(e): void {
    // tslint:disable-next-line:forin
    for (const key in this.SearchData) {
      if (key !== 'data') {
        this.SearchData[key] = '';
      } else {
        this.SearchData[key].level = '';
        this.SearchData[key].code = '';
      }
    }

    this.SearchData.data.level = e.node.level;
    this.SearchData.data.code = e.node.value;
    this.setSearhData(e.node);
    this.shareSrv.emitChange(this.SearchData);
  }

  public  setSearhData(data): any {
    switch (data.level) {
      case '1': this.SearchData.villageCode = data.value; break;
      case '2': this.SearchData.regionCode = data.value; break;
      case '3': this.SearchData.buildingCode = data.value; break;
      case '4': this.SearchData.unitCode = data.value; break;
      case '5': this.SearchData.roomCode = data.value; break;
      default: break;
    }
    if (data.parent !== undefined) {
      this.setSearhData(data.parent);
    }
  }

  public mouserEnter(): void {
      this.treeDialog = true;
  }
  // public  dataTreeSureClick(): void {
  //
  // }

  public  changeTheme(): void {
    switch (this.themeFlag) {
      case 0:
        this.themeFlag += 1;
        this.localSrv.setObject('theme', {value: 'green', flag: this.themeFlag});
        this.toolSrv.changeTheme('green');
        break;
      case 1:
        this.themeFlag += 1;
        this.localSrv.setObject('theme', {value: 'blue', flag: this.themeFlag});
        this.toolSrv.changeTheme('blue');
        break;
      case 2:
        this.themeFlag  = 0;
        this.localSrv.setObject('theme', {value: 'default', flag: this.themeFlag});
        this.toolSrv.changeTheme('default');
        break;
    }
    // this.themeFlag += 1;
    // this.localSrv.setObject('theme', {value: 'green', falg: this.themeFlag});
    // // this.localSrv.set('theme', 'green');
    // this.toolSrv.changeTheme('green');
    // this.localSrv.set('themeFlag', this.themeFlag.toString());
    // if ()
    // this.themeList
    // const home = document.getElementById('home');
    // document.documentElement.style.setProperty('--bgc-theme', '#55AA80');
    // document.documentElement.style.setProperty('--body-bgc', '#CBCBCB');
    // document.documentElement.style.setProperty('--ft-sidebar-theme', '#fff');
    // document.documentElement.style.setProperty('--ft-sidebar-hover-theme', '#000');
    // document.documentElement.style.setProperty('--bgc-sidbarMunu', '#365244');
    // document.documentElement.style.setProperty('--footer-bgc', '#fff');
    // document.documentElement.style.setProperty('--footer-ft', '#000');
    // document.documentElement.style.setProperty('--mokuai-bgc', '#F5F5F5');
    // document.documentElement.style.setProperty('--paging-bgc', '#F5F5F5');
    // document.documentElement.style.setProperty('--paging-ft', '#000');
    // document.documentElement.style.setProperty('--paging-input', 'rgba(3,3,3,0.5)');
    // document.documentElement.style.setProperty('--table-detail', '#6AB993');
    // document.documentElement.style.setProperty('--header-bgc', '#4B9D76');
    // this.themeSrv.emitChangeTheme({
    //   siderbar: {ft: '#fff', ftHover: '#000'},
    //   headerbar: {ft: '#fff', ftHover: '#000'},
    //   table: {
    //     header: {background: '#55AA80', color: '#fff'},
    //     content: [{background: '#DBF3E6', color: '#000'}, {background: '#F5F5F5', color: '#000'}],
    //     detailBtn: '#6AB993'
    //   }
    // });
    // // localStorage.setItem('--bgc-them', '')
    // // console.log(less);
    // // less.modifyVars({
    // //     '@background': '#ffffff',
    // //     '@color': '#ffffff'
    // //   }).then(() => {
    // //     console.log(123);
    // // });
  }
}
