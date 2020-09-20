import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioComponent } from './radio.component';
import { CustomCommonModule } from '@custom/common/custom-common.module';



@NgModule({
  exports: [
    RadioComponent
  ],
  declarations: [
    RadioComponent
  ],
  imports: [
    CommonModule,
    CustomCommonModule
  ]
})
export class RadioModule { }
