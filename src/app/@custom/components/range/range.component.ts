import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy,
  forwardRef, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'custom-range',
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RangeComponent  implements OnInit, ControlValueAccessor {
  @ViewChild('input', { static: true }) input: ElementRef<HTMLInputElement>;

  @Output() valueChange = new EventEmitter<number>();

  @Input() min = 1;
  @Input() max = 100;
  @Input() height = 40;
  @Input() disabled: boolean;

  private _value: number;
  @Input() get value(): number {
    return this._value;
  } set value(val: number) {
    if (val === this._value) {
      return;
    }

    this._value = val;
    this.valueChange.emit(val);
    this.onChange(val);
    this._fillLower();
    this._cdRef.detectChanges();
  }

  constructor(
    private _cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this._fillLower();
  }

  onChange: any = () => {};

  onTouched: any = () => {};

  writeValue(value: any) {
    this.value = value;
    this._cdRef.detectChanges();
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._cdRef.detectChanges();
  }

  public onChangeValue(e: Event): void {
    this.onTouched();
    this.value = +(e.target as HTMLInputElement).value;
    this._fillLower();
  }

  private _fillLower(): void {
    this.input.nativeElement.style.setProperty(
      '--webkitProgressPercent',
      `${(+this.input.nativeElement.value - this.min) * (100 / (this.max - this.min))}%`
    );
  }
}
