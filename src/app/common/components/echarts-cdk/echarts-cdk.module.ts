import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EchartsCdkIdxComponent } from './echarts-cdk-idx/echarts-cdk-idx.component';

@NgModule({
  declarations: [EchartsCdkIdxComponent],
  imports: [
    CommonModule
  ],
  exports: [EchartsCdkIdxComponent]
})
export class EchartsCdkModule { }
