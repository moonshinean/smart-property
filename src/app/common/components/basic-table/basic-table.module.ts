import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BfTableComponent } from './bf-table/bf-table.component';
import { CheckTableBtnComponent } from './check-table-btn/check-table-btn.component';
import {TableModule} from 'primeng/table';
import {ScrollPanelModule} from 'primeng/primeng';



@NgModule({
  declarations: [BfTableComponent, CheckTableBtnComponent],
  imports: [
    CommonModule,
    TableModule,
    ScrollPanelModule,
  ],
  exports: [BfTableComponent, CheckTableBtnComponent]
})
export class BasicTableModule { }
