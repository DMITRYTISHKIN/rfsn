import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpoilerComponent } from './spoiler.component';
import { IconsModule } from '../icons/icons.module';



@NgModule({
  entryComponents: [
    SpoilerComponent
  ],
  exports: [
    SpoilerComponent
  ],
  declarations: [
    SpoilerComponent
  ],
  imports: [
    CommonModule,
    IconsModule
  ]
})
export class SpoilerModule { }
