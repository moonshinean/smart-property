import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EchartsBarLandComponent} from './echarts-bar-land/echarts-bar-land.component';
import { EchartsBarPortlineComponent } from './echarts-bar-portline/echarts-bar-portline.component';
import { EchartsBarPortComponent } from './echarts-bar-port/echarts-bar-port.component';
import { EchartsBarLargeComponent } from './echarts-bar-large/echarts-bar-large.component';
import {NgxEchartsModule} from 'ngx-echarts';
import {ThemeService} from '../../public/theme.service';

@NgModule({
  declarations: [
    EchartsBarLandComponent,
    EchartsBarPortlineComponent,
    EchartsBarPortComponent,
    EchartsBarLargeComponent
  ],
  imports: [
    CommonModule,
    NgxEchartsModule
  ],
  exports: [
    EchartsBarLandComponent,
    EchartsBarPortlineComponent,
    EchartsBarPortComponent,
    EchartsBarLargeComponent
  ],
  // providers: [ThemeService]
})
export class EchartsBarModule { }
