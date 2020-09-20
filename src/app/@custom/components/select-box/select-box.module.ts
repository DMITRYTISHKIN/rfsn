import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectBoxComponent } from './select-box.component';
import { SelectBoxOverlayComponent } from './select-box-overlay/select-box-overlay.component';
import { InputModule } from '../input/input.module';
import { IconsModule } from '../icons/icons.module';
import { CustomCommonModule } from '@custom/common/custom-common.module';
import { SearchPanelModule } from '../search-panel/search-panel.module';

@NgModule({
  exports: [
    SelectBoxComponent
  ],
  entryComponents: [
    SelectBoxOverlayComponent
  ],
  declarations: [
    SelectBoxComponent,
    SelectBoxOverlayComponent
  ],
  imports: [
    CommonModule,
    InputModule,
    SearchPanelModule,
    CustomCommonModule,
    IconsModule
  ]
})
export class SelectBoxModule { }
