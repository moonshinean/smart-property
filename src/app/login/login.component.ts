import { Component, OnInit } from '@angular/core';
import {LoginService} from '../common/services/login.service';
import {Router} from '@angular/router';
import {LocalStorageService} from '../common/services/local-storage.service';
import {PublicMethedService} from '../common/public/public-methed.service';
import {FormControl, FormGroup, Validator, Validators} from '@angular/forms';

@Component({
  selector: 'rbi-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  public item: any[] = [];
  public loadHidden = true;
  // public check: any;
  public cleanTimer: any; // 清除时钟
  public userLogin: FormGroup;
  constructor(
    public loginSrv: LoginService,
    private route: Router,
    private localSessionStorage: LocalStorageService,
    private toolSrv: PublicMethedService,
  ) {
  }

  ngOnInit() {
    this.userLogin = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      // passName: new FormControl('', [Validators.required]),
      check: new FormControl(false),
    });
    if (!(this.isOrTrue('username') && this.isOrTrue('password'))) {
      this.userLogin.setValue( {check:  this.localSessionStorage.get('check'), username: this.localSessionStorage.get('username'), password: this.localSessionStorage.get('password')});
    }
  }

  // user login
  public  userLoginClick(user): void {
    // this.loadHidden = false;
    console.log(user.value.check[0]);
    this.loadHidden = false;
    if (user.value.check[0] === 1) {
      this.localSessionStorage.set('username', user.value.username);
      this.localSessionStorage.set('password', user.value.password);
      this.localSessionStorage.set('check', user.value.check[0]);
    }
    this.login(user.value.username, user.value.password);
  }

  public  login(userName, passWord): void {
    this.loginSrv.login({username: userName, password: passWord , module: 'CLOUD_HOUSE_WEB'}).subscribe(
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
  public  status(e): void {
    console.log(e);
    if (!e) {
      console.log(e);
      this.localSessionStorage.remove('check');
    }
  }
  // 判断是否存在用户名或密码
  public  isOrTrue(index): any {
      if (this.localSessionStorage.get(index)) {
        return false;
      } else {
        return true;
      }
  }

}
