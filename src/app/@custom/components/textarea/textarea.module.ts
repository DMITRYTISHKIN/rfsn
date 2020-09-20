import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextareaComponent } from './textarea.component';



@NgModule({
  exports: [
    TextareaComponent
  ],
  declarations: [
    TextareaComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TextareaModule { }
