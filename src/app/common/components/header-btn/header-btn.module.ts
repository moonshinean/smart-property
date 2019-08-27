import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicBtnComponent } from './basic-btn/basic-btn.component';
import {DropdownModule} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';



@NgModule({
  declarations: [BasicBtnComponent],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule
  ],
  exports: [BasicBtnComponent]
})
export class HeaderBtnModule { }
