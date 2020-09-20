import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '../button/button.module';
import { CounterComponent } from './counter.component';
import { InputModule } from '../input/input.module';

@NgModule({
  exports: [
    CounterComponent
  ],
  declarations: [
    CounterComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    InputModule
  ]
})
export class CounterModule { }
