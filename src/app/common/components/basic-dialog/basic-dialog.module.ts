import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailPopComponent } from './detail-pop/detail-pop.component';
import {DialogModule, FileUploadModule, ScrollPanelModule} from 'primeng/primeng';
import {BasicTableModule} from '../basic-table/basic-table.module';
import { FilePopComponent } from './file-pop/file-pop.component';

@NgModule({
  declarations: [DetailPopComponent, FilePopComponent],
  imports: [
    CommonModule,
    ScrollPanelModule,
    DialogModule,
    BasicTableModule,
    FileUploadModule,
  ],
  exports: [DetailPopComponent, FilePopComponent]
})
export class BasicDialogModule { }
