import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginatorComponent } from './paginator.component';
import { PaginatorDirective } from './paginator.directive';
import { IconsModule } from '../icons/icons.module';

@NgModule({
  imports: [
    CommonModule,
    IconsModule
  ],
  exports: [
    PaginatorComponent
  ],
  declarations: [
    PaginatorComponent,
    PaginatorDirective
  ]
})
export class PaginatorModule { }
