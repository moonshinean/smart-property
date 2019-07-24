import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'rbi-baseinfo',
  templateUrl: './baseinfo.component.html',
  styleUrls: ['./baseinfo.component.less']
})
export class BaseinfoComponent implements OnInit {
  constructor(
    private routerInfo: ActivatedRoute
  ) { }

  ngOnInit() {

  }

}
