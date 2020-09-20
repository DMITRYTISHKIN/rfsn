import { Component, OnInit, Input, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { OverlayComponent } from '@custom/common/components/overlay/overlay.component';
import { PeriodDropdownComponent } from './period-dropdown/period-dropdown.component';
import { takeUntil } from 'rxjs/operators';
import { OverlayService } from '@custom/common/services/overlay.service';
import { Subject } from 'rxjs';
import { PeriodSize } from './models/period-size';
import { CalendarPeriodDirection } from '../calendar/models/calendar-period';

@Component({
  selector: 'custom-period',
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.scss']
})
export class PeriodComponent implements OnInit, OnDestroy {
  public readonly PeriodSize = PeriodSize;
  public readonly PeriodDirection = CalendarPeriodDirection;

  private readonly DATE_FORMAT =  'DD MMMM YYYY';
  private readonly DATE_FORMAT_WITH_TIME = 'DD MMMM YYYY, hh:mm';

  @ViewChild('periodEl', { static: true }) periodEl: ElementRef;

  @Input() withTime: boolean;
  @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Input() step = 60;
  @Input() size: string;

  @Output() valueChange = new EventEmitter<[Date, Date]>();

  public stepHour: number;
  public stepMinute: number;
  public stepSecond: number;
  public selectedDirection: CalendarPeriodDirection = null;

  private _value: [Date, Date] = [null, null];
  @Input() get value(): [Date, Date] {
    return this._value;
  } set value(val: [Date, Date]) {
    if (val === this._value) {
      return;
    }

    this._value = val;
  }

  public overlay: OverlayComponent<PeriodDropdownComponent>;
  public format: string = this.DATE_FORMAT;

  private _destroy$ = new Subject<void>();

  constructor(
    private _overlayService: OverlayService,
    private _cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (this.withTime) {
      this.format = this.DATE_FORMAT_WITH_TIME;
    }

    this.stepHour = Math.floor(this.step / (60 * 60)) || 1;
    this.stepMinute = Math.floor(this.step / 60) || 1;
    this.stepSecond = this.step;
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public onSelectDirection(e: CalendarPeriodDirection): void {
    this.selectedDirection = e;
  }

  public onClick(): void {
    if (this.disabled || this.readonly) {
      return;
    }

    if (this.overlay) {
      return;
    }

    if (!this.selectedDirection) {
      this.selectedDirection = CalendarPeriodDirection.start;
    }

    const [lastFrom, lastTo] = this.value;
    this.overlay = this._overlayService.open(PeriodDropdownComponent, this.periodEl);
    this.overlay.overflowY = 'hidden';
    this.overlay.contentReady.pipe(
      takeUntil(this._destroy$)
    ).subscribe((instance: PeriodDropdownComponent) => {
      instance.instance = this;
      instance.value = this.value;
    });

    this.overlay.clickOverlay.pipe(
      takeUntil(this._destroy$)
    ).subscribe(() => {
      this.selectedDirection = null;
      this.overlay = null;
      this._cdRef.detectChanges();
      const val = this.value;

      if (lastFrom?.getTime() === val[0]?.getTime() && lastTo?.getTime() === val[1]?.getTime()) {
        return;
      }

      this.valueChange.emit(val);
    });
  }

  public toStringValue(val: Date): string {
    if (!val) {
      return null;
    }

    let str = '';
    str += val.getHours().toLocaleString(undefined, { minimumIntegerDigits: 2 });
    if (this.step < 60 * 60) {
      str += ':' + val.getMinutes().toLocaleString(undefined, { minimumIntegerDigits: 2 });
    }
    if (this.step < 60) {
      str += ':' + val.getSeconds().toLocaleString(undefined, { minimumIntegerDigits: 2 });
    }

    return str;
  }
}
