import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordBoxComponent } from './password-box.component';
import { InputModule } from '../input/input.module';



@NgModule({
  exports: [
    PasswordBoxComponent
  ],
  declarations: [
    PasswordBoxComponent
  ],
  imports: [
    CommonModule,
    InputModule
  ]
})
export class PasswordBoxModule { }
