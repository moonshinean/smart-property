import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[rbiAppdrag]'
})
export class AppdragDirective {
  public isDown = false;

  // public disX; // 记录鼠标点击事件的位置 X
  // public disY; // 记录鼠标点击事件的位置 Y
  //
  // private totalOffsetX = 0; // 记录总偏移量 X轴
  // private totalOffsetY = 0; // 记录总偏移量 Y轴
  constructor(public el: ElementRef) { }
  // 点击事件
  @HostListener('mousedown', ['$event']) onMousedown(event) {
    this.isDown = true;
    // this.disX = event.clientX;
    // this.disY = event.clientY;
  }

  // 监听document移动事件事件
  @HostListener('document:mousemove', ['$event']) onMousemove(event) {
    // 判断该元素是否被点击了。
    if (this.isDown) {
      this.el.nativeElement.style.left =  event.clientX - 20 + 'px';
      this.el.nativeElement.style.top =  event.clientY - 20 + 'px';
    }
  }

  // 监听document离开事件
  @HostListener('document:mouseup', ['$event']) onMouseup(event) {
    // 只用当元素移动过了，离开函数体才会触发。
    // console.log(123);
    if (this.isDown) {
      this.isDown = false;
    }
  }
}
