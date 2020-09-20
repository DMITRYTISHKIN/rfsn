import { Component, OnInit, Input, TemplateRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { TGridSortDirection } from '../models/tgrid-sort-direction';
import { TGridFilter } from '../models/tgrid-filter';

@Component({
  selector: 'app-tgrid-column',
  templateUrl: './tgrid-column.component.html',
  styleUrls: ['./tgrid-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TGridColumnComponent implements OnInit {
  @ViewChild('default', { static: true }) default: TemplateRef<any>;

  @Input() key: string;
  @Input() name: string;
  @Input() sort: TGridSortDirection = TGridSortDirection.None;
  @Input() allowSort: boolean;
  @Input() allowFilter: boolean;
  @Input() inlineFilter: boolean;
  @Input() template: TemplateRef<any> = this.default;
  @Input() width = 'auto';
  @Input() maxWidth: number;
  @Input() notClickable: boolean;

  public filter: TGridFilter[] = [];
  public filterActive = false;


  constructor() { }

  ngOnInit() {
    this.template = this.template || this.default;
  }
}
