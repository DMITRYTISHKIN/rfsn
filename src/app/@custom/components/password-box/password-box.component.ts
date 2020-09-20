import { Component, OnInit, forwardRef, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputSize } from '../input/models/input-size';

@Component({
  selector: 'custom-password-box',
  templateUrl: './password-box.component.html',
  styleUrls: ['./password-box.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordBoxComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordBoxComponent implements OnInit {
  @Output() valueChange: EventEmitter<string> = new EventEmitter();
  @Output() enterKey: EventEmitter<string> = new EventEmitter();

  @Input() placeholder: string;
  @Input() theme: 'outlined' | 'filled' | 'underlined' = 'outlined';
  @Input() size: InputSize;

  private _value: any = null;
  @Input() set value(val: any) {
    if (val === undefined) {
      val = null;
    }

    if (this._value === val) {
      return;
    }

    this._value = val;
    this.valueChange.emit(val);
    this.onChange(val);
  } get value(): any {
    return this._value;
  }

  public showPassword: boolean;

  constructor() { }

  ngOnInit() { }

  onChange: any = () => {};

  onTouched: any = () => {};

  writeValue(value: any) {
    this.value = value;
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  public onEnter(e: Event): void {
    this.enterKey.emit(this.value);
  }

  public onShowPassword(e): void {
    this.showPassword = !this.showPassword;
  }
}
