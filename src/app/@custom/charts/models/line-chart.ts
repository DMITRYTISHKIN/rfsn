export class ILineChart {
    constructor(
        public graph: IChartMini[],
        public numberLine: number,
        public isSingleDate?: boolean,
    ) { }
}

export class IChartMini {
    constructor(
        public count: number,
        public beginTime?: Date,
        public endTime?: Date,
    ) { }
}


export interface IChartD3 {
    x: number;
    y: number;
}

export interface IPointD3 {
    x: number;
    y: number;
    additional?: IPointAdditional;
    time?: Date;
    isSingleDate?: boolean;
}


export interface IPointChart {
    value: number;
    timestamp: Date;
    additional?: IPointAdditional;
    isSingleDate?: boolean;
}

export interface IPointAdditional {
    value: number;
    lineType: number;
    operator?: number;
    eva?: number;
}

export interface IChartStyle {
    lineWidth: number;
    lineColor: string;
    lineType: LineTypes;
}

export type LineTypes = 'solid' | 'dashed';

export class ChartStyle {
    private readonly chartColors: { [key: string]: string } = {
        orange: '#F55123',
        red: '#fe3d3e',
        pink: '#ffe600',
        blue: '#1e90ff',
        green: '#56b661',
    };

    public readonly line0: IChartStyle = {
        lineWidth: 2,
        lineColor: this.chartColors.pink,
        lineType: 'solid',
    };

    public readonly line1: IChartStyle = {
        lineWidth: 2,
        lineColor: this.chartColors.orange,
        lineType: 'solid',
    };

    public readonly line2: IChartStyle = {
        lineWidth: 2,
        lineColor: this.chartColors.green,
        lineType: 'solid',
    };

    public readonly line3: IChartStyle = {
        lineWidth: 2,
        lineColor: this.chartColors.blue,
        lineType: 'solid',
    };

    public drawLineType(lineStyle: IChartStyle): string {
        return lineStyle.lineType === 'dashed' ? '2 5' : '2 0';
    }
}
