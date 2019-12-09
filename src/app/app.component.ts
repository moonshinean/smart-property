import {Component, OnInit} from '@angular/core';
import {PublicMethedService} from './common/public/public-methed.service';
import {LocalStorageService} from './common/services/local-storage.service';

@Component({
  selector: 'rbi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  public themeFlag = 0;
  constructor(
    private toolSrv: PublicMethedService,
    private localSrv: LocalStorageService,
  ) {
  }
  ngOnInit(): void {
    if (this.localSrv.getObject('theme').value) {
      this.toolSrv.changeTheme(this.localSrv.getObject('theme').value);
      this.themeFlag = this.localSrv.getObject('theme').flag;
    } else {
      this.toolSrv.changeTheme('green');
    }
  }
}
