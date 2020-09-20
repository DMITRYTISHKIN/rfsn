import { Component, OnInit, Input, TemplateRef, Output, EventEmitter, forwardRef,
  ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'custom-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioComponent implements OnInit, ControlValueAccessor {
  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  @Input() idExpr = 'id';
  @Input() displayExpr = 'name';
  @Input() disabled: boolean;
  @Input() itemTemplate: TemplateRef<any>;
  @Input() dataSource: any[];

  private _value: any;
  @Input() set value(val: any) {
    if (val === this._value) {
      return;
    }

    this._value = val;
    this.valueChange.emit(val);
    this.onChange(val);
  } get value() {
    return this._value;
  }

  constructor(
    private _cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() { }

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

  public onClickRadio(e: MouseEvent, value: any): void {
    this.value = value;
  }

  public displayExprFn = (item: any): any => {
    return item ? (item[this.displayExpr] !== undefined ? item[this.displayExpr] : item) : null;
  }
}
