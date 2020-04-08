import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ThemeService} from '../../../public/theme.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'rbi-echarts-bar-port',
  templateUrl: './echarts-bar-port.component.html',
  styleUrls: ['./echarts-bar-port.component.less']
})
export class EchartsBarPortComponent implements OnInit, OnChanges {

  public optionsport: any;
  @Input() public data: any;
  @Input() public title: any;
  @Input() public themeColor: any;
  public dataTitle = [];

  constructor(
  ) {

  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(123);
    console.log(this.data);
    this.optionsport = {
      backgroundColor: '#F4F4F4',
      color: ['#EAEA26', '#906BF9', '#FE5656', '#01E17E', '#3DD1F9', '#FFAD05'],
      // title: {
      //     text: '网络/安全设备',
      //     left: '60',
      //     top: 0,
      //     textAlign: 'center',
      //     textStyle: {
      //         color: '#fff',
      //         fontSize: 14,
      //         fontWeight: 0
      //     }
      // },
      grid: {
        left: -100,
        top: 5,
        bottom: 10,
        right: 50,
        // containLabel: true
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      // legend: {
      //   type:  'plain',
      //   orient:  'horizontal',
      //   // x: "right",
      //   top:  '0',
      //   left: '0',
      //   // bottom: "0%",
      //   itemWidth: 16,
      //   itemHeight: 8,
      //   itemGap: 16,
      //   textStyle: {
      //     color: '#A3E2F4',
      //     fontSize: 12,
      //     fontWeight: 0
      //   },
      //   data: this.dataTitle
      // },
      polar: {},
      angleAxis: {
        interval: 6,
        type: 'category',
        data: [],
        z: 10,
        axisLine: {
            show: false,
            lineStyle: {
                color: '#C7D0D6',
                width: 1,
                type: 'solid'
            },
        },
        axisLabel: {
            interval: 0,
            show: true,
            color: '#C7D0D6',
            margin: 8,
            fontSize: 16
        },
    },
    radiusAxis: {
        min: 20,
        max: 100,
        interval: 20,
        axisLine: {
            show: false,
            lineStyle: {
                color: '#C7D0D6',
                width: 1,
                type: 'solid'
            },
        },
        axisLabel: {
            formatter: '{value} %',
            show: false,
            padding: [0, 0, 10, 0],
            color: '#0B3E5E',
            fontSize: 16
        },
        splitLine: {
            lineStyle: {
                color: '#C7D0D6',
                width: 2,
                type: 'solid'
            }
        }
    },
      calculable: true,
      series: [{
        type: 'pie',
        radius: ['10%', '10.5%'],
        // center:['40%', '50%'],
        hoverAnimation: false,
        labelLine: {
          normal: {
            show: false,
            length: 2,
            length2: 2
          },
          emphasis: {
            show: false
          }
        },
        data: [{
          name: '',
          value: 0,
          itemStyle: {
            normal: {
              color: '#0B4A6B'
            }
          }
        }]
      }, {
        type: 'pie',
        radius: ['5%', '5.5%'],
        // center:['40%', '50%'],
        hoverAnimation: false,
        labelLine: {
          normal: {
            show: false,
            length: 2,
            length2: 2
          },
          emphasis: {
            show: false
          }
        },
        data: [{
          name: '',
          value: 0,
          itemStyle: {
            normal: {
              color: '#0B4A6B'
            }
          }
        }]
      }, {
        stack: 'a',
        type: 'pie',
        radius: ['20%', '80%'],
        roseType: 'area',
        // center:['40%', '50%'],
        zlevel: 10,
        label: {
          normal: {
            show: true,
            formatter: '{c}',
            textStyle: {
              fontSize: 10,
            },
          },
          emphasis: {
            show: true
          }
        },
        labelLine: {
          normal: {
            show: true,
            length: 10,
            length2: 15
          },
          emphasis: {
            show: false
          }
        },
        data: this.data
      }, ]
    };
  }
}
