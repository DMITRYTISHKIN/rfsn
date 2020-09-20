import { Directive, HostListener, Renderer2, OnDestroy, ElementRef, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Directive({
  selector: '[draggable]'
})
export class DraggableDirective implements OnInit, OnDestroy {
  private readonly MOVE_SCROLL_STEP = 5;
  private readonly MOVE_DRAG_START = 8;

  private _startEvent: MouseEvent;
  private _draggableScroll = true;
  private _scrollStep: number;
  private _dragStart: number;
  private _element: HTMLElement;
  private _container: HTMLElement;
  private _containerScrollHeight: number;
  private _containerScrollWidth: number;
  private _offsetY: number;
  private _offsetX: number;
  private _diffY: number;
  private _diffX: number;
  private _targetClass: string;

  private _onMouseMoveDestroy: () => void;
  private _onMouseUpDestroy: () => void;

  @Output() draggableStart: EventEmitter<{ event: MouseEvent, element: HTMLElement }> = new EventEmitter();
  @Output() draggableEnd: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() draggableMove: EventEmitter<MouseEvent> = new EventEmitter();

  @Input() set draggableScroll(bool: boolean) {
    this._draggableScroll = bool;
  }

  @Input() set draggableTargetClass(selector: string) {
    this._targetClass = selector;
  }

  @Input() set draggableDirection(direction: 'y' | 'x') {
    if (direction === 'x') {
      this._setTranslate = (el, x, y) => {
        this._renderer.setStyle(
          el,
          'transform',
          `translateX(${x}px)`
        );
      };
    }

    if (direction === 'y') {
      this._setTranslate = (el, x, y) => {
        this._renderer.setStyle(
          el,
          'transform',
          `translateY(${y}px)`
        );
      };
    }
  }

  @HostListener('mousedown', ['$event']) onMouseDown(e: MouseEvent) {
    if (e.button !== 0) {
      return;
    }

    if (this._targetClass && !(e.target as HTMLElement).classList.contains(this._targetClass)) {
      return;
    }

    // e.stopPropagation();
    this._startEvent = e;

    this._element = (e.currentTarget as HTMLElement);
    this._container = this._findScrollParent(this._element.parentElement) || document.body.firstElementChild;

    this._offsetY = e.clientY + this._container.scrollTop;
    this._offsetX = e.clientX + this._container.scrollLeft;
    this._dragStart = 0;


    this._containerScrollHeight = this._container.scrollHeight;
    this._containerScrollWidth = this._container.scrollWidth;

    this._renderer.setStyle(document.body, 'user-select', 'none');

    this._onMouseMoveDestroy = this._renderer.listen(document, 'mousemove', this._onMouseMove);
    this._onMouseUpDestroy = this._renderer.listen(document, 'mouseup', this._onMouseUp);
  }

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer2
  ) { }

  ngOnDestroy() {
    if (this._onMouseUpDestroy) {
      this._onMouseUpDestroy();
    }

    if (this._onMouseMoveDestroy) {
      this._onMouseMoveDestroy();
    }
  }

  ngOnInit() {
    this._element = this._elementRef.nativeElement;
    this._renderer.setStyle(this._element, 'cursor', 'grab');
  }

  private _onMouseMove = (e: MouseEvent): void => {
    if (this._dragStart < this.MOVE_DRAG_START) {
      this._dragStart++;
      if (this._dragStart === this.MOVE_DRAG_START) {
        this._renderer.addClass(this._element, 'draggable');
        this._renderer.setStyle(document.body, 'cursor', 'grabbing');
        this.draggableStart.emit({ event: this._startEvent, element: this._element });
      }
      return;
    }

    this._diffY = -(this._offsetY - e.clientY - this._container.scrollTop);
    this._diffX = -(this._offsetX - e.clientX - this._container.scrollLeft);

    if (this._draggableScroll) {
      this._moveScroll(e);
    }

    this._setTranslate(this._element, this._diffX, this._diffY);

    this.draggableMove.emit(e);
  }

  private _onMouseUp = (e: MouseEvent): void => {
    this._onMouseUpDestroy();
    this._onMouseMoveDestroy();

    this._container.removeEventListener('scroll', this._onMoveScrollTop);
    this._container.removeEventListener('scroll', this._onMoveScrollLeft);

    this._renderer.removeStyle(this._element, 'transform');
    this._renderer.removeClass(this._element, 'draggable');
    this._renderer.removeStyle(document.body, 'user-select');
    this._renderer.removeStyle(document.body, 'cursor');

    if (this._dragStart < this.MOVE_DRAG_START) {
      return;
    }

    this.draggableEnd.emit(e);
  }

  private _onMoveScrollTop = (): void => {
    this._container.scrollTo(this._container.scrollLeft, this._container.scrollTop + this._scrollStep);
    if (
      this._container.scrollTop === 0 ||
      this._container.scrollTop >= this._containerScrollHeight - this._container.offsetHeight
    ) {
      this._container.removeEventListener('scroll', this._onMoveScrollTop);
    }

    this._diffY += this._scrollStep;
    this._setTranslate(this._element, this._diffX, this._diffY);
  }

  private _onMoveScrollLeft = (): void => {
    this._container.scrollTo(this._container.scrollLeft + this._scrollStep, this._container.scrollTop);
    if (
      this._container.scrollLeft === 0 ||
      this._container.scrollLeft >= this._containerScrollWidth - this._container.offsetWidth
    ) {
      this._container.removeEventListener('scroll', this._onMoveScrollLeft);
    }

    this._diffX += this._scrollStep;
    this._setTranslate(this._element, this._diffX, this._diffY);
  }

  private _moveScroll(e: MouseEvent): void {
    this._container.removeEventListener('scroll', this._onMoveScrollTop);
    this._container.removeEventListener('scroll', this._onMoveScrollLeft);

    if ((e.clientY - this._container.getBoundingClientRect().top) < 50) {
      this._container.scrollTo(this._container.scrollLeft, this._container.scrollTop - 1);
      this._scrollStep = -this.MOVE_SCROLL_STEP;
      this._container.addEventListener('scroll', this._onMoveScrollTop);
    } else if (
      (e.clientY - this._container.getBoundingClientRect().top) + 50 > this._container.offsetHeight &&
      this._container.scrollTop + this.MOVE_SCROLL_STEP <= this._containerScrollHeight - this._container.offsetHeight
    ) {
      this._container.scrollTo(this._container.scrollLeft, this._container.scrollTop + 1);
      this._scrollStep = this.MOVE_SCROLL_STEP;
      this._container.addEventListener('scroll', this._onMoveScrollTop);
    }

    if ((e.clientX - this._container.getBoundingClientRect().left) < 50) {
      this._container.scrollTo(this._container.scrollLeft - 1, this._container.scrollTop);
      this._scrollStep = -this.MOVE_SCROLL_STEP;
      this._container.addEventListener('scroll', this._onMoveScrollLeft);
    } else if (
      (e.clientX - this._container.getBoundingClientRect().left) + 50 > this._container.offsetWidth &&
      this._container.scrollLeft + this.MOVE_SCROLL_STEP <= this._containerScrollWidth - this._container.offsetWidth
    ) {
      this._container.scrollTo(this._container.scrollLeft + 1, this._container.scrollTop);
      this._scrollStep = this.MOVE_SCROLL_STEP;
      this._container.addEventListener('scroll', this._onMoveScrollLeft);
    }
  }

  private _setTranslate = (el: HTMLElement, x: number, y: number): void => {
    this._renderer.setStyle(
      el,
      'transform',
      `translate(${x}px, ${y}px)`
    );
  }

  private _findScrollParent(node: HTMLElement) {
    if (node === null) {
      return null;
    }

    if (node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth) {
      return node;
    } else {
      return this._findScrollParent(node.parentElement);
    }
  }
}
