import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MainService} from '../../../common/services/main.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {ThemeService} from '../../../common/public/theme.service';


@Component({
  selector: 'rbi-main-event',
  templateUrl: './main-event.component.html',
  styleUrls: ['./main-event.component.less'],
})
export class MainEventComponent implements OnInit {

  public eventdata: any;
  public option: any;
  public eventOption: any[] = [];
  public cols = [
    {field: 'eventCode', header: '事件编号'},
    {field: 'eventName', header: '事件名称'},
    {field: 'eventDescripte', header: '事件描述'},
    {field: 'eventType', header: '事件类型'},
    {field: 'occurTime', header: '发生时间'}
  ];
  public table = {
    tableheader: {background: '', color: ''},
    tableContent: [
      {background: '', color: ''},
      {background: '', color: ''}],
    detailBtn: ''
  };
  constructor(
    private mainSrv: MainService,
    private toolSrv: PublicMethedService,
    private themeSrv: ThemeService,
  ) {
    this.themeSrv.changeEmitted$.subscribe(
      value => {
        this.table.tableheader = value.main.table.header;
        this.table.tableContent = value.main.table.content;
        this.setTableOption(this.eventdata);
      }
    );
  }

  ngOnInit() {
    if (this.themeSrv.setTheme !== undefined) {
      console.log(this.themeSrv.setTheme);
      this.table.tableheader = this.themeSrv.setTheme.main.table.header;
      this.table.tableContent = this.themeSrv.setTheme.main.table.content;
    }
    // this.
    this.toolSrv.getAdmStatus([{settingType: 'EVENT_TYPE'}], (data) => {
      console.log(data);
      this.eventOption = this.toolSrv.setListMap(data.EVENT_TYPE);
      this.queryEventData();
    });

    // this.styleHeader = { background: '#33353C', color: '#DEDEDE', height: '6vh'};

  }

  public  setTableOption(data1): void {
    this.option = {
      width: '101.5%',
      tableHeader: {
        data: this.cols,
        style: {background: this.table.tableheader.background, color: this.table.tableheader.color, height: '6vh'}
      },
      tableContent: {
        data: data1,
        styleone: {background: this.table.tableContent[0].background, color: this.table.tableContent[0].color, textAlign: 'center', height: '2vw'},
        styletwo: {background: this.table.tableContent[1].background, color: this.table.tableContent[1].color, textAlign: 'center', height: '2vw'},
      }
    };
  }

  public  queryEventData(): void {
    this.mainSrv.getEvent({pageNo: 1, pageSize: 25}).subscribe(
      value => {
        console.log(value);
        if (value.status === '1000') {
          value.data.contents.forEach(v => {
            v.eventType = this.toolSrv.setValueToLabel(this.eventOption, v.eventType);
          });
          this.eventdata = value.data.contents;
          this.setTableOption(value.data.contents);
        }
      });
  }
}
