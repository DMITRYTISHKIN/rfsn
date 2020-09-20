import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'custom-wb-icon',
  templateUrl: './wb-icon.component.html',
  styleUrls: ['./wb-icon.component.scss']
})
export class WbIconComponent implements OnInit, OnChanges {
  @Input() size: string;
  @Input() color: string;
  @Input() classes: string[];
  @Input() icon: string;
  @Output() iconClick: EventEmitter<any>;

  constructor() {
    this.iconClick = new EventEmitter<any>();
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if ('icon' in changes && this.icon) {
      this.icon = this.icon.toKebabCase();
    }
  }

  public iconClicked(e): void {
    this.iconClick.emit(e);
  }


}
