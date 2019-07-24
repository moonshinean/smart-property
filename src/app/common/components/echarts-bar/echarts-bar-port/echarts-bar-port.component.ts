import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'rbi-echarts-bar-port',
  templateUrl: './echarts-bar-port.component.html',
  styleUrls: ['./echarts-bar-port.component.less']
})
export class EchartsBarPortComponent implements OnInit, OnChanges {
  public optionsport: any;
  @Input() public data: any;
  @Input() public title: any;

  constructor() {
  }

  ngOnInit() {

    this.optionsport = {

      backgroundColor: '#33353C',
      color: ['#5699E0', '#1F6EC0', '#1D65AD', '#17528F', '#103B63'],
      legend: {
        data: this.title,
        // itemWidth: 15,
        itemHeight: 10,
        top: '0',
        textStyle: {
          color: '#ccc',
          // fontSize:'1px'
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
          colorLightness: [0, 1]
        }
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '70%',
          center: ['50%', '60%'],
          data: this.data.sort(function(a, b) {
            return a.value - b.value;
          }),
          roseType: 'radius',
          label: {
            normal: {
              textStyle: {
                color: 'rgba(255, 255, 255, 0.7)'
              }
            }
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            }
          },
          itemStyle: {
            normal: {
              color: '#5699E0',
              shadowBlur: 200,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },

          animationType: 'scale',
          animationEasing: 'elasticOut',
          // animationDelay: function (idx) {
          //   return Math.random() * 200;
          // }
        }
      ]
    };

  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.optionSport();

  }

  // public  optionSport(): void {
  //   this.optionsport  = {
  //     backgroundColor: '#33353C',
  //
  //     title: {
  //       text: '事件类型统计',
  //       // left: 'right',
  //       top: 30,
  //       right: 40,
  //       textStyle: {
  //         color: '#fff'
  //       }
  //     },
  //
  //     tooltip : {
  //       trigger: 'item',
  //       formatter: "{a} <br/>{b} : {c} ({d}%)"
  //     },
  //
  //     visualMap: {
  //       show: false,
  //       min: 80,
  //       max: 600,
  //       inRange: {
  //         colorLightness: [0, 1]
  //       }
  //     },
  //     series : [
  //       {
  //         name:'访问来源',
  //         type:'pie',
  //         radius : '55%',
  //         center: ['50%', '50%'],
  //         data:this.data.sort(function (a, b) { return a.value - b.value; }),
  //         roseType: 'radius',
  //         label: {
  //           normal: {
  //             textStyle: {
  //               color: 'rgba(255, 255, 255, 0.7)'
  //             }
  //           }
  //         },
  //         labelLine: {
  //           normal: {
  //             lineStyle: {
  //               color: 'rgba(255, 255, 255, 0.3)'
  //             },
  //             smooth: 0.2,
  //             length: 10,
  //             length2: 20
  //           }
  //         },
  //         itemStyle: {
  //           normal: {
  //             color: '#5699E0',
  //             shadowBlur: 200,
  //             shadowColor: 'rgba(0, 0, 0, 0.5)'
  //           }
  //         },
  //
  //         animationType: 'scale',
  //         animationEasing: 'elasticOut',
  //         animationDelay: function (idx) {
  //           return Math.random() * 200;
  //         }
  //       }
  //     ]
  //   };
  //
  // }

}
