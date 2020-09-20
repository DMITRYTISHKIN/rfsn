import { Component, OnInit, Input, TemplateRef, ViewChild, Output, EventEmitter,
  ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { TooltipService } from '../tooltip/tooltip.service';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-tooltip-menu',
  templateUrl: './tooltip-menu.component.html',
  styleUrls: ['./tooltip-menu.component.scss']
})
export class TooltipMenuComponent implements OnInit, OnChanges {
  @ViewChild('defaultDisplayTemplate', { static: true }) defaultDisplayTemplate: TemplateRef<any>;
  @ViewChild('defaultItemTemplate', { static: true }) defaultItemTemplate: TemplateRef<any>;

  @Output() itemClick = new EventEmitter<any>();

  @Input() position: 'top' | 'right' | 'bottom' | 'left' | 'auto' = 'auto';
  @Input() customItemTemplate: TemplateRef<any>;
  @Input() customDisplayTemplate: TemplateRef<any>;

  @Input() showExpander: boolean;
  @Input() displayExpr = 'name';
  @Input() idExpr = 'id';
  @Input() dataSource: any[];
  @Input() additions: any[];
  @Input() selection: boolean;
  @Input() grouping: boolean;
  @Input() searchEnable: boolean;
  @Input() disabled: boolean;

  public filteredItems: { [key: string]: any[] } = {};
  public filterValue: string;
  public notFound: boolean;

  public displayTemplate: TemplateRef<any>;
  public itemTemplate: TemplateRef<any>;

  private _value: any;
  @Input() set value(val: any) {
    this._value = val;
  } get value(): any {
    return this._value;
  }

  public selected: any;
  private _idTooltip: string;

  constructor(
    private _cdRef: ChangeDetectorRef,
    private _tooltipService: TooltipService,
  ) { }

  ngOnInit() {
    this.displayTemplate = this.customDisplayTemplate || this.defaultDisplayTemplate;
    this.itemTemplate = this.customItemTemplate || this.defaultItemTemplate;
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('dataSource' in changes) {
      this._initializeData();
    }
  }

  public onOpen(id: any): void {
    this._idTooltip = id;
  }

  public onClose(): void {
    this.onClearSearch();
  }

  public onClickItem(item: any, id: any): void {
    this._tooltipService.destroy(id);

    this.itemClick.emit(item);
    if (this.selection) {
      this.value = item;
    }
  }

  public onClearSearch(): void {
    this.filteredItems = {};
    this._initializeData();
    this._cdRef.detectChanges();
    this._tooltipService.refresh(this._idTooltip);
  }

  public onChangeFilter(e: string): void {
    e = e.toLowerCase();

    if (this.grouping && this.dataSource) {
      this.dataSource.forEach(group => this.filteredItems[group[this.idExpr]] = this._filterGroup(group, e));
    }

    if (!this.grouping && this.dataSource) {
      this.dataSource = this._filter(this.dataSource, e);
    }

    this.notFound = false;
    this.filterValue = e;

    this._cdRef.detectChanges();
    this._tooltipService.refresh(this._idTooltip);
  }

  public onSearchFn = (e: string): Observable<any[]> => {
    this.onChangeFilter(e);
    return of([]);
  }

  private _initializeData(): void {
    if (!this.dataSource) {
      return;
    }

    this.dataSource.forEach(i => this.filteredItems[i[this.idExpr]] = i.children);
  }

  private _filter(data: any[], value: string): any[] {
    const expr = this.displayExpr;
    return data.filter(i => i[expr] && i[expr].toString().toLowerCase().indexOf(value) > -1);
  }

  private _filterGroup(group: any, value: string): any[] {
    const expr = this.displayExpr;
    if (group[this.idExpr].toString().toLowerCase().indexOf(value) > -1) {
      return group.children;
    }

    return group.children.filter(i => i[expr] && i[expr].toString().toLowerCase().indexOf(value) > -1);
  }
}
