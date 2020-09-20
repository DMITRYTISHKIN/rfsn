import { Directive, ElementRef, HostListener, Renderer2, Input, OnDestroy } from '@angular/core';
import * as d3Selection from 'd3-selection';
import * as d3 from 'd3';

@Directive({
    selector: '[lineChart]',
})
export class LineChartDirective implements OnDestroy {
    @Input() private graphMaxX: number = null;
    @Input() private graphMaxY: number = null;
    @Input() private scaleFuncs: { x: any; y: any } = { x: null, y: null };
    @Input() private padding: { [key: string]: number } = {};
    @Input() private legends: string[] = [];
    @Input() isDate: boolean;

    private svg: any = null;

    private readonly dataPickerColors: { [key: string]: string } = {
        standard: '#00A99D',
        warning: '#f4a321',
        danger: '#eb5757',
        main: '#a7a7a7'
    };

    private eventListenerFn: () => void = null;

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    public ngOnDestroy(): void {
        if (this.eventListenerFn) {
            this.eventListenerFn();
        }
    }

    @HostListener('mouseenter') onMouseEnter(): void {
        this.svg = d3Selection.select(this.el.nativeElement).select('svg');

        if (this.svg._groups[0][0]) {
            this.drawMouseGroup();
        }
    }

    @HostListener('mouseleave') onMouseLeave(): void {
        if (this.eventListenerFn) {
            this.svg.select('g.mouse-over').remove();
            this.eventListenerFn();
        }
    }

    private drawMouseGroup(): void {
        const height = this.graphMaxY - this.padding.top - this.padding.bottom;
        const width = this.graphMaxX - this.padding.left - this.padding.right;

        // группа событий мыши
        const mouseG = this.svg
            .append('g')
            .attr('class', 'mouse-over')
            .attr('transform', `translate(${this.padding.left},${this.padding.top})`)
            .attr('opacity', 0)
            .style('color', this.dataPickerColors.standard);

        // линия курсора
        mouseG
            .append('line')
            .attr('class', 'mouse-line')
            .attr('y1', 0)
            .attr('x1', 0)
            .attr('y2', height)
            .attr('x2', 0)
            .style('stroke', 'currentColor')
            .style('stroke-width', '1px');

        // точка курсора на оси дат
        mouseG
            .append('circle')
            .attr('class', 'mouse-line-circle')
            .attr('r', '3')
            .attr('cy', `${height}`)
            .style('fill', 'currentColor');

        // точки курсора на плашке
        mouseG
            .append('circle')
            .attr('class', 'mouse-line-circle')
            .attr('r', '4')
            .attr('cy', 0)
            .attr('opacity', 1)
            .style('fill', 'currentColor');
        mouseG
            .append('circle')
            .attr('class', 'mouse-line-circle')
            .attr('r', '5')
            .attr('cy', 0)
            .attr('opacity', 0.6)
            .style('fill', 'currentColor');
        mouseG
            .append('circle')
            .attr('class', 'mouse-line-circle')
            .attr('r', '8')
            .attr('cy', 0)
            .attr('opacity', 0.3)
            .style('fill', 'currentColor');
        mouseG
            .append('circle')
            .attr('class', 'mouse-line-circle')
            .attr('r', '12')
            .attr('cy', 0)
            .attr('opacity', 0.1)
            .style('fill', 'currentColor');

        // точка курсора на линии плановых значений
        // mouseG
        //     .append('circle')
        //     .attr('class', 'mouse-per-line')
        //     .attr('r', '4')
        //     .style('fill', 'currentColor')
        //     .style('stroke-width', '1px');

        this.drawMouseInfoGroup();

        // область для прослушивания событий мыши
        const [[mouseListenArea]] = mouseG
            .append('svg:rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'none')
            .attr('pointer-events', 'all')._groups;

        this.eventListenerFn = this.listenMouseEvents(mouseListenArea);
    }

    private drawMouseInfoGroup(): void {
        const infoG = this.svg
            .select('g.mouse-over')
            .append('g')
            .attr('class', 'mouse-info');

        // левые значения (1 линия и 2 линия)
        infoG
            .append('text')
            .attr('text-anchor', 'end')
            .attr('class', 'mouse-graph-lineT1')
            .attr('y', 10)
            .style('font-size', '13')
            .style('fill', '#ffe600');

        infoG
            .append('text')
            .attr('text-anchor', 'end')
            .attr('class', 'mouse-graph-lineV1')
            .attr('y', 10)
            .style('font-size', '13')
            .style('fill', '#ffe600');

        infoG
            .append('text')
            .attr('text-anchor', 'end')
            .attr('class', 'mouse-graph-date1')
            .attr('y', 10)
            .style('font-size', '13')
            .style('fill', '#ffe600');


        infoG
            .append('text')
            .attr('text-anchor', 'end')
            .attr('class', 'mouse-graph-lineV2')
            .attr('y', 30)
            .style('font-size', '13')
            .style('fill', '#ff773c');

        infoG
            .append('text')
            .attr('text-anchor', 'end')
            .attr('class', 'mouse-graph-lineT2')
            .attr('y', 30)
            .style('font-size', '13')
            .style('fill', '#ff773c');

        infoG
            .append('text')
            .attr('text-anchor', 'end')
            .attr('class', 'mouse-graph-date2')
            .attr('y', 30)
            .style('font-size', '13')
            .style('fill', '#ffe600');

        // левые значения (3 линия и 4 линия)
        infoG
            .append('text')
            .attr('text-anchor', 'start')
            .attr('class', 'mouse-graph-lineT3')
            .attr('y', 10)
            .style('font-size', '13')
            .style('fill', '#56b661');

        infoG
            .append('text')
            .attr('text-anchor', 'start')
            .attr('class', 'mouse-graph-lineV3')
            .attr('y', 10)
            .style('font-size', '13')
            .style('fill', '#56b661');

        infoG
            .append('text')
            .attr('text-anchor', 'start')
            .attr('class', 'mouse-graph-date3')
            .attr('y', 10)
            .style('font-size', '13')
            .style('fill', '#ffe600');

        infoG
            .append('text')
            .attr('text-anchor', 'start')
            .attr('class', 'mouse-graph-lineV4')
            .attr('y', 30)
            .style('font-size', '13')
            .style('fill', '#1e90ff');

        infoG
            .append('text')
            .attr('text-anchor', 'start')
            .attr('class', 'mouse-graph-lineT4')
            .attr('y', 30)
            .style('font-size', '13')
            .style('fill', '#1e90ff');

        infoG
            .append('text')
            .attr('text-anchor', 'start')
            .attr('class', 'mouse-graph-date4')
            .attr('y', 30)
            .style('font-size', '13')
            .style('fill', '#ffe600');


        // значение на кривой факт
        infoG
            .append('text')
            .attr('text-anchor', 'end')
            .attr('class', 'mouse-graph-value')
            .attr('x', 0)
            .attr('y', 8)
            .style('font-size', '13')
            .style('fill', 'currentColor');

        // отклонение от плана
        infoG
            .append('text')
            .attr('text-anchor', 'start')
            .attr('class', 'mouse-graph-deviation')
            .attr('x', 0)
            .attr('y', 8)
            .style('font-size', '13')
            .style('fill', 'currentColor');

        // текущая дата
        infoG
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('class', 'mouse-graph-date')
            .attr('x', 0)
            .attr('y', -14)
            .style('font-size', '11')
            .style('fill', 'white');
    }

    private listenMouseEvents(element: HTMLElement): () => void {
        const eventListeners: (() => void)[] = [];

        eventListeners.push(
            this.renderer.listen(element, 'mouseout', () => {
                this.svg.select('.mouse-over').style('opacity', 0);
            }),
            this.renderer.listen(element, 'mouseover', () => {
                this.svg.select('.mouse-over').style('opacity', 1);
            }),
            this.renderer.listen(element, 'mousemove', (event: MouseEvent) => {
                const rect: DOMRect = element.getBoundingClientRect();

                //const y = event.clientY - rect.top;
                const x = (event.clientX + event.clientX * 0.012) -  rect.left;

                this.svg
                .select('.mouse-line')
                .attr('x1', x)
                .attr('x2', x);

                this.svg.selectAll('.mouse-line-circle').attr('cx', x);

                this.legends.forEach((item, index) => {
                    const formatDate = d3.timeFormat('%d.%m.%Y');
                    const line = this.findCursorPosition(x, index, this.svg, this.padding);
                    const iline = this.scaleFuncs.y.invert(line.y);

                    const dateLine = this.scaleFuncs.x.invert(line.x);

                    if (index === 0 || index === 1) {
                        this.svg
                        .select('g.mouse-info .mouse-graph-lineV' + (index + 1))
                        .attr('x', x - 20)
                        .text(iline.toFixed(0));

                        if (!this.isDate) {

                            this.svg
                            .select('g.mouse-info .mouse-graph-lineT' + (index + 1))
                            .attr('x', x - 45)
                            .text(item + ': ');
                        } else {
                            this.svg
                            .select('g.mouse-info .mouse-graph-date' + (index + 1))
                            .attr('x', x - 45)
                            .text(formatDate(dateLine) + ': ');
                        }
                    }

                    if (index === 2 || index === 3) {
                        this.svg
                        .select('g.mouse-info .mouse-graph-lineV' + (index + 1))
                        .attr('x', x + 20)
                        .text(iline.toFixed(0));

                        if (!this.isDate) {
                            this.svg
                            .select('g.mouse-info .mouse-graph-lineT' + (index + 1))
                            .attr('x', x + 45)
                            .text(' :' + item);
                        } else {
                            this.svg
                            .select('g.mouse-info .mouse-graph-date' + (index + 1))
                            .attr('x', x + 45)
                            .text(' :' + formatDate(dateLine));
                        }
                    }
                });

                // this.svg
                //     .select('.mouse-per-line')
                //     .attr('cx', x)
                //     .attr('cy', posFact.y - this.padding.top);

                let cursorColor: string = this.dataPickerColors.main;

                // if (factY < planY && borderBotY && factY > borderBotY) {
                //     cursorColor = this.dataPickerColors.warning;
                // } else if (factY > planY && borderTopY && factY < borderTopY) {
                //     cursorColor = this.dataPickerColors.warning;
                // } else if (factY > planY) {
                //     cursorColor = this.dataPickerColors.danger;
                // }

                this.svg.select('g.mouse-over').style('color', cursorColor);
            })
        );

        return () => eventListeners.forEach((item) => item());
    }

    private findCursorPosition(
        posX: number,
        curveType: number,
        svg: any,
        padding: { [key: string]: number }
    ): SVGPoint {
        let line: SVGGeometryElement = null;

        [[line]] = svg.select(`.graph-line-${curveType}`)._groups;

        if (!line) {
            return null;
        }

        let begin: number = 0;
        let end: number = line.getTotalLength();
        let target: number = null;
        let pos: SVGPoint = null;

        while (true) {
            target = Math.floor((begin + end) / 2);
            pos = line.getPointAtLength(target);
            if ((target === end || target === begin) && pos.x !== posX + padding.left) {
                break;
            }
            if (pos.x > posX) {
                end = target;
            } else if (pos.x < posX + padding.left) {
                begin = target;
            } else {
                break;
            }
        }

        return pos;
    }
}
