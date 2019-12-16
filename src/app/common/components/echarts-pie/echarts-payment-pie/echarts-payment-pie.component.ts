import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'rbi-echarts-payment-pie',
  templateUrl: './echarts-payment-pie.component.html',
  styleUrls: ['./echarts-payment-pie.component.less']
})
export class EchartsPaymentPieComponent implements OnInit, OnChanges {

  public option: any;
  @Input()
  public datas: any;
  public totalDatas =  0;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.totalDatas =  0;
    this.datas.forEach( v => {
      this.totalDatas += v.value;
    });
    this.option = {
      color: ['#FF8352', '#E271DE', '#00FFFF', '#4AEAB0', '#31C5C0', '#5085f2', '#fdb301'],
      backgroundColor: '#012A5C',
      borderRadius: '10',
      title: {
        text: '总金额',
        subtext: this.totalDatas + '元',
        textStyle: {
          color: '#f2f2f2',
          fontSize: 23,
          // align: '40'
        },
        subtextStyle: {
          fontSize: 16,
          color: ['#ff9d19']
        },
        x: 'center',
        y: 'center',
      },
      grid: {
        bottom: 150,
        left: 100,
        right: '10%'
      },
      legend: {
        x : '2%',
        top: '5%',
        y : 'top',
        orient: 'vertical',
        textStyle: {
          color: '#f2f2f2',
          // fontSize: 1,

        },
        icon: 'roundRect',
        data: this.datas,
      },
      tooltip: {
        formatter: '{a}：<br/>{b}: {c}元'
      },
      series: [
        // 主要展示层的
        {
          radius: ['50%', '72%'],
          center: ['50%', '50%'],
          type: 'pie',
          label: {
            normal: {
              show: true,
              formatter: '{c}元',
              textStyle: {
                fontSize: 15,

              },
              position: 'outside'
            },
            emphasis: {
              show: true
            }
          },
          labelLine: {
            normal: {
              show: true,
              length: 15,
              length2: 25
            },
            emphasis: {
              show: true
            }
          },
          name: '信息统计',
          data: this.datas,

        },
        // 边框的设置
        {
          radius: ['50%', '54%'],
          center: ['50%', '50%'],
          type: 'pie',
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          labelLine: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          animation: false,
          tooltip: {
            show: false
          },
          data: [{
            value: 1,
            itemStyle: {
              color: 'rgba(250,250,250,0.3)',
            },
          }],
        },
        // {
        //   name: '外边框',
        //   type: 'pie',
        //   clockWise: false, // 顺时加载
        //   hoverAnimation: false, // 鼠标移入变大
        //   center: ['50%', '50%'],
        //   radius: ['65%', '65%'],
        //   label: {
        //     normal: {
        //       show: false
        //     }
        //   },
        //   data: [{
        //     value: 9,
        //     name: '',
        //     itemStyle: {
        //       normal: {
        //         borderWidth: 2,
        //         borderColor: '#0b5263'
        //       }
        //     }
        //   }]
        // },
      ]
    };
  }
}
