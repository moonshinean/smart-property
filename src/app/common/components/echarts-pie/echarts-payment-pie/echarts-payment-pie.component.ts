import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rbi-echarts-payment-pie',
  templateUrl: './echarts-payment-pie.component.html',
  styleUrls: ['./echarts-payment-pie.component.less']
})
export class EchartsPaymentPieComponent implements OnInit {

  public option: any;
  constructor() { }

  ngOnInit() {
    this.option = {
      // title : {
      //   text: '缴费项目情况',
      //   subtext: '2019-01-01至2019-05-31',
      //   x: 'center'
      // },
      tooltip : {
        trigger: 'item',
        formatter: ' {a} <br/> {b} : {c} ({d}%)'
      },
      series : [
        {
          name: '部门使用情况',
          type: 'pie',
          radius : '45%',
          center: ['50%', '50%'],
          // label: {
          //   show: true,
          //   formatter: '{b}: {d}%'
          // },
          data: [
            {value: 2628, name: '物业费住宅'},
            {value: 1797, name: '装修保证金'},
            {value: 1399, name: '装修管理费'},
            {value: 1241, name: '装修建筑垃圾清运费'},
            {value: 6557, name: '车位管理费'}
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }
}
