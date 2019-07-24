import { Component, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {LoginoutService} from '../common/services/loginout.service';
import {LocalStorageService} from '../common/services/local-storage.service';
import {Router} from '@angular/router';
import {PersionalService} from '../common/services/persional.service';
import {Persional} from '../common/model/persional.model';

@Component({
  selector: 'rbi-persional',
  templateUrl: './persional.component.html',
  styleUrls: ['./persional.component.less']
})
export class PersionalComponent implements OnInit {

  public passwordHidden: boolean;
  public cleanTimer: any; // 清除时钟
  public changeUserInfo: Persional = new Persional();
  public esDate = {
    firstDayOfWeek: 0,
    dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dayNamesMin: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    today: '今天',
    clear: '清除'
  };
  public educationalOption: any[] = [];
  public educationalName: any;
  public btnName = '修改密码';
  public btnColor = { background : '#66A6BD'};
  public ChangePassword = {
    oldpsw: '',
    newpsw: '',
    surepsw: '',
  };

  constructor(
    private confirmationService: ConfirmationService,
    private loginOutSrv: LoginoutService,
    private localSrv: LocalStorageService,
    private router: Router,
    private persionSrv: PersionalService,
    private messageService: MessageService,

  ) { }

  ngOnInit() {
    this.persionalInit();
    this.passwordHidden = true;
  }
  public persionalInit(): void {
    this.persionSrv.getUserInfo().subscribe(
        value => {
          console.log(value);
          if (value.status === '1000') {
            this.changeUserInfo = value.data;
            this.persionSrv.queryStaffStatus({settingType: 'EDUCATIONAL_BACKGROUND'}).subscribe(
              val => {
                console.log(val.data.length);
                if (val.data.length > 0) {
                  val.data.forEach( v => {
                    this.educationalOption.push({label: v.settingName, value: v.settingCode});
                    if (this.changeUserInfo.educationalBackground === v.settingCode) {
                      this.educationalName = v.settingName;
                    }
                  });
                }
              }
            );
          } else {
            this.setToast('error', '请求失败', value.message);
          }
        }
      );

  }
  // change user info
  public  changeUserInfoClick(): void {
    // this.
  }
  // submit user info
  public  changeUserInfoSubmitClick(): void {
    this.persionSrv.updateUserInfo(this.changeUserInfo).subscribe(
      value => {
        console.log(value);
        if (value.status === '1000') {
          this.setToast('success', '修改成功', '修改成功');
        } else {
          this.setToast('error', '修改失败', value.message);

        }
      }
    );
  }
  // login out
  public  loginOutClick(): void {
    this.confirmationService.confirm({
      message: `确认要退出登录吗？`,
      header: '退出提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loginOutSrv.logout({}).subscribe(
          (value) => {
            console.log(value);
            if (value.status === '1000') {
              this.localSrv.remove('appkey');
              this.router.navigate(['/login']);
            } else {
              window.alert(value.message);
            }
          }
        );
        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
      }
    });
  }
  // change Pssword
  public  changePasswordClick(): void {
    if (this.passwordHidden === true) {
      this.passwordHidden = false;
    } else {
      this.passwordHidden = true;
    }
  }
  // back
  public  backClick(): void {
      window.history.back();
  }
  public  changePasswordSubmitClick(): void {
    if (this.passwordHidden === true) {
      this.btnColor = { background : '#D9534F'};
      this.btnName = '提交';
      this.passwordHidden = false;
    } else {
        if (this.ChangePassword.newpsw === this.ChangePassword.surepsw) {
          this.changeUserInfo.password = this.ChangePassword.oldpsw;
          this.changeUserInfo.newPassword = this.ChangePassword.newpsw;
          this.persionSrv.updatePasswordInfo(this.changeUserInfo).subscribe(
            value => {
              if (value.status === '1000') {
                this.setToast('success', '', '修改成功');
                this.ChangePassword = {
                  newpsw: '',
                  oldpsw: '',
                  surepsw: '',
                };
                this.btnColor = { background : '#66A6BD'};
                this.btnName = '修改密码';
                this.passwordHidden = true;
              } else {
                this.setToast('error', '修改失败', value.message);
              }
            }
          );
        } else {
          this.setToast('error', '修改失败', '两次密码输入不一致');
        }
    }
  }

  // set Toast
  public setToast(type, title, message): void {
    if (this.cleanTimer) {
      clearTimeout(this.cleanTimer);
    }
    this.messageService.clear();
    this.messageService.add({severity: type, summary: title, detail: message});
    this.cleanTimer = setTimeout(() => {
      this.messageService.clear();
    }, 3000);
  }

}
