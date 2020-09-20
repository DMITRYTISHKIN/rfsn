import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy,
  forwardRef, ChangeDetectorRef, ViewChild, ElementRef, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { InputBehaviour } from './behaviours/input.behaviour';
import { InputBehaviours } from './behaviours/input-behaviours';
import { InputSize } from './models/input-size';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'custom-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements OnInit, ControlValueAccessor, OnChanges, OnDestroy {
  public readonly InputSize = InputSize;

  @ViewChild('input', { static: true }) input: ElementRef<HTMLInputElement>;
  @ViewChild('buffer', { static: true }) buffer: ElementRef;

  @Output() focusEvent: EventEmitter<Event> = new EventEmitter();
  @Output() blurEvent: EventEmitter<Event> = new EventEmitter();

  @Output() valueChange: EventEmitter<string> = new EventEmitter();
  @Output() iconClick: EventEmitter<void> = new EventEmitter();
  @Output() enterKey: EventEmitter<string> = new EventEmitter();
  @Output() inputClick: EventEmitter<MouseEvent> = new EventEmitter();

  @Output() arrowDown: EventEmitter<KeyboardEvent> = new EventEmitter();
  @Output() arrowUp: EventEmitter<KeyboardEvent> = new EventEmitter();

  @Input() size: InputSize;
  @Input() role = 'text';
  @Input() minWidth: number;
  @Input() autoWidth: boolean;
  @Input() step: number;
  @Input() pattern: string;
  @Input() placeholder = '';
  @Input() autocomplete: boolean;
  @Input() width: number;
  @Input() height: number;
  @Input() pure = false;
  @Input() max: number = null;
  @Input() min: number = null;
  @Input() disabled: boolean;
  @Input() autoFocus: boolean;
  @Input() icon: string;
  @Input() iconClassName: string;
  @Input() focusEmitter: EventEmitter<void>;
  @Input() blurEmitter: EventEmitter<void>;
  @Input() autoSelection: boolean;
  @Input() focusClass: boolean;
  @Input() readonly = false;
  @Input() theme: 'outlined' | 'filled' | 'underlined' = 'outlined';
  @Input() behaviour: string;
  @Input() paddingRight = 0;
  @Input() maxLength: number;
  @Input() loading: boolean;
  @Input() showClear: boolean;
  @Input() isKeyupEvent: boolean;

  public padding: number;

  private _behaviour: InputBehaviour;
  private _destroy$ = new Subject<void>();

  private _value: any = null;
  @Input() set value(val: any) {
    if (val === undefined) {
      val = null;
    }

    if (this._value === val) {
      return;
    }

    if (this._behaviour) {
      val = this._behaviour.transform(val, event, this.input.nativeElement);
    }

    this._value = val;
    this.valueChange.emit(val);
    this.onChange(val);
  } get value(): any {
    return this._value;
  }

  public isFocused: boolean;

  constructor(
    private _cdRef: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if ('readonly' in changes && this.autoWidth) {
      setTimeout(() => {
        this._calcPadding();
        this._cdRef.detectChanges();
      });
    }
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

    if (this.autoWidth) {
      this._calcPadding();
    }
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public setFocus(): void {
    this.input.nativeElement.focus();
  }

  public setBlur(): void {
    this.input.nativeElement.blur();
  }

  public onClickIcon(): void {
    this.iconClick.emit();
  }

  public onClear(e?: MouseEvent): void {
    e?.stopPropagation();
    this.value = null;
  }

  public onClick(e: MouseEvent): void {
    this.inputClick.emit(e);
  }

  public onFocus(e: Event): void {
    this.isFocused = true;
    this.focusEvent.emit(e);
    if (this.autoSelection) {
      (this.input.nativeElement as HTMLInputElement).select();
    }
  }

  public onBlur(e: Event): void {
    this.isFocused = false;
    this.blurEvent.emit(e);
  }

  public onChangeValue(e: Event): void {
    this.onTouched();
    if (this.role === 'number') {
      if (this.min !== null && this.value < this.min) {
        (e.target as HTMLInputElement).value = this.min.toString();
      }
      if (this.max !== null && this.value > this.max) {
        (e.target as HTMLInputElement).value = this.max.toString();
      }
    }
    this.value = (e.target as HTMLInputElement).value;
  }

  public onKeyup(e: Event): void {
    if (this.isKeyupEvent) {
      this.onTouched();
      this.value = (e.target as HTMLInputElement).value;
    }
  }

  public onEnter(e: Event): void {
    this.value = (e.target as HTMLInputElement).value;
    this.enterKey.emit(this.value);
    this.setBlur();
  }

  public onInput(e: Event): void {
    this.onTouched();
    const target = e.target as HTMLInputElement;
    if (this.role === 'number') {
      if (this.min !== null && +target.value < this.min) {
        target.value = this.min.toString();
      }
      if (this.max !== null && +target.value > this.max) {
        target.value = this.max.toString();
      }
    }
    this.value = target.value;
  }

  public onPaste(e: ClipboardEvent): void {
    this.onTouched();
    // this.value = e.clipboardData.getData('text/plain');
  }

  public onArrowDown(e: KeyboardEvent): void {
    this.arrowDown.emit(e);
  }

  public onArrowUp(e: KeyboardEvent): void {
    this.arrowUp.emit(e);
  }

  private _calcPadding(): void {
    const padding = Number.parseInt(window.getComputedStyle(this.input.nativeElement).paddingLeft, 10);
    this.padding = padding * 4 + 2;
  }
}
