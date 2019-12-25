import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BfTollService} from '../../../common/services/bf-toll.service';
import {AddToll, BfTollTitle, ModifyTollDrop, Toll, TollMoreInfo} from '../../../common/model/bf-toll.model';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import { Subscription} from 'rxjs';
import {SharedServiceService} from '../../../common/public/shared-service.service';
import {ThemeService} from '../../../common/public/theme.service';
import {GlobalService} from '../../../common/services/global.service';
import {LocalStorageService} from '../../../common/services/local-storage.service';

@Component({
  selector: 'rbi-bf-toll',
  templateUrl: './bf-toll.component.html',
  styleUrls: ['./bf-toll.component.less']
})
export class BfTollComponent implements OnInit, OnDestroy {
  public tableOption: any;
  public tollTableContent: Toll[];
  public tollTableTitleStyle: any;
  public tollSelect: Toll[] = [];
  // 添加相关
  public tollAddDialog: boolean;
  public tollAdd: AddToll[] = [];
  public tollAddinfo: AddToll = new AddToll();
  public tollMoreInfo: TollMoreInfo[] = [];
  public tollTitle: BfTollTitle = new BfTollTitle();
  // 状态相关
  public parkingSpaceTypeOption: any[] = [];
  public parkingSpacePlaceOption: any[] = [];
  public datedifOption: any[] = [];
  public enableOption: any[] = [];
  public refundOption: any[] = [];
  public mustPayOption: any[] = [];
  public chargeTypeOption: any[] = [];
  // 搜索相关
  public searchInputData = '';
  // 修改相关
  public tollModifyDialog: boolean;
  public tollModify: any[] = [];
  public modifytoll: any[] = [];
  public tollModifyData: ModifyTollDrop = new ModifyTollDrop();
  public tollModifyDatas: ModifyTollDrop[] = [];
  public tollEnableMedify: any;
  public tollrefundMedify: any;
  public tollmustpayMedify: any;
  public tollChargeTypeMedify: any;
  public setOptionList = {
    datedif: '',
    parkingSpacePlace: '',
    parkingSpaceType: ''
  };
  // 按钮权限相关
  public btnHiden = [
    {label: '新增', hidden: true},
    {label: '修改', hidden: true},
    {label: '删除', hidden: true},
    {label: '搜索', hidden: true},
  ];
  // 搜索相关
  public searchType = 0;
  // 删除
  public ids = [];
  // 详情相关
  public tollDetailDialog: boolean;
  public detailTollTitle = [
    {field: 'chargeName', name: '项目名称', value: ''},
    {field: 'chargeType', name: '项目类型', value: ''},
    {field: 'chargeUnit', name: '项目单位', value: ''},
    {field: 'chargeStandard', name: '收费单价', value: ''},
    {field: 'refund', name: '是否可退款', value: ''},
    {field: 'enable', name: '启用状态', value: ''},
    {field: 'mustPay', name: '是否必缴', value: ''},
  ];
  public detailTollList: any[] = [];
  public TollMoreTitleDetail = [
    {field: 'id', header: '序号'},
    {field: 'areaMin', header: '面积最小值'},
    {field: 'areaMax', header: '面积最大值'},
    {field: 'datedif', header: '缴费月数'},
    {field: 'money', header: '金额'},
    {field: 'discount', header: '折扣'},
    {field: 'parkingSpacePlace', header: '车位地点'},
    {field: 'parkingSpaceType', header: '车位类型'}
  ];
  public moreTollMoreTitle = [
    {field: 'id', header: '序号'},
    {field: 'areaMin', header: '面积最小值'},
    {field: 'areaMax', header: '面积最大值'},
    {field: 'datedif', header: '缴费月数'},
    {field: 'money', header: '金额'},
    {field: 'discount', header: '折扣'},
    {field: 'parkingSpacePlace', header: '车位地点'},
    {field: 'parkingSpaceType', header: '车位类型'},
    {field: 'operating', header: '操作'},
  ];
  // 其他相关
  public esDate: any; // 清除时钟
  public option: any; // 清除时钟
  public loadHidden = true;
  public NOW_PAGE = 1;
  public deleteId: any[] = [];
  public tollSub: Subscription;
  public table = {
    tableheader: {background: '', color: ''},
    tableContent: [
      {background: '', color: ''},
      {background: '', color: ''}],
    detailBtn: ''
  };

  constructor(
    private toolSrv: PublicMethedService,
    private tollSrv: BfTollService,
    private shareSrv: SharedServiceService,
    private globalSrv: GlobalService,
    private localSrv: LocalStorageService,
    private themeSrv: ThemeService,
  ) {
    this.themeSrv.changeEmitted$.subscribe(
      value => {
        this.table.tableheader = value.table.header;
        this.table.tableContent = value.table.content;
        this.table.detailBtn = value.table.detailBtn;
        this.setTableOption(this.tollTableContent);
      }
    );
  }

  ngOnInit() {
    this.setBtnIsHidden();
    this.tollSub = this.shareSrv.changeEmitted$.subscribe(value => {
      console.log(value);
    });
    if (this.themeSrv.setTheme !== undefined) {
      this.table.tableheader = this.themeSrv.setTheme.table.header;
      this.table.tableContent = this.themeSrv.setTheme.table.content;
      this.table.detailBtn = this.themeSrv.setTheme.table.detailBtn;
    }
    // console.log(this.shareSrv.SearchData);
    this.tollInitialization();
  }

  ngOnDestroy(): void {
    // 组件销毁时 取消订阅
    this.tollSub.unsubscribe();
  }

  // initialization toll
  public tollInitialization(): void {
    this.esDate = this.toolSrv.esDate;
    this.toolSrv.getAdmStatus([{settingType: 'CHARGE_TYPE'},
      {settingType: 'ENABLED'}, {settingType: 'DATEDIF'}, {settingType: 'MUST_PAY'},
      {settingType: 'REFUND'}, {settingType: 'PAEKING_SPACE_PLACE'}, {settingType: 'CWLX'}], (data) => {
      this.enableOption = this.toolSrv.setListMap(data.ENABLED);
      this.refundOption = this.toolSrv.setListMap(data.REFUND);
      this.mustPayOption = this.toolSrv.setListMap(data.MUST_PAY);
      this.chargeTypeOption = this.toolSrv.setListMap(data.CHARGE_TYPE);
      this.setOptionList.parkingSpaceType = this.parkingSpaceTypeOption = this.toolSrv.setListMap(data.CWLX);
      this.setOptionList.parkingSpacePlace = this.parkingSpacePlaceOption = this.toolSrv.setListMap(data.PAEKING_SPACE_PLACE);

      this.setOptionList.datedif = this.datedifOption = this.toolSrv.setListMap(data.DATEDIF);
      this.queryTollPageData();
    });
    this.settollTitleData();
    this.tollTableTitleStyle = {background: '#282A31', color: '#DEDEDE', height: '6vh'};
  }

  // condition search click
  public tollSearchClick(): void {
    // @ts-ignore
    if (this.searchInputData !== '') {
       this.queryTollByChangeName();
    } else {
      this.queryTollPageData();
    }
  }

  // 判断搜索条件
  public searchJudgment(page): void {
    switch (this.searchType) {
      case 0:
        this.queryTollPageData();
        break;
      // case 1:  this.setCondition('phone', '请输入需要搜索的手机号', page); break;
      // case 2:  this.setCondition('roomCode', '请输入需要搜索的房间号', page); break;
      // case 3:  this.setCondition('surname', '请输入需要搜索的客户名称', page); break;
      // case 4:  this.setCondition('idNumber', '请输入需要搜索的身份证号', page); break;
      default:
        break;
    }
  }

  // public  setCondition(confition, message, pageNo): void {
  //   if (this.inputSearchData !== '') {
  //     this.queryOwnerPageByCondition(confition, this.inputSearchData, pageNo);
  //   } else {
  //     this.toolSrv.setToast('error', '操作错误', message);
  //   }
  // }
  // add  toll
  public tollAddClick(): void {
    this.tollAddDialog = true;
  }

  // sure add toll
  public tollAddSureClick(): void {
    this.toolSrv.setConfirmation('增加', '增加', () => {
        this.tollSrv.queryTollAdd({ chargeItem: this.tollTitle, chargeDetail: this.tollMoreInfo}).subscribe(
          value => {
            if (value.status === '1000') {
              this.toolSrv.setToast('success', '操作成功', value.message);
              this.tollInitialization();
              this.tollAddDialog = false;
              this.clearData();
            } else {
              this.toolSrv.setToast('error', '操作错误', '添加失败,' + value.message);
            }
          }
        );
    });
  }

  // modify toll
  public tollModifyClick(): void {
    if (this.tollSelect === undefined || this.tollSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.tollSelect.length === 1) {
      this.getTollDetailInfo(this.tollSelect[0].chargeCode, 'modify');

    } else {
      this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
    }
  }

  // sure modify toll
  public tollModifySureClick(): void {
    this.toolSrv.setConfirmation('修改', '修改', () => {
        this.tollSrv.updateTollInfo({ chargeItem: this.tollTitle, chargeDetail: this.tollMoreInfo}).subscribe(
          value => {
            if (value.status === '1000') {
              this.toolSrv.setToast('success', '操作成功', value.message);
              this.tollInitialization();
              this.tollModifyDialog = false;
              this.clearData();
            } else {
              this.toolSrv.setToast('error', '操作错误', '修改失败,' + value.message);
            }
          }
        );
    //   } else {
    //     this.modifytoll = [];
    //     this.tollMoreInfo.forEach((v, index) => {
    //       for (const Key in this.tollTitle) {
    //         this.tollAddinfo[Key] = this.tollTitle[Key];
    //       }
    //       for (const vKey in v) {
    //         this.tollAddinfo[vKey] = v[vKey];
    //       }
    //       if (index + 1 <= this.ids.length) {
    //         this.tollAddinfo.id = this.ids[index].id;
    //       } else {
    //         this.tollAddinfo.id = null;
    //       }
    //       this.modifytoll.push(this.tollAddinfo);
    //       this.tollAddinfo = new AddToll();
    //     });
    //     this.tollSrv.updateTollListinfo({data: this.modifytoll}).subscribe(
    //       value => {
    //         if (value.status === '1000') {
    //           this.toolSrv.setToast('success', '操作成功', value.message);
    //           this.tollInitialization();
    //           this.tollModifyDialog = false;
    //           this.clearData();
    //         } else {
    //           this.toolSrv.setToast('error', '操作错误', '修改失败,' + value.message);
    //         }
    //       }
    //     )
    });
  }

  // delete toll
  public tollDeleteClick(): void {
    if (this.tollSelect === undefined || this.tollSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.toolSrv.setConfirmation('删除', `删除这${this.tollSelect.length}项`, () => {
        this.tollSelect.forEach(v => {
          this.deleteId.push({chargeCode: v.chargeCode});
        });
        this.tollSrv.deleteTollinfo({data: this.deleteId}).subscribe(
          value => {
            if (value.status === '1000') {
              this.toolSrv.setToast('success', '操作成功', '添加成功' + value.message);
              this.clearData();
              this.tollInitialization();
            } else {
              this.toolSrv.setToast('error', '操作错误', '删除失败,' + value.message);
            }
          }
        );
      });
    }
  }

  // show Detail Dialog
  public toolDetailClick(e): void {
    this.tollTitle = e;
    this.detailTollTitle.forEach( v => {
      v.value = e[v.field];
    });
    this.getTollDetailInfo(e.chargeCode, 'detail');


    // this.tollSrv.queryTollinfoDetail({chargeCode: e.chargeCode}).subscribe(
    //   value => {
    //     value.data.forEach( v => {
    //       this.tollModifyDatas.push(this.tollModifyData);
    //       this.tollModifyData = new ModifyTollDrop();
    //     });
    //   }
    // );
    // this.tollDetailDialog = true;
  }

  // Reset data
  public clearData(): void {
    this.tollAdd = [];
    this.tollMoreInfo = [];
    this.tollAddinfo = new AddToll();
    this.tollTitle = new BfTollTitle();
    this.tollSelect = [];
    this.tollModifyData = new ModifyTollDrop();
    this.tollModifyDatas = [];
    this.modifytoll = [];
    this.ids = [];
    this.tollmustpayMedify = null;
    this.tollrefundMedify = null;
    this.tollEnableMedify = null;
    this.tollChargeTypeMedify = null;
  }

  // Add a piece of data
  public addMoreTollClick(): void {
    this.tollMoreInfo.push({
      areaMin: '',
      areaMax: '',
      money: '',
      datedif: '',
      discount: '10',
      parkingSpacePlace: '',
      parkingSpaceType: ''
    });
    this.tollModifyData.datedif = '请选择月数';
    this.tollModifyData.parkingSpaceNature = '请选择车位性质';
    this.tollModifyData.parkingSpaceType = '请选择车位类型';
    this.tollModifyDatas.push(this.tollModifyData);
  }

  // delete moreTollMore
  public deleteTollMoreClick(index): void {
    if (index + 1 > this.ids.length) {
      this.tollMoreInfo.splice(index, 1);
    } else {
      this.tollSrv.deleteTollList({id: this.ids[index]}).subscribe(
        value => {
          if (value.status === '1000') {
            this.ids.splice(index, 1);
            this.tollMoreInfo.splice(index, 1);
          } else {
            this.toolSrv.setToast('error', '删除失败', value.message);
          }
        }
      );
    }
  }

  // set tollTitledata
  public settollTitleData(): void {
    this.tollTitle.chargeCode = '';
    this.tollTitle.enable = '';
    this.tollTitle.chargeType = '';
    this.tollTitle.refund = '';
    this.tollTitle.chargeUnit = '';
    this.tollTitle.chargeStandard = '';
    this.tollTitle.chargeName = '';
    this.tollTitle.id = '';
  }

  // paging query
  public nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.NOW_PAGE = event;
    if (this.searchInputData !== '') {
      this.queryTollByChangeName();
    } else {
      this.queryTollPageData();
    }
    this.tollSelect = [];
  }

  public queryTollPageData(): void {
    this.tollSrv.queryBfTollPageInfo({pageNo: this.NOW_PAGE, pageSize: 10}).subscribe(
      value => {
        if (value.status === '1000') {
          value.data.contents.forEach(v => {
            v.chargeType = this.toolSrv.setValueToLabel(this.chargeTypeOption, v.chargeType);
            v.enable = this.toolSrv.setValueToLabel(this.enableOption, v.enable);
            v.refund = this.toolSrv.setValueToLabel(this.refundOption, v.refund);
            v.mustPay = this.toolSrv.setValueToLabel(this.mustPayOption, v.mustPay);
          });
          this.tollTableContent = value.data.contents;
          this.setTableOption(value.data.contents);
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        }
      }
    );
  }

  // 条件查询
  public  queryTollByChangeName(): void {
    this.tollSrv.queryTollForChargeName({pageNo: this.NOW_PAGE, pageSize: 10, chargeName: this.searchInputData}).subscribe(
      value => {
        if (value.status === '1000') {
          value.data.contents.forEach(v => {
            v.chargeType = this.toolSrv.setValueToLabel(this.chargeTypeOption, v.chargeType);
            v.enable = this.toolSrv.setValueToLabel(this.enableOption, v.enable);
            v.refund = this.toolSrv.setValueToLabel(this.refundOption, v.refund);
            v.mustPay = this.toolSrv.setValueToLabel(this.mustPayOption, v.mustPay);
          });
          this.tollTableContent = value.data.contents;
          this.setTableOption(value.data.contents);
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        }
      }
    );
  }

  // select data (选择数据)
  public selectData(e): void {
    this.tollSelect = e;
  }

  // set table data （设置列表数据）
  public setTableOption(data1): void {
    this.tableOption = {
      width: '100%',
      header: {
        data: [
          {field: 'chargeCode', header: '项目编号'},
          {field: 'chargeName', header: '项目名称'},
          {field: 'chargeType', header: '项目类型'},
          {field: 'chargeStandard', header: '收费单价'},
          {field: 'chargeUnit', header: '收费单位'},
          {field: 'enable', header: '是否启用'},
          {field: 'operating', header: '操作'},
        ],
        style: {background: this.table.tableheader.background, color: this.table.tableheader.color, height: '6vh'}
      },
      Content: {
        data: data1,
        styleone: {
          background: this.table.tableContent[0].background,
          color: this.table.tableContent[0].color,
          textAlign: 'center',
          height: '2vw'
        },
        styletwo: {
          background: this.table.tableContent[1].background,
          color: this.table.tableContent[1].color,
          textAlign: 'center',
          height: '2vw'
        },
      },
      type: 2,
      tableList: [{label: '详情', color: this.table.detailBtn}]
    };
  }

  // 收费项目详情信息查询
  public getTollDetailInfo(data, type): void {
    this.tollSrv.getTolldetail({chargeCode: data}).subscribe(
      value => {
        console.log(value);
        if (value.status === '1000') {
          if (type === 'detail') {
            this.detailTollList = value.data.chargeDetail.map( v => {
              v.datedif = this.toolSrv.setValueToLabel(this.datedifOption, v.datedif);
              v.parkingSpacePlace = this.toolSrv.setValueToLabel(this.parkingSpacePlaceOption, v.parkingSpacePlace);
              v.parkingSpaceType = this.toolSrv.setValueToLabel(this.parkingSpaceTypeOption, v.parkingSpaceType);
              return v;
            });
            this.tollDetailDialog = true;
          } else {
            value.data.chargeDetail.forEach( v => {
              this.ids.push(v.id);
            });
            this.tollMoreInfo =   value.data.chargeDetail;
            this.tollTitle = value.data.chargeItem;
            this.tollTitle.chargeType = this.tollTitle.chargeType.toString();
            this.tollTitle.refund = this.tollTitle.refund.toString();
            this.tollTitle.enable = this.tollTitle.enable.toString();
            this.tollTitle.mustPay = this.tollTitle.mustPay.toString();
            this.tollModifyDialog = true;
            // console.log(this.tollMoreInfo);
          }
        } else {
          this.toolSrv.setToast('error', '请求错误', value.message);
        }
      }
    );
  }

  public  setBtnIsHidden(): void {
    this.localSrv.getObject('btnParentCodeList').forEach(v => {
      if (v.label === '收费项目') {
        this.globalSrv.getChildrenRouter({parentCode: v.parentCode}).subscribe(value => {
          console.log(value);
          value.data.forEach( v => {
            this.btnHiden.forEach( val => {
              if (v.title === val.label) {
                val.hidden = false;
              }
            });
          });
        });
      }
    });
  }
}
