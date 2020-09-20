import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwitchComponent } from './switch.component';
import { TooltipModule } from '../tooltip/tooltip.module';
import { IconsModule } from '../icons/icons.module';

@NgModule({
  declarations: [
    SwitchComponent
  ],
  exports: [
    SwitchComponent
  ],
  imports: [
    CommonModule,
    TooltipModule,
    IconsModule
  ]
})
export class SwitchModule { }
