import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  Renderer2
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[swrxUpperCase]'
})
export class UpperCaseDirective {
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  value: any;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private control: NgControl
  ) {}

  // @HostListener('keyup')
  // onKeyUp() {
  //   // const upper = this.el.nativeElement.value.toUpperCase();
  //   // this.control.valueAccessor.writeValue(upper);
  //   /*
  //   this.renderer.setProperty(
  //     this.el.nativeElement,
  //     'value',
  //     this.el.nativeElement.value.toUpperCase()
  //   );
  //   */
  // }

  @HostListener('input', ['$event'])
  onEvent($event) {
    const upper = this.el.nativeElement.value.toUpperCase();
    this.renderer.setProperty(this.el.nativeElement, 'value', upper);
    if (this.control) {
      this.control.valueAccessor.writeValue(
        this.el.nativeElement.value.toUpperCase()
      );
    }
  }
}
