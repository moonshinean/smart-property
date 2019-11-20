import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import { graphic, registerMap } from 'echarts';
import {ThemeService} from '../../../public/theme.service';
import {Subscription} from 'rxjs';
@Component({
  selector: 'rbi-echarts-pie-general',
  templateUrl: './echarts-pie-general.component.html',
  styleUrls: ['./echarts-pie-general.component.less']
})
export class EchartsPieGeneralComponent implements OnInit, OnChanges {

  @Input() public lineData: any;
  @Input() public barData: any;
  @Input() public data: any;
  @Input() public themeColor: any;
  public option: any;
  constructor(
  ) {
  }
  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.option = {
      backgroundColor: this.themeColor.background,
      grid: {
        top: '12',
        bottom: '24',
        // right:'14'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          label: {
            show: true,
            backgroundColor: this.themeColor.tipcolor
          }
        }
      },
      xAxis: {
        data: this.data,
        axisLine: {
          lineStyle: {
            color: this.themeColor.axislineColor
          }
        },
        nameTextStyle: {
          color: this.themeColor.axislabelColor
        }
      },
      yAxis: {
        splitLine: {show: false},
        axisLine: {
          lineStyle: {
            color: this.themeColor.axislineColor
          }
        },
        nameTextStyle: {
          color: this.themeColor.axislabelColor
        }
      },
      series: [ {
        name: 'bar',
        type: 'bar',
        barWidth: 12,
        itemStyle: {
          normal: {
            barBorderRadius: 10,
            color: new graphic.LinearGradient(
              0, 0, 0, 1,
              // this.themeColor.lineGradientColor
              [
                {offset: 0, color: this.themeColor.lineGradientColor[0]},
                {offset: 1, color: this.themeColor.lineGradientColor[1]}
              ]
            ),
          },
          left: 15
        },
        data: this.barData
      }, {
        name: 'line',
        type: 'bar',
        barGap: '-127%',
        barWidth: 20,
        itemStyle: {
          normal: {
            color: this.themeColor.linebgc
          }
        },
        z: -8,
        data: this.lineData
      }]
    };
  }
}
