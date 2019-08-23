import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailPopComponent } from './detail-pop/detail-pop.component';
import {DialogModule, ScrollPanelModule} from 'primeng/primeng';
import {BasicTableModule} from '../basic-table/basic-table.module';

@NgModule({
  declarations: [DetailPopComponent],
  imports: [
    CommonModule,
    ScrollPanelModule,
    DialogModule,
    BasicTableModule
  ],
  exports: [DetailPopComponent]
})
export class BasicDialogModule { }
