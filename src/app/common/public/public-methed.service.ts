import { Injectable } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/primeng';
import {LoginService} from '../services/login.service';
import {GlobalService} from '../services/global.service';
import {elementDef} from '@angular/core/src/view';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PublicMethedService {

  private cleanTimer: any;
  private dataList: any[] =[];
  private dataName = null;
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
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private globalSrv: GlobalService) { }
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

  /**
   * get Admin Status
   * @param parameter  (Request parameter)
   * @param callback
   */
  public  getAdminStatus(parameter, callback: (...args: any[]) => any): void {
    this.globalSrv.queryAdminStatus({settingType: parameter}).subscribe(
      value => {
        this.setQuestJudgment(value.status, value.message, () => {
          callback(value.data);
        });
      }
    );
  }

  /**
   * get Native Status
   * @param parameter (Request parameter)
   * @param callback
   */
  public  getNativeStatus(parameter, callback: (...args: any[]) => any): void {
    this.globalSrv.queryNativeStatus({settingType: parameter}).subscribe(
      value => {
        this.setQuestJudgment(value.status, value.message, () => {
          callback(value.data);
        });
      }
    );
  }

  /**
   * Set the data format
   * @param list  (getNatiuveStatus(getAdminStatus) result list)
   * @param status (Status value)
   * @param callback
   */
  public  setDataFormat(list: any[], status: any, callback: (...args: any[]) => any): void {
    this.dataList = [];
    list.forEach( v => {
       this.dataList.push({label: v.settingName, value: v.settingCode});
       if (status !== '' && status !== null) {
         if (status.toString() === v.settingCode) {
           this.dataName = v.settingName;
         }
       } else {
         this.dataName = null;
       }
       if (list.indexOf(v) === list.length - 1) {
          callback(this.dataList, this.dataName);
        }
     });
  }

  public  setConfirmation(title, message, callback: (...args: any[]) => any): void {
    this.confirmationService.confirm({
      message: `确认要${message}吗？`,
      header: `${title}` + `提醒`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        callback();
      },
      reject: () => {
      }
    });
  }

  /**
   *   Create formGroup
   * @param data
   */
  public  setFormGroup(data): any {
    const group: any = {};
    data.forEach( val => {
      if (val.disabled) {
        group[val.key] = new FormControl({value: val.value || '', disabled: true});
      } else {
        group[val.key] = new FormControl({value: val.value || '', disabled: false});
      }
      if (val.required) {
        group[val.key].validator = Validators.required;
      }
    });
    return new FormGroup(group);
  }

  /**
   * set Toast
   * @param status
   * @param message
   * @param callback
   */
  public  setQuestJudgment(status, message, callback: (...args: any[]) => any): void {
    if (status === '1000') {
      this.setToast('success', '操作成功', message);
      callback();
    } else {
      this.setToast('error', '操作失败', message);
    }
    // switch (status) {
    //   case '1000': this.setToast('success', '操作成功', '请求成功'); callback(); break;
    //   case '1001': this.setToast('error', '请求失败', '请求参数不能为空'); break;
    //   case '1002': this.setToast('error', '请求失败', '服务器处理失败'); break;
    //   case '1003': this.setToast('error', '请求失败', '拒绝访问'); break;
    //   case '1004': this.setToast('error', '请求失败', '用户名或密码错误'); break;
    //   case '1005': this.setToast('error', '请求失败', '用户名不存在'); break;
    //   case '1006': this.setToast('error', '请求失败', '第三方处理失败'); break;
    //   case '1007': this.setToast('error', '请求失败', '服务器未响应'); break;
    //   case '1008': this.setToast('error', '请求失败', '原始密码不匹配'); break;
    // }
  }

  /**
   * 数九转换
   * @param data
   * @param label
   */
  public  dataConversion(data, label): any {
    data.forEach( v => {
      if (label.toString() === v.settingCode) {
        label = v.settingName;
      }
    });
    return label;
  }
}
