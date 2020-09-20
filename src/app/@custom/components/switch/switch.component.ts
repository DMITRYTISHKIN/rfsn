import { Component, OnInit, Input, Output, EventEmitter, ElementRef, forwardRef,
  ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'custom-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwitchComponent implements OnInit, ControlValueAccessor {
  @Output() valueChange: EventEmitter<boolean> = new EventEmitter();

  @Input() label: string;
  @Input() hint: string;
  @Input() disabled: boolean;
  @Input() set value(val: boolean) {
    if (val === this._value) {
      return;
    }

    this._value = val;
    this.valueChange.emit(val);
    this.onChange(val);
  } get value() {
    return this._value;
  }
  private _value: boolean;

  constructor(
    public elementRef: ElementRef,
    private _cdRef: ChangeDetectorRef
  ) { }

  onChange: any = () => {};

  onTouched: any = () => {};

  writeValue(value: boolean) {
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

  ngOnInit() { }

  public onClick(e: MouseEvent): void {
    e.stopPropagation();
    this.onTouched();

    this.value = !this.value;
  }
}
