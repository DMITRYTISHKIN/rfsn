import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RangeComponent } from './range.component';



@NgModule({
  exports: [
    RangeComponent
  ],
  declarations: [
    RangeComponent
  ],
  imports: [
    CommonModule
  ]
})
export class RangeModule { }
