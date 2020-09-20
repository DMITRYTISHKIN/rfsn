import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './toast.component';
import { TimeIntervalModule } from '../time-interval/time-interval.module';



@NgModule({
  entryComponents: [
    ToastComponent
  ],
  exports: [
    ToastComponent
  ],
  declarations: [
    ToastComponent
  ],
  imports: [
    CommonModule,
    TimeIntervalModule
  ]
})
export class ToastModule { }
