import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2, TemplateRef, Output, EventEmitter, OnChanges } from '@angular/core';
import { PeriodDate } from '@custom/components/period-date/models/period-date';
import { HtmlExportService } from '@custom/common/services/html-export.service';

@Component({
  selector: 'app-report-chart-container',
  templateUrl: './report-chart-container.component.html',
  styleUrls: ['./report-chart-container.component.scss']
})
export class ReportChartContainerComponent implements OnInit, OnChanges {
  @ViewChild('container', { static: true }) container: ElementRef;
  @ViewChild('exportLine', { static: true }) exportLine: ElementRef;

  @Output() changePeriod: EventEmitter<PeriodDate> = new EventEmitter();
  @Output() filterChoose: EventEmitter<number[]> = new EventEmitter();
  @Output() changeSelectBox: EventEmitter<any> = new EventEmitter();
  @Output() pointClick: EventEmitter<any> = new EventEmitter();

  @Input() templateTable: TemplateRef<any>;

  @Input() data: any;
  @Input() typeGraph: 'line-chart' | 'bar-chart';
  @Input() titleChart: string;
  @Input() timeScale: number = 60;
  @Input() legends: string[] = ['Обработано', 'Поступило'];
  @Input() filter: boolean = false;
  @Input() switchEva: boolean = false;
  @Input() widthSvg: number = 610;
  @Input() dragScroll: boolean = false;
  @Input() exportGraph: boolean;
  @Input() dateSelect: boolean;
  @Input() dateTimeSelect: boolean;
  @Input() barEquils: boolean;
  @Input() resetFilter: boolean;
  @Input() dateSelectDays: boolean;
  @Input() dataSelectBox: any;

  @Input() period = new PeriodDate(
    new Date().withoutTime(),
    new Date().withoutTime()
  );

  public periodDates: PeriodDate;

  public periodTo;
  public periodFrom;

  public dateNow = new Date();

  public filterButton: number[] = [];

  public legendsState = {};

  constructor(
    private exportService: HtmlExportService,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    this.periodDates = Object.assign({}, this.period);
    this._mapLegends();
  }

  ngOnChanges(): void {
    if (this.resetFilter) {
      this.filterButton = [];
      this._mapLegends();
    }
  }

  private _mapLegends(): void {
    this.legends.forEach(i => this.legendsState[i] = false);
  }

  public onExport(): void {
    const reference = this.renderer.createElement('a');
    this.exportService.exportToType(this.exportLine, reference, 'png');
  }

  public onChangeHours(e: Date, direction: 'from' | 'to'): void {
    if (!e) {
      return;
    }

    if (direction === 'to' && e.getHours() === 0) {
      const nextDay = new Date(this.period.from).addDays(1);
      this.period[direction].setDate(nextDay.getDate());
      this.period[direction].setHours(0, 0, 0, 0);
    } else {
      this.period[direction].setDate(this.period.from.getDate());
    }

    this.period[direction].setHours(e.getHours(), e.getMinutes(), 0, 0);
    if (this.period.from.getTime() === this.period.to.getTime()) {
      this.period.to.setHours(this.period.to.getHours(), this.period.to.getMinutes(), 59, 999);
    }

    this.changePeriod.emit(this.period);
  }

  public onChangePeriod(e: Date): void {
    const eventDay = e.getDate();
    const eventMonth = e.getMonth();
    const dayToday = e.getFullYear() + '.' + e.getMonth() + '.' + e.getDate();
    const dayChoose = this.dateNow.getFullYear() + '.' + this.dateNow.getMonth() + '.' + this.dateNow.getDate();

    this.period.from.setMonth(eventMonth, eventDay);
    this.period.from.setHours(0, 0, 0, 0);
    this.period.to.setMonth(eventMonth, eventDay + 1);
    if (dayToday === dayChoose) {
      this.period.to.setDate(this.dateNow.getDate());
      this.periodFrom = new Date(this.period.to.setHours(0, 0, 0, 0));
      this.periodTo = new Date(this.period.to.setHours(this.dateNow.getHours()));
    } else {
      this.periodFrom = new Date(this.period.from.setHours(0, 0, 0, 0));
      this.periodTo = new Date(this.period.to.setHours(0, 0, 0, 0));
    }

    this.changePeriod.emit(this.period);
  }

  public onChangeDays(e: PeriodDate): void {
    this.changePeriod.emit(e);
  }

  public onChangePeriodType(e: Date, direction: 'from' | 'to'): void {
    this.period[direction] = e;

    const dayTo = this.period.to.getFullYear() + '.' + this.period.to.getMonth() + '.' + this.period.to.getDate();
    const dayFrom = this.period.from.getFullYear() + '.' + this.period.from.getMonth() + '.' + this.period.from.getDate();
    const dayNow = this.dateNow.getFullYear() + '.' + this.dateNow.getMonth() + '.' + this.dateNow.getDate();

    if ((dayTo === dayFrom) && (dayTo === dayNow)) {
      this.period.from.setHours(new Date().getHours(), 0, 0, 0);
      this.period.to.setHours(new Date().getHours(), 0, 0, 0);
    } else {
      this.period.from.setHours(23, 59, 59, 999);
      this.period.to.setHours(23, 59, 59, 999);
    }
    this.changePeriod.emit(this.period);
  }

  public onChangedSelectBox(e: any) {
    this.changeSelectBox.emit(e);
  }

  public onFilterButton(event: MouseEvent, item: string, index: number): void {
    const i = this.filterButton.indexOf(index);
    this.legendsState[item] = !this.legendsState[item];
    if (i !== -1) {
      this.filterButton.splice(i, 1);
    } else {
      this.filterButton.push(index);
    }
    this.filterChoose.emit(this.filterButton);
  }

  public onPointClick(e: any): void {
    this.pointClick.emit(e);
  }
}
