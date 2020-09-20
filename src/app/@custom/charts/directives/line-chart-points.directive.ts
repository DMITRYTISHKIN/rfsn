import {
    Directive,
    ElementRef,
    Renderer2,
    Input,
    HostListener,
    OnChanges,
    SimpleChanges,
    OnDestroy,
} from '@angular/core';
import * as d3Selection from 'd3-selection';
import { IPointChart, IPointD3 } from '../models/line-chart';

@Directive({
    selector: '[lineChartPoints]',
})
export class LineChartPointsDirective implements OnChanges, OnDestroy {
    @Input() private points: IPointChart[] = [];
    @Input() private graphMaxX: number = null;
    @Input() private graphMaxY: number = null;
    @Input() private scaleFuncs: { x: any; y: any } = { x: null, y: null };
    @Input() private padding: { [key: string]: number } = {};


    private svg: any = null;

    private chartPointsData: IPointD3[] = [];

    private eventListenerFn: () => void = null;

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    public ngOnChanges(changes: SimpleChanges): void {
        if (!changes.points?.firstChange || !changes.scaleFuncs?.firstChange) {
            this.mainFunction();
        }
    }

    public ngOnDestroy(): void {
        if (this.eventListenerFn) {
            this.eventListenerFn();
        }
    }

    @HostListener('mouseenter') onResize(): void {
        this.mainFunction();
    }

    private mainFunction(): void {
        this.svg = d3Selection.select(this.el.nativeElement).select('svg');

        this.svg.select('g.chart-points').remove();
        if (this.eventListenerFn) {
            this.eventListenerFn();
        }

        this.transformData();
        this.eventListenerFn = this.drawPoints();
    }

    private transformData(): void {
        this.chartPointsData = [];
        this.points.forEach((point: IPointChart) => {
            this.chartPointsData.push({
                x: this.scaleFuncs.x(point.timestamp),
                y: this.scaleFuncs.y(point.value),
                additional: point.additional,
            });
        });
    }

    private drawPoints(): () => void {
        this.shadowBox();
        const pointsG = this.svg.append('g').attr('class', 'chart-points');
        const eventListeners: (() => void)[] = [];

        // this.chartPointsData.forEach((point: IPointD3) => {
        //     const pointG = pointsG.append('g').attr('class', 'chart-point');

        //     const iconHeight: number = 24;
        //     const iconWidth: number = 24;

        //     pointG
        //         .append('circle')
        //         .attr('r', '4')
        //         .attr('cx', point.x)
        //         .attr('cy', point.y)
        //         .attr('opacity', 1)
        //         .style('fill', () => {
        //             if (point.additional.lineType === 'plan') {
        //                 return '#F55123';
        //             } else if (point.additional.lineType === 'fact') {
        //                 return '#ffe600';
        //             }
        //         });
        // });

        this.chartPointsData.forEach((point: IPointD3) => {
            const pointG = pointsG.append('g').attr('class', 'chart-point-hidden');

            const iconHeight: number = 12;
            const iconWidth: number = 12;

            pointG
                .append('rect')
                .attr('class', 'icon-hidden')
                .attr('width', iconHeight)
                .attr('height', iconWidth)
                .attr('x', point.x - 5)
                .attr('y', point.y - 5)
                .attr('fill', 'transparent')
                .style('cursor', 'pointer');

            if (point.additional?.value && this.graphMaxY && this.graphMaxX) {
                const cardWidth: number = 119;
                let cardHeight: number = 37;
                const rx: number = 4;

                if (cardHeight > this.graphMaxY - this.padding.top - this.padding.bottom) {
                    cardHeight = this.graphMaxY - this.padding.top - this.padding.bottom;
                }

                let cardPosX: number = point.x - (cardWidth / 2);
                let cardPosY: number = point.y - (cardHeight + 5);
                let offset: number = iconWidth / 2;

                if (this.graphMaxX && cardWidth + cardPosX > this.graphMaxX - this.padding.left) {
                    cardPosX = point.x - cardWidth;
                    offset *= -1;
                }

                if (
                    this.graphMaxY &&
                    cardHeight + cardPosY > this.graphMaxY - this.padding.bottom
                ) {
                    cardPosY =
                        cardPosY + (this.graphMaxY - (cardHeight + cardPosY + this.padding.bottom));
                    cardPosX += offset;
                }

                const cardG = pointG
                    .append('g')
                    .attr('class', 'point-card')
                    .style('display', 'none');

                cardG
                    .append('rect')
                    .attr('width', cardWidth)
                    .attr('height', cardHeight)
                    .attr('rx', rx)
                    .attr("filter", "url(#dropshadow)")
                    .attr('class', 'block-tooltip')
                    .attr('x', cardPosX)
                    .attr('y', cardPosY);

                const textPosX: number = cardPosX + cardWidth / 2;
                const textSize: number = 12;
                const textTypeColor: string = '#8c99b2';
                const valueTypeColor: string = 'black';
                const textTypePosY: number = cardPosY + textSize * 1.5;

                // cardG
                //     .append('text')
                //     .attr('text-anchor', 'middle')
                //     .attr('x', textPosX - 15)
                //     .attr('y', textTypePosY + 5)
                //     .text(() => {
                //         if (point.additional.lineType === 'plan') {
                //             return 'Обработано:';
                //         } else if (point.additional.lineType === 'fact') {
                //             return 'Поступило:';
                //         }
                //     })
                //     .attr('fill', textTypeColor)
                //     .style('font-size', 14);

                cardG
                    .append('text')
                    .attr('text-anchor', 'middle')
                    .attr('x', textPosX + 45)
                    .attr('y', textTypePosY + 5)
                    .text(point.additional.value)
                    .attr('fill', valueTypeColor)
                    .style('font-size', 14);

                const [[icon]] = pointG.select('rect.icon-hidden')._groups;

                const card: HTMLElement = icon.nextSibling as HTMLElement;

                eventListeners.push(
                    this.renderer.listen(icon, 'mouseenter', () => {
                        const display: string = card.style.display === 'none' ? 'inline' : 'none';
                        this.svg.selectAll('g.chart-points g.point-card').style('display', 'none');
                        card.style.display = display;
                    }),
                    this.renderer.listen(card, 'mouseleave', () => {
                        card.style.display = 'none';
                    })
                );
            }
        });

        return () => eventListeners.forEach((listener) => listener());
    }

    private shadowBox(): void {
        const defs = this.svg.append("defs");

        const filter = defs.append("filter")
            .attr("id", "dropshadow")

        filter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", 0.4)
            .attr("result", "blur");
        filter.append("feOffset")
            .attr("in", "blur")
            .attr("dx", 0)
            .attr("dy", 0)
            .attr("result", "offsetBlur");

        const feMerge = filter.append("feMerge");

        feMerge.append("feMergeNode")
            .attr("in", "offsetBlur")
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");
    }
}
