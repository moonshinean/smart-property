import { Component, OnInit } from '@angular/core';
import {LoginService} from '../common/services/login.service';
import {Router} from '@angular/router';
import {LocalStorageService} from '../common/services/local-storage.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {PublicMethedService} from '../common/public/public-methed.service';

@Component({
  selector: 'rbi-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  public username: any;
  public password: any;
  public item: any[] = [];
  public loadHidden = true;
  public cleanTimer: any; // 清除时钟

  constructor(
    public loginSrv: LoginService,
    private route: Router,
    private localSessionStorage: LocalStorageService,
    private toolSrv: PublicMethedService,
  ) { }

  ngOnInit() {
  }

  // user login
  public  userLoginClick(): void {
    // this.loadHidden = false;
    this.loginSrv.login({username: this.username, password: this.password , module: 'CLOUD_HOUSE_WEB'}).subscribe(
      (value) => {
        console.log(value);
        this.loadHidden = true;
        if (value.status === '1000') {

          this.localSessionStorage.set('appkey', value.data.token);
          value.data.permitDTOS.forEach( v => {
            // console.log(v);
            this.item.push({permisCode: v.permisCode , title: v.title});
          });
          this.localSessionStorage.setObject('item', this.item);
          this.localSessionStorage.setObject('sidebarItem', 1);

          this.route.navigate(['/home/main']);
          // console.log(this.localSessionStorage.get('appkey'));
        } else {
          this.toolSrv.setToast('error', '登录失败', value.message);
        }
      }
    );
  }
  // get username
  public  getUsername(e): void {
      // console.log(e.target.value);
      this.username = e.target.value;
  }
  // get password
  public  getPassword(e): void {
    // console.log(e.target.value +'mima');
    this.password = e.target.value;
  }

}
