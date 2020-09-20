import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhonePipe } from './pipes/phone.pipe';



@NgModule({
  exports: [
    PhonePipe
  ],
  declarations: [
    PhonePipe
  ],
  imports: [
    CommonModule
  ],
  providers: [
    PhonePipe
  ]
})
export class SharedModule { }
