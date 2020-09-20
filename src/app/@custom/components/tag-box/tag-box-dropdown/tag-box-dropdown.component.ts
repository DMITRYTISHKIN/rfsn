import { Component, OnInit, Input } from '@angular/core';
import { InputSize } from '@custom/components/input/models/input-size';

@Component({
  selector: 'app-tag-box-dropdown',
  templateUrl: './tag-box-dropdown.component.html',
  styleUrls: ['./tag-box-dropdown.component.scss']
})
export class TagBoxDropdownComponent implements OnInit {
  public readonly InputSize = InputSize;

  @Input() instance: any;

  @Input() dataSource: any[];
  public notFound: boolean;
  public filterValue: string;

  constructor() { }

  ngOnInit() { }

  public onChangeFilter(e: string): void {
    if (this.instance.dataSource) {
      this.dataSource = this.instance.dataSource.filter(i => this.instance.displayExprFn(i).indexOf(e) > -1);
    }

    this.notFound = false;
    this.filterValue = e;
  }

  public onClickItem(item: any): void {
    if (this.instance.selected[this.instance.valueExpr(item)]) {
      this.instance.deselect(item);
    } else {
      this.instance.select(item);
    }
  }

  public onResultUpdate(data: any[]): void {
    this.dataSource = data;
    if (data && data.length === 0) {
      this.notFound = true;
    } else if (!data) {
      this.notFound = false;
    }
  }

  public onClearSearch(): void {
    this.dataSource = [];
    this.notFound = false;
  }
}
