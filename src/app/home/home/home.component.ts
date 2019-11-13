import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HomeService} from '../../common/services/home.service';
import {ActivatedRoute} from '@angular/router';
import {LocalStorageService} from '../../common/services/local-storage.service';
import {TreeNode} from '../../common/model/shared-model';
import {DataTree} from '../../common/components/basic-dialog/dialog.model';
import {GlobalService} from '../../common/services/global.service';
import {SharedServiceService} from '../../common/public/shared-service.service';

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

  public imageHidden = true;

  public SearchData = {
    villageCode: '',
    regionCode: '',
    buildingCode: '',
    unitCode: '',
    roomtCode: '',
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
  ) { }

  ngOnInit() {
    if (this.route.snapshot.children[0].url[0].path === 'main') {
      this.sidbarHidden = true;
    }
    this.globalSrv.queryTVillageTree().subscribe(
      value => {
        // console.log(value);
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
    this.imageHidden = false;
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
  }

  public  setSearhData(data): any {
    switch (data.level) {
      case '1': this.SearchData.villageCode = data.value; break;
      case '2': this.SearchData.regionCode = data.value; break;
      case '3': this.SearchData.buildingCode = data.value; break;
      case '4': this.SearchData.unitCode = data.value; break;
      case '5': this.SearchData.roomtCode = data.value; break;
      default: break;
    }
    if (data.parent !== undefined) {
      this.setSearhData(data.parent);
    }
  }

  public mouserEnter(): void {
      this.treeDialog = true;
  }
  public  dataTreeSureClick(): void {
    this.shareSrv.emitChange(this.SearchData);
  }

  public  changeTheme(): void {
    document.body.style.setProperty('--bgc-them', '#55AA80');
    // localStorage.setItem('--bgc-them', '')
    // console.log(less);
    // less.modifyVars({
    //     '@background': '#ffffff',
    //     '@color': '#ffffff'
    //   }).then(() => {
    //     console.log(123);
    // });
  }
}
