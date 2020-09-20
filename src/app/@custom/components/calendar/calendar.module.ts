import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';
import { CustomCommonModule } from '@custom/common/custom-common.module';
import { ButtonModule } from '../button/button.module';



@NgModule({
  entryComponents: [
    CalendarComponent
  ],
  exports: [
    CalendarComponent
  ],
  declarations: [
    CalendarComponent
  ],
  imports: [
    CommonModule,
    CustomCommonModule,
    ButtonModule
  ]
})
export class CalendarModule { }
