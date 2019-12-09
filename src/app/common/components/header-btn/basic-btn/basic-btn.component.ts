import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {BtnList, BtnOption} from '../headerData.model';

@Component({
  selector: 'rbi-basic-btn',
  templateUrl: './basic-btn.component.html',
  styleUrls: ['./basic-btn.component.less']
})
export class BasicBtnComponent implements OnInit, OnChanges {

  @Input()
  public btnOption: BtnOption;
  @Output()
  public event = new EventEmitter<any>();
  @Output()
  public searchEvent = new EventEmitter<any>();
  public searchOption = [
    {label: '手机号', value: 1},
    {label: '房间号', value: 2},
    {label: '姓名', value: 3},
    {label: '身份证号', value: 4},
  ];
  // public  SearchOption = {
  //   village: [],
  //   region: [],
  //   building: [],
  // };
  public searchType = 0;
  public serchData = '';
  constructor() { }
  ngOnInit() {
  }

  public  eventClick(e): void {
     this.event.emit(e);
  }
  public  SearchClick(): void {
      this.searchEvent.emit({type: this.searchType, value: this.serchData});
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.btnOption);
  }
}
