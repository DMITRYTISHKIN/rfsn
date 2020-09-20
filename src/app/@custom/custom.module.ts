import { NgModule } from '@angular/core';
import { ButtonModule } from './components/button/button.module';
import { CheckboxModule } from './components/checkbox/checkbox.module';
import { CounterModule } from './components/counter/counter.module';
import { InputModule } from './components/input/input.module';
import { PaginatorModule } from './components/paginator';
import { PopupModule } from './components/popup/popup.module';
import { SearchPanelModule } from './components/search-panel/search-panel.module';
import { SelectBoxModule } from './components/select-box/select-box.module';
import { TextareaModule } from './components/textarea/textarea.module';
import { TGridModule } from './components/tgrid/tgrid.module';
import { TooltipModule } from './components/tooltip/tooltip.module';
import { IconsModule } from './components/icons/icons.module';
import { SwitchModule } from './components/switch/switch.module';
import { TagBoxModule } from './components/tag-box/tag-box.module';
import { DateBoxModule } from './components/date-box/date-box.module';
import { PasswordBoxModule } from './components/password-box/password-box.module';
import { SpoilerModule } from './components/spoiler/spoiler.module';
import { RadioModule } from './components/radio/radio.module';
import { ToastModule } from './components/toast/toast.module';
import { CalendarModule } from './components/calendar/calendar.module';
import { TimeIntervalModule } from './components/time-interval/time-interval.module';
import { TimeBoxModule } from './components/time-box/time-box.module';
import { TooltipMenuModule } from './components/tooltip-menu/tooltip-menu.module';
import { RangeModule } from './components/range/range.module';
import { PeriodModule } from './components/period/period.module';

const modules = [
  ButtonModule,
  CheckboxModule,
  CounterModule,
  InputModule,
  PaginatorModule,
  PopupModule,
  SearchPanelModule,
  SelectBoxModule,
  TextareaModule,
  TGridModule,
  TooltipModule,
  IconsModule,
  SwitchModule,
  TagBoxModule,
  DateBoxModule,
  PasswordBoxModule,
  SpoilerModule,
  RadioModule,
  ToastModule,
  CalendarModule,
  TimeIntervalModule,
  TimeBoxModule,
  TooltipMenuModule,
  RangeModule,
  PeriodModule
];

@NgModule({
  imports: [
    ...modules,
  ],
  exports: [
    ...modules,
  ]
})
export class CustomModule {}
