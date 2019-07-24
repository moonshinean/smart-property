import { Component, OnInit } from '@angular/core';
import {BfQrcodeService} from '../../../common/services/bf-qrcode.service';

@Component({
  selector: 'rbi-bf-qrcode',
  templateUrl: './bf-qrcode.component.html',
  styleUrls: ['./bf-qrcode.component.less']
})
export class BfQrcodeComponent implements OnInit {

  constructor(
    private bfQrcodeSrv: BfQrcodeService
  ) { }

  ngOnInit() {
  }

}
