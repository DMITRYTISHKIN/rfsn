import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef,
  OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { TimeIntervalService } from '@custom/common/services/time-interval.service';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'custom-time-interval',
  templateUrl: './time-interval.component.html',
  styleUrls: ['./time-interval.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeIntervalComponent implements OnInit, OnDestroy, OnChanges {
  public value: number;

  @Input() numberUpdate: number;
  @Input() date: Date;
  @Input() format = 'hh:mm';
  @Input() interval = 1000 * 60;
  @Input() direction: 'from' | 'to' = 'from';
  @Input() placeholder: string;

  private fn: () => number;
  private _destroy$ = new Subject();
  private _intervalSubs: Subscription;

  get val(): string {
    const diff = this.fn();
    const val: string[] = [];

    if (/hh/.test(this.format)) {
      val.push(this.valToStr(Math.abs(Math.floor(((diff / 1000) / 60) / 60))));
    }
    if (/mm/.test(this.format)) {
      val.push(this.valToStr(Math.abs(Math.floor(((diff / 1000) / 60) % 60))));
    }
    if (/ss/.test(this.format)) {
      val.push(this.valToStr(Math.abs(Math.floor((diff / 1000) % 60))));
    }

    return val.join(':');
  }

  constructor(
    public timeIntervalService: TimeIntervalService,
    private _cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (!this.direction) {
      throw new Error('Need to set "direction" attribute');
    }

    this.fn = this[`${this.direction}Date`];
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('date' in changes && this.date) {
      if (this.interval) {
        if (this._intervalSubs) {
          this._intervalSubs.unsubscribe();
          this._intervalSubs = null;
        }

        this._intervalSubs = this.timeIntervalService.getInterval(this.interval, 0).pipe(
          takeUntil(this._destroy$)
        ).subscribe((value) => {
          this._cd.detectChanges();
        });
      }
    }
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public fromDate = (): number => {
    return new Date().getTime() - this.date.getTime();
  }

  public toDate = (): number => {
    return this.date.getTime() - new Date().getTime();
  }

  private valToStr(val: number): string {
    return val > 9 ? val.toString() : '0' + val;
  }
}
