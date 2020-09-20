import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipMenuComponent } from './tooltip-menu.component';
import { CustomCommonModule } from '@custom/common/custom-common.module';
import { IconsModule } from '../icons/icons.module';
import { TooltipModule } from '../tooltip/tooltip.module';
import { SearchPanelModule } from '../search-panel/search-panel.module';



@NgModule({
  exports: [
    TooltipMenuComponent
  ],
  declarations: [
    TooltipMenuComponent
  ],
  imports: [
    CommonModule,
    CustomCommonModule,
    SearchPanelModule,
    TooltipModule,
    IconsModule,
  ]
})
export class TooltipMenuModule { }
