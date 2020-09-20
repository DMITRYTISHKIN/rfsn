import { Directive, Output, EventEmitter, Input, HostListener, ElementRef,
  Renderer2, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

export class MoveableObj {
  constructor(
    public x?: number,
    public y?: number
  ) { }
}

@Directive({
  selector: '[moveable]'
})
export class MoveableDirective implements OnInit, OnDestroy, AfterViewInit {
  private readonly MOVE_SCROLL_STEP = 5;
  private readonly MOVE_DRAG_START = 0;

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
  private _diffY = 0;
  private _diffX = 0;
  private _target: HTMLElement;
  private _targetSelector: string;

  @Input() moveableX: number;
  @Input() moveableY: number;

  private _onMouseMoveDestroy: () => void;
  private _onMouseUpDestroy: () => void;

  @Output() draggableStart: EventEmitter<{ event: MouseEvent, element: HTMLElement }> = new EventEmitter();
  @Output() draggableEnd: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() draggableMove: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() moveableChange = new EventEmitter<MoveableObj>();

  @Input() set draggableScroll(bool: boolean) {
    this._draggableScroll = bool;
  }

  @Input() set moveableTargetClass(selector: string) {
    this._targetSelector = selector;
  }

  @HostListener('window:resize', ['$event']) onResize() {
    this._reposition();
  }

  @HostListener('mousedown', ['$event']) onMouseDown(e: MouseEvent) {
    if (e.button !== 0) {
      return;
    }

    if (e.target !== this._target) {
      return;
    }

    // e.stopPropagation();
    this._startEvent = e;

    this._element = (e.currentTarget as HTMLElement);
    this._container = this._findScrollParent(this._element.parentElement) || document.body.firstElementChild;

    this._offsetY = e.clientY + this._container.scrollTop + -this._diffY;
    this._offsetX = e.clientX + this._container.scrollLeft + -this._diffX;
    this._dragStart = 0;


    this._containerScrollHeight = this._container.scrollHeight;
    this._containerScrollWidth = this._container.scrollWidth;

    this._renderer.addClass(document.documentElement, 'resizeable-active');

    this._onMouseMoveDestroy = this._renderer.listen(document, 'mousemove', this._onMouseMove);
    this._onMouseUpDestroy = this._renderer.listen(document, 'mouseup', this._onMouseUp);
  }

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
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

  ngAfterViewInit() {
    this._target = this._elementRef.nativeElement.querySelector(this._targetSelector);
    this._renderer.setStyle(this._target || this._element, 'cursor', 'move');

    this._reposition();
  }

  ngOnInit() {
    this._element = this._elementRef.nativeElement;
    this._diffX = this.moveableX || 0;
    this._diffY = this.moveableY || 0;
    this._setTranslate(this._element, this.moveableX, this.moveableY);
  }

  private _reposition(): void {
    const rectDoc = document.documentElement.getBoundingClientRect();
    let rectTarget = this._elementRef.nativeElement.getBoundingClientRect();
    if (this._targetSelector) {
      const elem = this._elementRef.nativeElement.querySelector(this._targetSelector);
      if (elem) {
        rectTarget = elem.getBoundingClientRect();
      }
    }

    if (rectDoc.height < rectTarget.y + rectTarget.height) {
      this._diffY = this._diffY - (rectTarget.y + rectTarget.height - rectDoc.height);
    } else if (rectTarget.y < 0) {
      this._diffY = this._diffY - rectTarget.y;
    }

    if (rectDoc.width < rectTarget.x + rectTarget.width) {
      this._diffX = this._diffX - (rectTarget.x + rectTarget.width - rectDoc.width);
    } else if (rectTarget.x < 0) {
      this._diffX = this._diffX - rectTarget.x;
    }

    this._setTranslate(this._element, this._diffX, this._diffY);
  }

  private _onMouseMove = (e: MouseEvent): void => {
    if (this._dragStart < this.MOVE_DRAG_START) {
      this._dragStart++;
      if (this._dragStart === this.MOVE_DRAG_START) {
        this._renderer.addClass(this._element, 'draggable');
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

    // this._renderer.removeStyle(this._element, 'transform');
    this._renderer.removeClass(this._element, 'draggable');
    this._renderer.removeStyle(document.body, 'cursor');
    this._renderer.removeClass(document.documentElement, 'resizeable-active');

    if (this._dragStart < this.MOVE_DRAG_START) {
      return;
    }

    this._reposition();

    this.moveableChange.emit(new MoveableObj(this._diffX, this._diffY));
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
