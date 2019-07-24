import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EchartsMapComponent } from './echarts-map.component';

@NgModule({
  declarations: [EchartsMapComponent],
  imports: [
    CommonModule
  ],
  exports: [EchartsMapComponent]
})
export class EchartsMapModule { }
