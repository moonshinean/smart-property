import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EchartsPieGeneralComponent } from './echarts-pie-general/echarts-pie-general.component';
import {NgxEchartsModule} from 'ngx-echarts';
import {ThemeService} from '../../public/theme.service';
import { EchartsPaymentPieComponent } from './echarts-payment-pie/echarts-payment-pie.component';

@NgModule({
  declarations: [EchartsPieGeneralComponent, EchartsPaymentPieComponent],
  imports: [
    CommonModule,
    NgxEchartsModule
  ],
  exports: [EchartsPieGeneralComponent, EchartsPaymentPieComponent],
  // providers:[ThemeService]
})
export class EchartsPieModule { }
