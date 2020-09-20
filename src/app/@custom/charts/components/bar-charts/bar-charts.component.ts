import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { BarChartStyle, IBarStyle, BarChartType, BarChartEquilsType, BarChart } from '@custom/charts/models/bar-chart';

@Component({
  selector: 'app-bar-charts',
  templateUrl: './bar-charts.component.html',
  styleUrls: ['./bar-charts.component.scss']
})
export class BarChartsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: BarChart[];
  @Input() barEquils: boolean;

  maxValue: number = 0;

  public objDataBars = {};

  public keyBars;

  public ticks: number[] = [];
  public heightScale: number = 274;
  public heightTicks: number;

  translateType = {
    allFrom: 'Поступило',
    answeredFrom: 'Отвечено',
    dismissedFrom: 'Пропущено',
    operatorsFrom: 'Операторы',
    allTo: 'Поступило',
    answeredTo: 'Отвечено',
    dismissedTo: 'Пропущено',
    operatorsTo: 'Операторы',
  };

  constructor() { }

  ngOnInit() { }

  ngOnChanges(): void {
    if (this.data.length > 0) {
      this.findMax();
      this.mapData();
    }
  }

  ngOnDestroy(): void { }

  findMax(): void {
    this.ticks = [];
    this.data.forEach(item => {
      item.bars.forEach(i => {
        (this.maxValue < i.count) ? this.maxValue = i.count : this.maxValue = this.maxValue;
      });
    });

    const stepTicks = Math.ceil(this.maxValue / 10);
    const countTicks = ((this.maxValue / 10) > 10) ? 10 : this.maxValue / 10;
    this.heightTicks = (this.heightScale / countTicks) - 0.5;

    let value = this.maxValue;
    this.ticks.push(value);

    for (let i = 0; i < countTicks - 1; i++) {
      value = value - Math.ceil(stepTicks);
      this.ticks.push(value);
    }
  }

  mapData(): void {
    this.objDataBars = {};
    this.data.forEach(item => {
      this._mapBars(item);
    });
    this.keyBars = Object.keys(this.objDataBars);
  }

  private _mapBars(data: BarChart): void {
    const chartStyle = new BarChartStyle();
    let type;
    if (this.barEquils) {
      type = BarChartEquilsType[data.barType];
    } else {
      type = BarChartType[data.barType];
    }

    data.bars.forEach(elem => {
      const timeTitle = this.format(elem.beginTime.getHours()) + '.' + this.format(elem.beginTime.getMinutes());

      const graphStyle: IBarStyle = chartStyle[type];
      const colorBar: string = graphStyle.barColor;

      const objectBar = {
        barCount: elem.count,
        barValue: (100 * elem.count) / this.maxValue,
        barColor: colorBar,
        barType: this.translateType[type],
      };

      if (!this.objDataBars[timeTitle]) {
        this.objDataBars[timeTitle] = [];
      }
      this.objDataBars[timeTitle].push(objectBar);
    });
  }

  public format(item: number): string | number {
    return (item < 10) ? '0' + item : item;
  }

}
