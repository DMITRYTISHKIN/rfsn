import { Component, OnInit, TemplateRef, Input, EventEmitter, Output, ViewChild, ElementRef,
  ChangeDetectorRef, forwardRef, ViewChildren, QueryList, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { OverlayService } from '@custom/common/services/overlay.service';
import { OverlayComponent } from '@custom/common/components/overlay/overlay.component';
import { TagBoxDropdownComponent } from './tag-box-dropdown/tag-box-dropdown.component';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Observable } from 'rxjs';
import { InputComponent } from '../input/input.component';
import { InputSize } from '../input/models/input-size';

@Component({
  selector: 'custom-tag-box',
  templateUrl: './tag-box.component.html',
  styleUrls: ['./tag-box.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagBoxComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagBoxComponent implements OnInit, ControlValueAccessor, AfterViewInit {
  public readonly InputSize = InputSize;

  @ViewChildren('tag') tags: QueryList<ElementRef<any>>;
  @ViewChild('input') input: InputComponent;
  @ViewChild('tagBox', { static: true }) tagBox: ElementRef<HTMLDivElement>;
  @ViewChild('displayTextTemplateDefault', { static: true }) displayTextTemplateDefault: TemplateRef<any>;

  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  @Output() tagClick: EventEmitter<any> = new EventEmitter();

  @Input() displayTextTemplate: TemplateRef<any>;
  @Input() dropdownTextTemplate: TemplateRef<any>;
  @Input() dropdownAdditionTemplate: TemplateRef<any>;
  @Input() allowInput: boolean;
  @Input() allowCollapse: boolean;
  @Input() placeholder = '';
  @Input() size: InputSize;

  @Input() dataSource: any[];
  @Input() serverDataSource: (val: string) => Observable<any[]>;
  @Input() displayExpr = 'name';
  @Input() idExpr = 'id';
  @Input() height = 44;
  @Input() width: number;
  @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Input() showSearch = true;
  @Input() placeholderSearch = 'Поиск...';
  @Input() closeAfterSelect = false;
  @Input() minLengthResult = 1;

  public selected: { [key: string]: any } = {};

  public collapsedCount: number;

  private _value: any[] = [];
  @Input() set value(val: any[]) {
    if (!val) {
      val = [];
    }

    this._value = [...val];

    this.selected = {};
    this._value.forEach(i => this.selected[this.valueExpr(i)] = i);
    this.onChange(val);
    this.valueChange.emit(val);

    this._calcCollapse();
    if (this.overlay) {
      this.overlay.resize();
    }
  } get value(): any[] {
    return this._value;
  }

  public overlay: OverlayComponent<TagBoxDropdownComponent>;

  constructor(
    private _overlayService: OverlayService,
    private _cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this._calcCollapse();
  }

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

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public onMouseDown(e: MouseEvent): void {
    if (!this.overlay) {
      return;
    }

    e.stopPropagation();
  }

  public onExpand(e: MouseEvent): void {
    if (!this.overlay) {
      e.stopPropagation();
    }

    this.collapsedCount = this.collapsedCount === null ? 0 : null;
    this._calcCollapse();
  }

  public onClick(): void {
    if (this.disabled || this.readonly) {
      return;
    }

    if (this.overlay) {
      this.overlay.close();
      return;
    }

    if (!this.dataSource?.length && !this.serverDataSource) {
      return;
    }

    this.overlay = this._overlayService.open(TagBoxDropdownComponent, this.tagBox);
    if (this.allowInput) {
      this.input.setFocus();
    }

    this.overlay.contentReady.subscribe((instance: TagBoxDropdownComponent) => {
      instance.instance = this;
      instance.dataSource = this.dataSource;
    });
    this.overlay.clickOverlay.subscribe(() => {
      this.overlay = null;
      this._cdRef.detectChanges();
    });
  }

  public onTagClick(item: any): void {
    this.tagClick.emit(item);
  }

  public onEnterInput(e: string): void {
    this.input.value = '';
    this.select(e);
  }

  public onRemove(e: MouseEvent, item: any): void {
    e.stopPropagation();
    this.deselect(item);
  }

  public deselect(item: any): void {
    this.value = this.value.filter(i => this.valueExpr(i) !== this.valueExpr(item));
    if (this.closeAfterSelect && this.overlay) {
      this.overlay.close();
    }
  }

  public select(item: any): void {
    this.value = [...this.value, item];
    if (this.closeAfterSelect && this.overlay) {
      this.overlay.close();
    }
  }

  public valueExpr = (item: any): any => {
    return item ? (item[this.idExpr] !== undefined ? item[this.idExpr] : item) : null;
  }

  public displayExprFn = (item: any): any => {
    return item ? (item[this.displayExpr] !== undefined ? item[this.displayExpr] : item) : null;
  }

  public sliceValue = (value: any[], count: number) => count ? value.slice(0, value.length - count) : value;

  private _calcCollapse(): void {
    if (this.collapsedCount === null) {
      return;
    }

    this.collapsedCount = 0;
    this._cdRef.detectChanges();

    if (!this.tags || !this.allowCollapse) {
      return;
    }

    let widthTotal = 40;
    let expandedCount = 0;
    const widthContainer = this.tagBox.nativeElement.getBoundingClientRect().width;
    const tags = this.tags.toArray();

    for (const tag of tags) {
      if (widthTotal >= widthContainer) {
        expandedCount--;
        break;
      }

      const el = tag.nativeElement;
      const { width } = el.getBoundingClientRect();
      widthTotal += width + Number.parseInt(window.getComputedStyle(el).marginRight, 10);
      expandedCount++;
    }

    this.collapsedCount = this.value.length - expandedCount;
    this._cdRef.detectChanges();
  }
}
