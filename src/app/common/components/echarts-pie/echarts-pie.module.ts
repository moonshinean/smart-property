import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EchartsPieGeneralComponent } from './echarts-pie-general/echarts-pie-general.component';
import {NgxEchartsModule} from 'ngx-echarts';

@NgModule({
  declarations: [EchartsPieGeneralComponent],
  imports: [
    CommonModule,
    NgxEchartsModule
  ],
  exports: [EchartsPieGeneralComponent]
})
export class EchartsPieModule { }
