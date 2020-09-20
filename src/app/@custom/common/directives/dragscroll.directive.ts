import { Directive, HostListener, Renderer2, OnDestroy, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[dragscroll]'
})
export class DragscrollDirective implements OnDestroy, OnInit {
  private _offsetY = 0;
  private _offsetX = 0;

  private _diffX: number;
  private _diffY: number;

  private _element: HTMLElement;

  private _onMouseMoveDestroy: () => void;
  private _onMouseUpDestroy: () => void;

  @HostListener('mousedown', ['$event']) onMouseDown(e: MouseEvent) {
    if (e.button !== 0) {
      return;
    }

    this._offsetY = e.clientY + this._element.scrollTop;
    this._offsetX = e.clientX + this._element.scrollLeft;

    this._onMouseMoveDestroy = this._renderer.listen(document, 'mousemove', this._onMouseMove);
    this._onMouseUpDestroy = this._renderer.listen(document, 'mouseup', this._onMouseUp);

    this._renderer.setStyle(document.body, 'user-select', 'none');
    this._renderer.setStyle(this._elementRef.nativeElement, 'cursor', 'grabbing');

  }

  @HostListener('wheel', ['$event']) onWheel(e: WheelEvent) {
    e.preventDefault();

    this._offsetY = this._element.scrollTop;
    this._offsetX = this._element.scrollLeft;

    this._offsetY += e.deltaY;
    if (this._offsetY < 0) {
      this._offsetY = 0;
    } else if (this._offsetY > this._element.scrollHeight - this._element.offsetHeight) {
      this._offsetY = this._element.scrollHeight - this._element.offsetHeight;
    }

    this._offsetX += e.deltaX;
    if (this._offsetX < 0) {
      this._offsetX = 0;
    } else if (this._offsetX > this._element.scrollWidth - this._element.offsetWidth) {
      this._offsetX = this._element.scrollWidth - this._element.offsetWidth;
    }

    this._element.scrollTo(this._offsetX, this._offsetY);
  }


  constructor(
    private _renderer: Renderer2,
    private _elementRef: ElementRef
  ) {
    this._renderer.setStyle(this._elementRef.nativeElement, 'cursor', 'grab');
    this._element = this._elementRef.nativeElement;
  }

  ngOnInit() {
    this._renderer.setStyle(this._elementRef.nativeElement, 'overflow', 'hidden');
  }

  ngOnDestroy() {
    if (this._onMouseUpDestroy) {
      this._onMouseUpDestroy();
    }

    if (this._onMouseMoveDestroy) {
      this._onMouseMoveDestroy();
    }
  }

  private _onMouseMove = (e: MouseEvent): void => {
    this._diffX = (this._offsetX - (e.clientX + this._element.scrollLeft));
    this._diffY = (this._offsetY - (e.clientY + this._element.scrollTop));

    if (
      this._element.scrollLeft + this._diffX > this._element.scrollWidth - this._element.offsetWidth ||
      this._element.scrollLeft + this._diffX < 0
    ) {
      this._offsetX = e.clientX + this._element.scrollLeft;
    }

    if (
      this._element.scrollTop + this._diffY > this._element.scrollHeight - this._element.offsetHeight ||
      this._element.scrollTop + this._diffY < 0
    ) {
      this._offsetY = e.clientY + this._element.scrollTop;
    }

    this._element.scrollLeft += this._diffX;
    this._element.scrollTop += this._diffY;
  }

  private _onMouseUp = (e: MouseEvent): void => {
    this._onMouseUpDestroy();
    this._onMouseMoveDestroy();

    let start = 1;
    const animate = () => {
        const step = Math.sin(start);
        if (step <= 0) {
            window.cancelAnimationFrame(step);
        } else {
          this._element.scrollLeft += this._diffX * step;
          this._element.scrollTop += this._diffY * step;
          start -= 0.02;
          window.requestAnimationFrame(animate);
        }
    };
    // animate();

    this._renderer.removeStyle(document.body, 'user-select');
    this._renderer.setStyle(this._elementRef.nativeElement, 'cursor', 'grab');

  }
}
