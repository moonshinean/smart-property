import {Component, OnInit} from '@angular/core';
import {PublicMethedService} from './common/public/public-methed.service';
import {LoginService} from './common/services/login.service';
import {Router} from '@angular/router';
import {LocalStorageService} from './common/services/local-storage.service';

@Component({
  selector: 'rbi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  constructor(
    private toolSrv: PublicMethedService,
  ) {
  }
  ngOnInit(): void {
    this.toolSrv.changeTheme('default');
  }
}
