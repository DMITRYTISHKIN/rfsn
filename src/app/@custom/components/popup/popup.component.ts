import { Component, OnInit, Input, ElementRef, Injector, Renderer2, HostListener, Optional, Inject } from '@angular/core';
import { PopupModel } from './models/popup-model';
import { TimeIntervalService } from '@custom/common/services/time-interval.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  @Input() model: PopupModel;

  public timeoutCloseLeft: number;
  public _injector: Injector;

  @HostListener('document:keyup', ['$event']) onEsc(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.onClose();
    }
  }

  constructor(
    public elementRef: ElementRef,
    public injector: Injector,
    public renderer: Renderer2,
    private _interval: TimeIntervalService,
    @Optional() @Inject('theme') public theme: BehaviorSubject<any>
  ) { }

  ngOnInit() {
    if (this.model.verticalPosition) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'align-items', this.model.verticalPosition);
    }

    if (this.model.width) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'width', this.model.width);
    }

    if (this.model.height) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'height', this.model.height);
      this.renderer.setStyle(this.elementRef.nativeElement, 'overflow', 'hidden');
    }

    this._injector = Injector.create({
      providers: [{ provide: 'popup', useValue: this.model }],
      parent: this.model.injector || this.injector
    });

    if (this.model.timeoutClose) {
      const target = new Date().getTime() + this.model.timeoutClose;
      this._interval.getInterval(900, 0).subscribe(_ => {
        this.timeoutCloseLeft = Math.ceil((target - Date.now()) / 1000);
      });
    }
  }

  public onClose(): void {
    if (this.model.cancel) {
      this.model.cancel.command();
      return;
    }

    this.model.close();
  }
}
