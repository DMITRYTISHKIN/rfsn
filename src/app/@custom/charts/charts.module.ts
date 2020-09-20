import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupModule } from '@custom/components/popup/popup.module';
import { ReportLineChartComponent } from './components/report-line-chart/reports-line-chart.component';
import { LineChartDirective } from './directives/line-chart.directive';
import { LineChartPointsDirective } from './directives/line-chart-points.directive';
import { CustomCommonModule } from '@custom/common/custom-common.module';
import { ReportChartContainerComponent } from './components/report-chart-container/report-chart-container.component';
import { IconsModule } from '@custom/components/icons/icons.module';
import { SwitchModule } from '@custom/components/switch/switch.module';
import { BarChartsComponent } from './components/bar-charts/bar-charts.component';
import { BarComponent } from './components/bar-charts/bar/bar.component';
import { CustomModule } from '@custom/custom.module';

const declarations = [
  ReportLineChartComponent,
  ReportChartContainerComponent,
  LineChartDirective,
  LineChartPointsDirective,
  BarChartsComponent,
  BarComponent
];

@NgModule({
  entryComponents: [
    ReportLineChartComponent,
    ReportChartContainerComponent,
    BarChartsComponent,
    BarComponent
  ],
  exports: declarations,
  declarations,
  imports: [
    CustomModule,
    CommonModule,
    CustomCommonModule,
    PopupModule,
    IconsModule,
    SwitchModule,
  ],
  providers: [
  ],
})
export class CustomChartModule { }
