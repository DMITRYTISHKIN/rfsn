import { Component, Input, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SelectBoxSize } from '../models/select-box-size';
import { SearchPanelComponent } from '@custom/components/search-panel/search-panel.component';

@Component({
  selector: 'app-select-box-overlay',
  templateUrl: './select-box-overlay.component.html',
  styleUrls: ['./select-box-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectBoxOverlayComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('searchPanel') searchPanel: SearchPanelComponent;

  public readonly SelectBoxSize = SelectBoxSize;

  @Input() instance: any;
  @Input() server: (val: string) => Observable<any[]>;
  @Input() searchPlaceholder: string;

  public dataSource: any[];
  public notFound: boolean;
  public filterValue: string;

  public filteredItems: { [key: string]: any[] } = {};

  constructor(
    private _cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this._initializeData();
  }

  ngAfterViewInit() {
    if (this.instance.searchEnable) {
      setTimeout(() => this.searchPanel.onFocus(), 300);
    }
  }

  ngOnDestroy() {
    this.instance = null;
  }

  public onSearchFn = (e: string): Observable<any[]> => {
    if (this.server) {
      return this.server(e).pipe(
        tap(data => {
          this.dataSource = data;
          // this.instance.dataSource = data;
          this._initializeData();
          this._cdRef.detectChanges();
        })
      );
    }

    this.onChangeFilter(e);
    return of([]);
  }

  public onClearSearch(): void {
    this.dataSource = this.instance.dataSource;
  }

  public onChangeFilter(e: string): void {
    e = e.toLowerCase();

    if (this.instance.grouping && this.instance.dataSource) {
      this.dataSource.forEach(group => this.filteredItems[group[this.instance.idExpr]] = this._filter(group.children, e));
    }

    if (!this.instance.grouping && this.instance.dataSource) {
      this.dataSource = this._filter(this.instance.dataSource, e);
    }

    this.notFound = false;
    this.filterValue = e;
    this._cdRef.detectChanges();
  }

  public onClickItem(item: any): void {
    if (this.instance.selection[this.instance.valueExpr(item)]) {
      this.instance.deselect(item);
    } else {
      this.instance.select(item);
    }
  }

  public onClickEmpty(): void {
    this.instance.value = null;
    this.instance.overlay.close();
  }

  private _filter(data: any[], value: string): any[] {
    const expr = this.instance.displayExpr;
    return data.filter(i => (i[expr] || i).toString().toLowerCase().indexOf(value) > -1);
  }

  private _initializeData(): void {
    if (!this.dataSource) {
      return;
    }

    this.dataSource.forEach(i => this.filteredItems[i[this.instance.idExpr]] = i.children);
  }
}
