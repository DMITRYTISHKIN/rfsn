import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';
import { IconsModule } from '../icons/icons.module';

@NgModule({
  exports: [
    ButtonComponent
  ],
  declarations: [
    ButtonComponent
  ],
  imports: [
    CommonModule,
    IconsModule
  ]
})
export class ButtonModule { }
