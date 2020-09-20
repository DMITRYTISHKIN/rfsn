import {
  Component,
  OnInit,
  OnChanges,
  ViewChild,
  ElementRef,
  Input,
  ChangeDetectionStrategy,
  AfterViewInit,
  Renderer2,
  Output,
  EventEmitter
} from '@angular/core';
import * as d3Selection from 'd3-selection';
import * as d3 from 'd3';
import {
  ILineChart,
  IChartMini,
  IChartD3,
  ChartStyle,
  IPointChart,
  IChartStyle,
  IPointAdditional,
  IPointD3,
} from '../../models/line-chart';
import { PeriodDate } from '@custom/components/period-date/models/period-date';
import { TooltipService } from '@custom/components/tooltip/tooltip.service';
import { DateFormatPipe } from '@custom/common/pipes/data-format.pipe';

@Component({
  selector: 'app-report-line-chart',
  templateUrl: './report-line-chart.component.html',
  styleUrls: ['./report-line-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportLineChartComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('chart') private chart: ElementRef;
  @ViewChild('scale') private scale: ElementRef;

  @Output() pointClick: EventEmitter<any> = new EventEmitter();

  @Input() data: ILineChart[] = [];
  @Input() isShowingLegend: boolean = false;
  @Input() dragBlock: boolean = false;
  @Input() timeScale = 60;
  @Input() width: number;
  @Input() height: number = 331;
  @Input() dragScroll: boolean = false;
  @Input() period: PeriodDate;
  @Input() legends: string[];

  public points: IPointChart[] = [];

  typeText = {
    today: 'Сегодня',
    yesterday: 'Вчера',
    week1: '1 нед',
    week2: '2 нед',
    all: 'Поступившие',
    answered: 'Принятые',
    dismissed: 'Пропущенные'
  };

  private svgGraph = null;
  private svgScale = null;

  private ticks: number;
  private svgShift: number;

  private chartData: {
    graph: IChartD3[];
    numberLine?: number;
    isSingleDate?: boolean;
  }[] = [];


  private axis: { axisX: any; axisY: any } = { axisX: null, axisY: null };

  public graphMaxX: number = null;
  public graphMaxY: number = null;

  private dataMax: number = null;
  private dataMin: number = null;

  public scaleFuncs: { x: any; y: any } = { x: null, y: null };

  public readonly padding: { [key: string]: number } = {
    top: 20,
    right: 0,
    bottom: 30,
    left: 0,
  };

  public isDate: boolean;

  constructor(
    private _dateFormatPipe: DateFormatPipe,
    private _tooltipService: TooltipService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.dateFormatLocale();
  }

  ngAfterViewInit(): void {
    this._drawGrapg();
  }

  public ngOnChanges(): void {
    this._drawGrapg();
  }

  private _drawGrapg(): void {
    if (this.data.length > 0 && this.chart) {
      if (this.svgGraph) {
        this.svgGraph.remove();
        this.svgScale.remove();
      }
      this.findMinMax();
      this.transformData();
      this.drawAxis();
      this.drawYAxis();
      this.drawGraph();
      this.points = this.mapPoints();
      this.scaleFuncs = this.scaleFuncs;
      this.drawPoints();
    }
  }

  private initGraph(): void {
    this.svgGraph = d3Selection.select(this.chart.nativeElement).append('svg');

    // this.graphMaxX = (+d3Selection
    //   .select(this.chart.nativeElement)
    //   .style('width')
    //   .slice(0, -2)) * this.svgWidth;
    this.graphMaxX = this.width;

    this.graphMaxY = +d3Selection
      .select(this.chart.nativeElement)
      .style('height')
      .slice(0, -2);
  }

  private findMinMax(): void {
    const maxValues: number[] = [];
    const minValues: number[] = [];

    this.data.forEach((graph) => {
      maxValues.push(d3.max(graph.graph, (item: IChartMini) => item.count));
      minValues.push(d3.min(graph.graph, (item: IChartMini) => item.count));
      this.isDate = (!!graph.isSingleDate);
    });

    const lenMax = String(d3.max(maxValues)).length;
    const sizeMax = Math.pow(10, (lenMax - 1));
    const maxValue = Math.ceil(d3.max(maxValues) / sizeMax);
    this.dataMax = (maxValue === 0) ? 10 : maxValue * sizeMax;
    this.dataMin = 0;
  }

  private transformData(): void {
    this.chartData = [];

    const domainDates = [this.period.from, this.period.to];

    // const domainDates = d3.extent(chart.graph, (item: IChartMini) => item.timestamp); /// ОСЬ Х С ДАННЫМИ

    this._timeScale(this.timeScale, this.period);

    this.initGraph();

    this.data.forEach((item) => this.transformOneChartData(item, domainDates));
  }

  private transformOneChartData(chart: ILineChart, domainDates): void {
    const rangeX = [this.padding.left, this.graphMaxX - this.padding.right];

    this.scaleFuncs.x = d3
      .scaleTime()
      .domain(domainDates)
      .rangeRound(rangeX);

    const domainValues = [this.dataMax, this.dataMin];
    const rangeY = [this.padding.top, this.graphMaxY - this.padding.bottom];
    this.scaleFuncs.y = d3
      .scaleLinear()
      .domain(domainValues)
      .range(rangeY);

    this.axis.axisX = d3
      .axisBottom(this.scaleFuncs.x)
      .ticks(this.ticks) /// Просчет точек на Х координате
      .tickFormat(this.dateFormatLocale())
      .tickSizeOuter(0);
    this.axis.axisY = d3
      .axisLeft(this.scaleFuncs.y)
      .ticks(10)
      .tickSize(0);

    const chartData: {
      graph: IChartD3[];
      numberLine?: number;
      isSingleDate?: boolean;
    } = {
      graph: [],
      numberLine: chart.numberLine,
      isSingleDate: chart.isSingleDate,
    };

    chart.graph.forEach((item) => {
      chartData.graph.push({
        x: this.scaleFuncs.x(item.beginTime),
        y: this.scaleFuncs.y(item.count),
      });
    });

    this.chartData.push(chartData);
  }
  private drawGraph(): void {
    this.svgGraph
      .attr('width', this.graphMaxX)
      .attr('height', '321px')
      .attr('overflow', 'visible')
      .attr('viewBox', `${this.svgShift} 0 ${this.graphMaxX} ${this.graphMaxY - 5}`);

    const chartStyle = new ChartStyle();

    this.chartData.forEach((chart) => {
      const line = d3
        .line()
        .curve(d3.curveMonotoneX)
        .x((item: IChartD3) => item.x)
        .y((item: IChartD3) => item.y);

      const graphStyle: IChartStyle = chartStyle['line' + chart.numberLine];

      const lineWidth: number = graphStyle.lineWidth;
      const lineColor: string = graphStyle.lineColor;

      this.svgGraph
        .append('path')
        .attr('class', `graph-line-${chart.numberLine}`)
        .attr('d', line(chart.graph))
        .style('fill', 'none')
        .style('stroke', lineColor)
        .style('stroke-width', lineWidth)
        .style('stroke-dasharray', chartStyle.drawLineType(graphStyle));
    });
  }

  private drawAxis(): void {
    // отрисовка оси у
    this.svgGraph
      .append('g')
      .attr('transform', `translate(${this.padding.left},0)`)
      .attr('class', 'axis-y')
      .call(this.axis.axisY)
      .selectAll('text')
      .style('font-size', '1px')
      .style('fill', 'white');

    // отрисовка оси х
    this.svgGraph
      .append('g')
      .attr('transform', `translate(0,${this.graphMaxY - this.padding.bottom})`)
      .attr('class', 'axis-x')
      .call(this.axis.axisX)
      .selectAll('text')
      .attr('dy', '1.5em')
      .style('font-size', '12px')
      .style('fill', '#8c99b2');

    // this.svgGraph.select('g.axis-x:first-of-type g.tick text:first-of-type').remove();

    // изменение цветов осей
    let g = this.svgGraph.selectAll('g.axis');
    g.style('color', '#ffffff');

    this.drawGridLines();
    // this.drawLegend();
  }

  private drawYAxis(): void {
    this.svgScale = d3Selection.select(this.scale.nativeElement).append('svg');

    this.svgScale
      .attr('width', '45')
      .attr('height', '331')
      .attr('viewBox', `10 -5 33 ${this.graphMaxY}`);

    this.svgScale
      .append('g')
      .attr('transform', `translate(45, -6)`)
      .attr('class', 'axis')
      .call(this.axis.axisY)
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#8c99b2');

    this.svgScale.select('g.axis path').remove();
  }

  // отрисовка сетки координат
  private drawGridLines(): void {
    this.svgGraph
      .selectAll('g.axis-y:first-of-type g.tick')
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', this.graphMaxX - this.padding.right - this.padding.left)
      .attr('y2', 0)
      .style('opacity', '0.2')
      .style('stroke', '#8c99b2');

    this.svgGraph.select('g.axis-y .domain').remove();

    this.svgGraph
      .selectAll('g.axis-x .tick')
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', -this.graphMaxY + 51)
      .style('opacity', '0.2')
      .style('stroke', '#8c99b2');

    // this.svgGraph
    //   .append('line')
    //   .attr('x1', 0)
    //   .attr('y1', 0)
    //   .attr('x2', 0)
    //   .attr('y2', -this.graphMaxY + 51)
    //   .style('opacity', '0.2')
    //   .style('stroke', '#8c99b2');

    this.svgGraph
      .append('line')
      .attr('x1', this.graphMaxX)
      .attr('y1', 20)
      .attr('x2', this.graphMaxX)
      .attr('y2', this.graphMaxY - 30)
      .style('opacity', '0.2')
      .style('stroke', '#8c99b2');

    // this.svgGraph
    //   .append('line')
    //   .attr('x1', 0)
    //   .attr('y1', 20)
    //   .attr('x2', 0)
    //   .attr('y2', this.graphMaxY - 30)
    //   .style('opacity', '0.2')
    //   .style('stroke', '#8c99b2');

    this.svgGraph.selectAll('g.axis-x g.tick line:first-of-type').remove();
    // this.svgGraph.selectAll('g.axis-x g.tick:first-of-type text').remove();
    this.svgGraph.select('g.axis-x .domain').remove();
  }

  private mapPoints(): any {
    const arrayPoint = [];
    this.data.forEach((line, index) => line.graph.forEach(point => {
      const typePoint: IPointAdditional = {
        value: point.count,
        lineType: line.numberLine,
      };
      const obj: IPointChart = {
        timestamp: point.beginTime,
        value: point.count,
        additional: typePoint,
        isSingleDate: line.isSingleDate,
      };
      arrayPoint.push(obj);
    }));
    return arrayPoint;
  }

  private dateFormatLocale(): (date: Date) => string {
    const locale = d3.timeFormatLocale({
      dateTime: '%A, %e %B %Y г. %X',
      date: '%d.%m.%Y',
      time: '%H:%M:%S',
      periods: ['', ''],
      days: [
        'воскресенье',
        'понедельник',
        'вторник',
        'среда',
        'четверг',
        'пятница',
        'суббота',
      ],
      shortDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      months: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
      ],
      shortMonths: [
        'Янв',
        'Фев',
        'Мар',
        'Апр',
        'Май',
        'Июн',
        'Июл',
        'Авг',
        'Сен',
        'Окт',
        'Ноя',
        'Дек',
      ],
    });

    const formatMillisecond = locale.format('.%L');
    const formatSecond = locale.format(':%S');
    const formatMinute = locale.format('%H:%M');
    const formatHour = locale.format('%H %p');
    const formatDay = locale.format('%d %b');
    const formatWeek = locale.format('%b %d ');
    const formatMonth = locale.format('%B');
    const formatYear = locale.format('%Y');

    return (date) =>
      (d3.timeSecond(date) < date
        ? formatMillisecond
        : d3.timeMinute(date) < date
          ? formatSecond
          : d3.timeHour(date) < date
            ? formatMinute
            : d3.timeDay(date) < date
              ? formatHour
              : d3.timeMonth(date) < date
                ? d3.timeWeek(date) < date
                  ? formatDay
                  : formatWeek
                : d3.timeYear(date) < date
                  ? formatMonth
                  : formatYear)(date);
  }

  private _timeScale(timeScale: number, period: any): void {
    const minutes = (period.to - period.from) / 1000 / 60;
    this.ticks = minutes / timeScale;
    this.svgShift = (this.width / 100) - (this.width / 100) / 4.4;
  }

  private drawPoints(): void {
    const chartPointsData = [];
    const eventListeners: (() => void)[] = [];

    this.points.forEach((point: IPointChart) => {
      chartPointsData.push({
        x: this.scaleFuncs.x(point.timestamp),
        y: this.scaleFuncs.y(point.value),
        additional: point.additional,
        time: point.timestamp,
        isSingleDate: point.isSingleDate,
      });
    });
    const pointsG = this.svgGraph.append('g').attr('class', 'chart-points');

    chartPointsData.forEach((point: IPointD3) => {
      const pointG = pointsG.append('g').attr('class', 'chart-point');

      const chartStyle = new ChartStyle();
      const graphStyle: IChartStyle = chartStyle['line' + point.additional.lineType];

      pointG
        .append('circle')
        .attr('r', '4')
        .attr('cx', point.x)
        .attr('cy', point.y)
        .attr('opacity', 1)
        .style('cursor', 'pointer')
        .style('fill', graphStyle.lineColor);

      const [[circle]] = pointG.select('circle')._groups;

      eventListeners.push(
        this.renderer.listen(circle, 'mouseenter', () => {
          const formatTime = this._dateFormatPipe.transform(point.time, 'DD MMM YYYY');
          const text = (point.isSingleDate) ? formatTime : this.legends[+point.additional.lineType];
          const obj = {
            content: text + ': ' + point.additional.value
          };
          this._tooltipService.openTooltip(circle, obj);
        }),
        this.renderer.listen(circle, 'mouseleave', () => {

        }),
        this.renderer.listen(circle, 'click', () => {
          this.pointClick.emit(point);
        })
      );
    });
  }
}
