import {Injectable} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {GlobalService} from '../services/global.service';
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
  public verifyPhone: RegExp = /^1[37458]\d{9}$/;
  public verifyIdNumber: RegExp = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|31)|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/;
  public verifyIdNumber1: RegExp = /^((\s?[A-Za-z])|([A-Za-z]{2}))\d{6}(\([0−9aA]\)|[0-9aA])$/;   // 香港
  public verifyIdNumber2: RegExp = /^[a-zA-Z][0-9]{9}$/; // 台湾
  public verifyIdNumber3: RegExp = /^[1|5|7][0-9]{6}\([0-9Aa]\)/; // 澳门
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
  public  getAdmStatus(parameter: any[], callback: (...args: any[]) => any): void {
    this.globalSrv.queryAdminchoose({data: parameter}).subscribe(
      value => {
        this.setQuestJudgment(value.status, value.message, () => {
          callback(value.data);
        });
      }
    );
  }

  /**
   * 组装列表
   * @param list
   */
  public  setListMap(list): any {
    return list.map(v => {
       return {label: v.settingName, value: v.settingCode};
     });
  }
  /**
   * get Native Status
   * @param parameter (Request parameter)
   * @param callback
   */
  public  getNatStatus(parameter, callback: (...args: any[]) => any): void {
    this.globalSrv.queryNatchoose({data: parameter}).subscribe(
      value => {
        this.setQuestJudgment(value.status, value.message, () => {
          callback(value.data);
        });
      }
    );
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
   * 将值装换位字母
   * @param list
   * @param data
   */
  public setValueToLabel(list: any[], data: any): any {
    // console.log(data);
    if (data !== null && data !== '' && data !== undefined) {
      list.forEach(v => {
        if (data.toString() === v.value) {
          data =  v.label;
        }
      });
    }
    return data;
  }

  /**
   * 将字母转换为值
   * @param list
   * @param data
   */
  public setLabelToValue(list: any[], data: any): any {
    list.forEach(v => {
      if (data === v.label) {
        data =  v.value;
      }
    });
    return data;
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
