import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { HeaderModule } from '../header/header.module';


@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    HeaderModule,
    MainRoutingModule
  ]
})
export class MainModule { }
