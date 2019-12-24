import {Injectable} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {GlobalService} from '../services/global.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ThemeService} from './theme.service';

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
  // 判断为手机号码
  public verifyPhone: RegExp = /^1[37458]\d{9}$/;
  // 判断不能为空
  public verifyNull: RegExp = /s/;
  // 判断为汉字
  public verifyName: RegExp =  /[\u4e00-\u9fa5]/;
  // 判断身份证
  public verifyIdNumber: RegExp = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|31)|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/;
  public verifyIdNumber1: RegExp = /^((\s?[A-Za-z])|([A-Za-z]{2}))\d{6}(\([0−9aA]\)|[0-9aA])$/;   // 香港
  public verifyIdNumber2: RegExp = /^[a-zA-Z][0-9]{9}$/; // 台湾
  public verifyIdNumber3: RegExp = /^[1|5|7][0-9]{6}\([0-9Aa]\)/; // 澳门
  // 默认主题
  public defaultTheme = [
    {label: '--bgc-theme', value: '#33353C'},
    {label: '--body-bgc', value: '#25242A'},
    {label: '--ft-sidebar-theme', value: '#8F9198'},
    {label: '--ft-sidebar-hover-theme', value: '#3A79DD'},
    {label: '--bgc-sidbarMunu', value: '#3A7ADF'},
    {label: '--footer-bgc', value: '#33353C'},
    {label: '--footer-ft', value: '#fff'},
    {label: '--mokuai-bgc', value: '#33353C'},
    {label: '--table-detail', value: '#6A72A1'},
    {label: '--paging-bgc', value: '#33353C'},
    {label: '--paging-ft', value: '#fff'},
    {label: '--paging-input', value: 'rgba(255,255,235,0.5)'},
    {label: '--header-bgc', value: '#33353C'},
    {label: '--main-event-item', value: '#646464'},
    {label: '--main-event-ft', value: '#DEDEDE'},
    {label: '--main-bgc', value: '#33353C'},
    {label: '--main-title', value: '#E6E6E7'},
    {label: '--main-box-shodow', value: '#33353C'},
  ];
  public defaultData = {
    siderbar: {ft: '#8F9198', ftHover: '#3A79DD'},
    headerbar: {ft: '#fff', ftHover: '#3A79DD'},
    main: {
      table: {
        header: {background: '#33353C', color: '#DEDEDE'},
        content: [{background: '#55545A', color: '#DEDEDE'},
          {background: '#646464', color: '#DEDEDE'}],
      },
      bar: {
        background: '#33353C',
        tipcolor: '#333',
        axislineColor: '#ccc',
        axislabelColor: '#ccc',
        lineGradientColor: ['#5194D8', '#133E64'],
        linebgc: '#4D4C52'
      },
      pie: {
        background: '#33353C',
        colorList: ['#5699E0', '#1F6EC0', '#1D65AD', '#17528F', '#103B63'],
        legendcolor: '#ccc',
        labelColor: 'rgba(255, 255, 255, 0.7)',
        labelLineColor: 'rgba(255, 255, 255, 0.3)',
        itemStyle: '#5699E0',
        itemShodow: 'rgba(0, 0, 0, 0.5)'
      }
    },
    table: {
      header: {background: '#282A31', color: '#DEDEDE'},
      content: [{background: '#33353C', color: '#DEDEDE'},
        {background: '#2E3037', color: '#DEDEDE'}],
      detailBtn: '#6A72A1'
    }
  };
  public greenTheme = [
    {label: '--bgc-theme', value: '#55AA80'},
    {label: '--body-bgc', value: '#CBCBCB'},
    {label: '--ft-sidebar-theme', value: '#fff'},
    {label: '--ft-sidebar-hover-theme', value: '#000'},
    {label: '--bgc-sidbarMunu', value: '#365244'},
    {label: '--footer-bgc', value: '#fff'},
    {label: '--footer-ft', value: '#000'},
    {label: '--mokuai-bgc', value: '#F5F5F5'},
    {label: '--table-detail', value: '#6AB993'},
    {label: '--paging-bgc', value: '#F5F5F5'},
    {label: '--paging-ft', value: '#000'},
    {label: '--paging-input', value: 'rgba(3,3,3,0.5)'},
    {label: '--header-bgc', value: '#4B9D76'},
    {label: '--main-event-item', value: '#DBF3E6'},
    {label: '--main-event-ft', value: '#000'},
    {label: '--main-bgc', value: '#F5F5F5'},
    {label: '--main-title', value: '#55AA80'},
    {label: '--main-box-shodow', value: '#5E6372'},
  ];
  public greenData  = {
    siderbar: {ft: '#fff', ftHover: '#000'},
    headerbar: {ft: '#fff', ftHover: '#000'},
    main: {
      table: {
        header: {background: '#55AA80', color: '#fff'},
        content: [{background: '#F5F5F5', color: '#000'},
          {background: '#DBF3E6', color: '#000'}],
      },
      bar: {
        background: '#F5F5F5',
        tipcolor: '#80BFA0',
        axislineColor: '#000',
        axislabelColor: '#000',
        lineGradientColor: ['#83E0B3', '#3D6A55'],
        linebgc: '#95C1AD'
      },
      pie: {
        background: '#F5F5F5',
        colorList: ['#57e1d6', '#21c3b4', '#1eb3a6', '#17897f', '#11645d'],
        legendcolor: '#80BFA0',
        labelColor: 'rgba(10, 20, 10, 1)',
        labelLineColor: 'rgba(20, 10, 10, 1)',
        itemStyle: '#4A886A',
        itemShodow: 'rgba(198, 227, 213, 0.5)'
      }
    },
    table: {
      header: {background: '#55AA80', color: '#fff'},
      content: [{background: '#F5F5F5', color: '#000'},
        {background: '#DBF3E6', color: '#000'}],
      detailBtn: '#6AB993'
    }
  };
  public blueTheme = [
    {label: '--bgc-theme', value: '#2581D6'},
    {label: '--body-bgc', value: '#E4E4E4'},
    {label: '--ft-sidebar-theme', value: '#fff'},
    {label: '--ft-sidebar-hover-theme', value: '#000'},
    {label: '--bgc-sidbarMunu', value: '#12406A'},
    {label: '--footer-bgc', value: '#fff'},
    {label: '--footer-ft', value: '#000'},
    {label: '--mokuai-bgc', value: '#F5F5F5'},
    {label: '--table-detail', value: '#5DA2E3'},
    {label: '--paging-bgc', value: '#F5F5F5'},
    {label: '--paging-ft', value: '#000'},
    {label: '--paging-input', value: 'rgba(3,3,3,0.5)'},
    {label: '--header-bgc', value: '#2073BF'},
    {label: '--main-event-item', value: '#D0D0D0'},
    {label: '--main-event-ft', value: '#000'},
    {label: '--main-bgc', value: '#F5F5F5'},
    {label: '--main-title', value: '#2580D7'},
    {label: '--main-box-shodow', value: '#5E6372'},
  ];
  public blueData  = {
    siderbar: {ft: '#fff', ftHover: '#000'},
    headerbar: {ft: '#fff', ftHover: '#000'},
    main: {
      table: {
        header: {background: '#2581D6', color: '#fff'},
        content: [{background: '#F5F5F5', color: '#000'},
          {background: '#D9E7F2', color: '#000'}],
      },
      bar: {
        background: '#F5F5F5',
        tipcolor: '#333',
        axislineColor: '#000',
        axislabelColor: '#000',
        lineGradientColor: ['#5194D8', '#133E64'],
        linebgc: '#D0D0D0'
      },
      pie: {
        background: '#F5F5F5',
        colorList: ['#5699E0', '#216FC2', '#1C5EA8', '#184F8B', '#113661'],
        legendcolor: '#ccc',
        labelColor: 'rgba(0, 0, 0, 0.7)',
        labelLineColor: 'rgba(0, 0, 0, 0.3)',
        itemStyle: '#5699E0',
        itemShodow: '#F3F3F3'
      }

    },
    table: {
      header: {background: '#2581D6', color: '#fff'},
      content: [{background: '#F5F5F5', color: '#000'}, {background: '#D9E7F2', color: '#000'}],
      detailBtn: '#5DA2E3'
    }
  };
  public PinkTheme = [
    {label: '--bgc-theme', value: '#DEA8A8'},
    {label: '--body-bgc', value: '#E4E4E4'},
    {label: '--ft-sidebar-theme', value: '#fff'},
    {label: '--ft-sidebar-hover-theme', value: '#000'},
    {label: '--bgc-sidbarMunu', value: '#343434'},
    {label: '--footer-bgc', value: '#fff'},
    {label: '--footer-ft', value: '#000'},
    {label: '--mokuai-bgc', value: '#F5F5F5'},
    {label: '--table-detail', value: '#F09898'},
    {label: '--paging-bgc', value: '#F5F5F5'},
    {label: '--paging-ft', value: '#000'},
    {label: '--paging-input', value: 'rgba(3,3,3,0.5)'},
    {label: '--header-bgc', value: '#B48181'},
    {label: '--main-event-item', value: '#DBDBDB'},
    {label: '--main-event-ft', value: '#000'},
    {label: '--main-bgc', value: '#F5F5F5'},
    {label: '--main-title', value: '#DEA8A8'},
    {label: '--main-box-shodow', value: '#5E6372'},
  ];
  public PinkData  = {
    siderbar: {ft: '#fff', ftHover: '#000'},
    headerbar: {ft: '#fff', ftHover: '#000'},
    main: {
      table: {
        header: {background: '#DEA8A8', color: '#fff'},
        content: [{background: '#F5F5F5', color: '#000'},
          {background: '#F3E2E2', color: '#000'}],
      },
      bar: {
        background: '#F5F5F5',
        tipcolor: '#333',
        axislineColor: '#000',
        axislabelColor: '#000',
        lineGradientColor: ['#DAA4A4', '#5F3138'],
        linebgc: '#D0D0D0'
      },
      pie: {
        background: '#F5F5F5',
        colorList: ['#C97B85', '#A54C58', '#A94D58', '#984651', '#5F2F36'],
        legendcolor: '#ccc',
        labelColor: 'rgba(0, 0, 0, 0.7)',
        labelLineColor: 'rgba(0, 0, 0, 0.3)',
        itemStyle: '#7F3D47',
        itemShodow: '#F3F3F3'
      }

    },
    table: {
      header: {background: '#DEA8A8', color: '#fff'},
      content: [{background: '#F5F5F5', color: '#000'}, {background: '#EDDBDB', color: '#000'}],
      detailBtn: '#F09898'
    }
  };
  public brownTheme = [
    {label: '--bgc-theme', value: '#CF8D73'},
    {label: '--body-bgc', value: '#E4E4E4'},
    {label: '--ft-sidebar-theme', value: '#fff'},
    {label: '--ft-sidebar-hover-theme', value: '#000'},
    {label: '--bgc-sidbarMunu', value: '#343434'},
    {label: '--footer-bgc', value: '#fff'},
    {label: '--footer-ft', value: '#000'},
    {label: '--mokuai-bgc', value: '#F5F5F5'},
    {label: '--table-detail', value: '#EDB4A2'},
    {label: '--paging-bgc', value: '#F5F5F5'},
    {label: '--paging-ft', value: '#000'},
    {label: '--paging-input', value: 'rgba(3,3,3,0.5)'},
    {label: '--header-bgc', value: '#AD745D'},
    {label: '--main-event-item', value: '#DBDBDB'},
    {label: '--main-event-ft', value: '#000'},
    {label: '--main-bgc', value: '#F5F5F5'},
    {label: '--main-title', value: '#CF8D73'},
    {label: '--main-box-shodow', value: '#5E6372'},
  ];
  public brownData  = {
    siderbar: {ft: '#fff', ftHover: '#000'},
    headerbar: {ft: '#fff', ftHover: '#000'},
    main: {
      table: {
        header: {background: '#CF8D73', color: '#fff'},
        content: [{background: '#F5F5F5', color: '#000'},
          {background: '#EFD9D0', color: '#000'}],
      },
      bar: {
        background: '#F5F5F5',
        tipcolor: '#333',
        axislineColor: '#000',
        axislabelColor: '#000',
        lineGradientColor: ['#CB8A70', '#592921'],
        linebgc: '#D0D0D0'
      },
      pie: {
        background: '#F5F5F5',
        colorList: ['#C97C6E', '#A44B3B', '#924133', '#78362B', '#56271F'],
        legendcolor: '#ccc',
        labelColor: 'rgba(0, 0, 0, 0.7)',
        labelLineColor: 'rgba(0, 0, 0, 0.3)',
        itemStyle: '#944234',
        itemShodow: '#F3F3F3'
      }

    },
    table: {
      header: {background: '#CF8D73', color: '#fff'},
      content: [{background: '#F5F5F5', color: '#000'}, {background: '#E8D2CA', color: '#000'}],
      detailBtn: '#EDB4A2'
    }
  };
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private globalSrv: GlobalService,
    private themeSrv: ThemeService) { }
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

  public  changeTheme(themeName): void {
    switch (themeName) {
      case 'default': this.setTheme(this.defaultTheme, this.defaultData); break;
      case 'green': this.setTheme(this.greenTheme, this.greenData); break;
      case 'blue': this.setTheme(this.blueTheme, this.blueData); break;
      case 'pink': this.setTheme(this.PinkTheme, this.PinkData); break;
      case 'brown': this.setTheme(this.brownTheme, this.brownData); break;
    }

  }

  public  setTheme(list, data): void {
    for (const item of list) {
      document.documentElement.style.setProperty(item.label, item.value);
    }
    this.themeSrv.emitChangeTheme(data);
  }
}
