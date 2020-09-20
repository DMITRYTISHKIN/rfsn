import { Component, OnInit, Output, EventEmitter, HostListener, Input, TemplateRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'custom-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit, OnDestroy {
  private readonly TIMEOUT_SHOW = 5 * 1000;

  @ViewChild('toast') toast: ElementRef;

  @Output() keyDown: EventEmitter<void> = new EventEmitter();
  @Input() key: string;
  @Input() text: string;
  @Input() action: string;
  @Input() timeout: number = this.TIMEOUT_SHOW;
  @Input() contentTemplate: TemplateRef<any>;
  @Input() showKey = true;
  @Input() zIndex: number;
  @Input() top = -70;
  @Input() className: string;
  @Input() callback: () => void;
  @Input() reject: () => void;
  @Input() showTimeleft: boolean;
  @Input() labelTimeleft: string;
  @Input() emitActionTimeout: boolean;
  @Input() mouseoverRestartTimer = true;

  public topPosition: number = null;

  public open = false;
  public timeleft: Date;

  private _timer: number;
  private _destroy$ = new Subject();

  @HostListener('document:keydown', ['$event']) onKeyDown(e: KeyboardEvent) {
    if (e.ctrlKey && e.code === this.key) {
      this._emit();
      clearTimeout(this._timer);
      this.hide();
    }
  }

  constructor() { }

  ngOnInit() {
    this._startTimeleft();
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public onMouseover(): void {
    if (this.mouseoverRestartTimer) {
      this._startTimeout(this.hide.bind(this));
    }
  }

  public show(): void {
    this._startTimeout(this.emitActionTimeout ? this.onAction.bind(this) : this.hide.bind(this));
    this.open = true;
  }

  public hide(): void {
    this.open = false;
    this.topPosition = null;
  }

  public onAction(): void {
    this._emit();
    clearTimeout(this._timer);
    this.hide();
  }

  public onReject(): void {
    this.reject();
    clearTimeout(this._timer);
    this.hide();
  }

  private _emit(): void {
    if (this.callback) {
      this.callback();
    } else {
      this.keyDown.emit();
    }
  }

  private _startTimeout(fn: any): void {
    if (!this.timeout) {
      return;
    }

    clearTimeout(this._timer);
    this._timer = window.setTimeout(fn, this.timeout);
  }

  private _startTimeleft(): void {
    if (!this.showTimeleft) {
      return;
    }

    const d = new Date();
    d.setMilliseconds(d.getMilliseconds() + this.timeout);
    this.timeleft = d;
  }
}
