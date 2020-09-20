import { Component, OnInit, Input, Output, EventEmitter, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'custom-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CounterComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent implements OnInit, ControlValueAccessor {
  @Output() valueChange: EventEmitter<number> = new EventEmitter();

  @Input() height = 20;
  @Input() max: number;
  @Input() min: number;
  @Input() step = 1;
  @Input() disabled: boolean;
  @Input() pattern: string;

  private _value = 0;
  @Input() set value(val: number) {
    if (val > this.max) {
      val = this.max;
    } else if (val < this.min) {
      val = this.min;
    }

    if (this._value === val) {
      return;
    }

    this._value = val;
    if (this._initialized) {
      this.valueChange.emit(val);
    }

    this.onChange(val);
  } get value(): number {
    return this._value;
  }

  private _initialized: boolean;

  constructor(
    private _cdRef: ChangeDetectorRef
  ) { }

  onChange: any = () => {};

  onTouched: any = () => {};

  writeValue(value: number) {
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

  ngOnInit() {
    this._initialized = true;
  }

  public onFocus(): void {
    this.onTouched();
  }

  public onChangeValue(val: number): void {
    this.value = +val;
  }

  public onIncrement(): void {
    this.onTouched();
    this.value = this.value + 1;
  }

  public onDecrement(): void {
    this.onTouched();
    this.value = this.value - 1;
  }
}
