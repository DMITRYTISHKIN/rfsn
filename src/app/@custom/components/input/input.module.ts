import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input.component';
import { IconsModule } from '../icons/icons.module';

@NgModule({
  exports: [
    InputComponent
  ],
  declarations: [
    InputComponent
  ],
  imports: [
    CommonModule,
    IconsModule
  ]
})
export class InputModule { }
