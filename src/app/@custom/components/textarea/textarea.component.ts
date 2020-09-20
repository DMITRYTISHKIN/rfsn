import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef,
  ChangeDetectorRef, ChangeDetectionStrategy, forwardRef, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { InputBehaviour } from '../input/behaviours/input.behaviour';
import { InputBehaviours } from '../input/behaviours/input-behaviours';
import { InputSize } from '../input/models/input-size';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'custom-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaComponent implements OnInit, ControlValueAccessor, OnDestroy {
  public readonly InputSize = InputSize;

  @ViewChild('textarea', { static: true }) textarea: ElementRef<HTMLTextAreaElement>;

  @Output() focusEvent: EventEmitter<Event> = new EventEmitter();
  @Output() blurEvent: EventEmitter<Event> = new EventEmitter();

  @Output() valueChange: EventEmitter<string> = new EventEmitter();
  @Output() ctrlEnter: EventEmitter<string> = new EventEmitter<string>();
  @Output() shiftEnter: EventEmitter<string> = new EventEmitter<string>();

  @Input() placeholder = '';
  @Input() autocomplete: boolean;
  @Input() height: string;
  @Input() disabled: boolean;
  @Input() autoFocus: boolean;
  @Input() icon: string;
  @Input() focusEmitter: EventEmitter<void>;
  @Input() blurEmitter: EventEmitter<void>;
  @Input() autoResizeEnabled: boolean;
  @Input() maxHeight: string;
  @Input() pure: boolean;
  @Input() rows: number = null;
  @Input() readonly = false;
  @Input() size: InputSize;
  @Input() maxLength: number;
  @Input() behaviour: string;
  private _behaviour: InputBehaviour;

  private _value: any = '';
  @Input() set value(val: any) {
    if (val === undefined) {
      val = null;
    }

    if (this._value === val) {
      return;
    }

    if (this._behaviour) {
      val = this._behaviour.transform(val, event, this.textarea.nativeElement);
    }

    this._value = val;
    if (this.autoResizeEnabled) {
      this._calculateHeight();
    }

    this.onChange(val);
    this.valueChange.emit(val);
  } get value(): any {
    return this._value;
  }

  public isFocused: boolean;
  private _destroy$ = new Subject<void>();

  constructor(
    private _cdRef: ChangeDetectorRef
  ) { }

  onChange: any = () => {};

  onTouched: any = () => {};

  writeValue(value: any) {
    this.value = value;
    this._cdRef.detectChanges();
    if (this.autoResizeEnabled) {
      this._calculateHeight();
    }
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
    if (this.autoFocus) {
      this.setFocus();
    }

    if (this.focusEmitter) {
      this.focusEmitter.pipe(
        takeUntil(this._destroy$)
      ).subscribe(this.setFocus.bind(this));
    }

    if (this.blurEmitter) {
      this.blurEmitter.pipe(
        takeUntil(this._destroy$)
      ).subscribe(this.setBlur.bind(this));
    }

    if (this.behaviour && InputBehaviours[this.behaviour]) {
      this._behaviour = new InputBehaviours[this.behaviour]();
    }
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public reculc(): void {
    this._calculateHeight();
  }

  public setFocus(pos?: number): void {
    this.textarea.nativeElement.focus();

    if (pos) {
      this.textarea.nativeElement.setSelectionRange(pos, pos);
    }
  }

  public setBlur(): void {
    this.textarea.nativeElement.blur();
  }

  public onFocus(e: Event): void {
    this.isFocused = true;
    this.focusEvent.emit(e);
  }

  public onBlur(e: Event): void {
    this.isFocused = false;
    this.blurEvent.emit(e);
  }

  public onChangeValue(e: Event): void {
    this.onTouched();
    this.value = (e.target as HTMLInputElement).value;
  }

  public onKeyup(e: Event): void {
    this.onTouched();
    this.value = (e.target as HTMLInputElement).value;
  }

  public onCtrlEnter(e: KeyboardEvent): void {
    this.onTouched();
    this.value = (e.target as HTMLInputElement).value;
    this.ctrlEnter.emit(this.value);
  }

  public onShiftEnter(e: KeyboardEvent): void {
    e.preventDefault();

    this.onTouched();
    this.value = (e.target as HTMLInputElement).value;
    this.shiftEnter.emit(this.value);
  }

  public onInput(e: Event): void {
    this.onTouched();
    this.value = (e.target as HTMLInputElement).value;
  }

  public onPaste(e: Event): void {
    this.onTouched();
    this.value = (e.target as HTMLInputElement).value;
  }

  private _calculateHeight(): void {
    if (!this.textarea) {
      return;
    }

    const el = this.textarea.nativeElement as HTMLTextAreaElement;
    el.style.height = 'auto';
    el.style.height = (el.scrollHeight + 2) + 'px';
  }
}
