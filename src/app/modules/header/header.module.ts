import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { RouterModule } from '@angular/router';



@NgModule({
  exports: [HeaderComponent],
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class HeaderModule { }
