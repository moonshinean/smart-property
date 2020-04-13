import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LoginService} from '../common/services/login.service';
import {Router} from '@angular/router';
import {LocalStorageService} from '../common/services/local-storage.service';
import {PublicMethedService} from '../common/public/public-methed.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EventManager} from '@angular/platform-browser';
import {C} from '@angular/cdk/typings/keycodes';

@Component({
  selector: 'rbi-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit{

  public item: any[] = [];
  public loadHidden = true;
  public userLogin: FormGroup;
  public btnClickFlag = 0;
  public themeList = [
    {label: '自然绿', value: 'green'},
    {label: '天空蓝', value: 'blue'},
    {label: '简约粉', value: 'pink'},
    {label: '深沉棕', value: 'brown'},
    {label: '经典黑', value: 'default'},
  ];
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
    });
    if (!(this.isOrTrue('username') && this.isOrTrue('password'))) {
      this.userLogin.setValue( {username: this.localSessionStorage.get('username'), password: this.localSessionStorage.get('password')});
    }
    // this.localSessionStorage.clear();
  }
  // user click event
  public  userLoginClick(user): void {
    if (!this.userLogin.invalid) {
      if (this.btnClickFlag === 0) {
        this.btnClickFlag = 1;
        this.loadHidden = false;
        this.localSessionStorage.set('username', user.value.username);
        this.localSessionStorage.set('password', user.value.password);

        this.login(user.value.username, user.value.password);
      }
    } else {
      this.toolSrv.setToast('error', '登录失败', '用户名或密码不能为空');
    }
  }
  // Login request
  public  login(userName, passWord): void {
    this.loginSrv.login({username: userName, password: passWord , module: 'CLOUD_HOUSE_WEB'}).subscribe(
      (value) => {
        console.log(value);
        this.loadHidden = true;
        this.btnClickFlag = 0;
        if (value.status === '1000') {
          this.item = [];
          this.themeList.forEach((v, index) => {
            if (v.value === value.data.userInfo.theme) {
              this.localSessionStorage.setObject('theme', {value: value.data.userInfo.theme, flag: index});
            }
          });
          this.localSessionStorage.set('appkey', value.data.token);
          value.data.permitDTOS.forEach( v => {
            // console.log(v);
            this.item.push({permisCode: v.permisCode , title: v.title});
          });
          console.log(value.data.token);
          this.localSessionStorage.setObject('item', this.item);
          this.localSessionStorage.setObject('sidebarItem', 1);
          this.route.navigate(['/home/main']);
          // this.userLogin.removeControl('username');
          // this.userLogin.removeControl('password');
        } else {

          this.toolSrv.setToast('error', '登录失败', value.message);
        }
      }
    );
  }
  // Determine if there is a username or password
  public  isOrTrue(index): any {
      if (this.localSessionStorage.get(index)) {
        return false;
      } else {
        return true;
      }
  }

}
