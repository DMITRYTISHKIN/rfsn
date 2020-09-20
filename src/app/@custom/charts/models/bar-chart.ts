export interface BarChart {
  bars: BarChartMini[];
  barType: BarChartType | BarChartEquilsType;
}

export interface BarChartMini {
  count: number;
  beginTime?: Date;
  endTime?: Date;
}

export enum BarChartEquilsType {
  allFrom = 0,
  allTo,
  answeredFrom,
  answeredTo,
  dismissedFrom,
  dismissedTo,
  operatorsFrom,
  operatorsTo,
}

export enum BarChartType {
  allFrom = 0,
  answeredFrom,
  dismissedFrom,
  operatorsFrom,
  allTo,
  answeredTo,
  dismissedTo,
  operatorsTo,
}



export interface IBarStyle {
  barColor: string;
}

export class BarChartStyle {
  private readonly chartColors: { [key: string]: string } = {
    orange: '#F55123',
    orangeTo: 'rgba(255, 119, 60, 0.75)',
    pink: '#ffe600',
    pinkTo: 'rgba(203, 17, 171, 0.75)',
    blue: '#1e90ff',
    blueTo: 'rgba(30, 144, 255, 0.75)',
    green: '#56b661',
    greenTo: 'rgba(86, 182, 97, 0.75)'
  };

  public readonly allFrom: IBarStyle = {
    barColor: this.chartColors.pink,
  };

  public readonly answeredFrom: IBarStyle = {
    barColor: this.chartColors.orange,
  };

  public readonly dismissedFrom: IBarStyle = {
    barColor: this.chartColors.green,
  };

  public readonly operatorsFrom: IBarStyle = {
    barColor: this.chartColors.blue,
  };

  public readonly allTo: IBarStyle = {
    barColor: this.chartColors.pinkTo,
  };

  public readonly answeredTo: IBarStyle = {
    barColor: this.chartColors.orangeTo,
  };

  public readonly dismissedTo: IBarStyle = {
    barColor: this.chartColors.greenTo,
  };

  public readonly operatorsTo: IBarStyle = {
    barColor: this.chartColors.blueTo,
  };
}
