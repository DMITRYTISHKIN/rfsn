import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagBoxComponent } from './tag-box.component';
import { TagBoxDropdownComponent } from './tag-box-dropdown/tag-box-dropdown.component';
import { InputModule } from '../input/input.module';
import { IconsModule } from '../icons/icons.module';
import { CustomCommonModule } from '@custom/common/custom-common.module';
import { SearchPanelModule } from '../search-panel/search-panel.module';



@NgModule({
  entryComponents: [
    TagBoxDropdownComponent
  ],
  exports: [
    TagBoxComponent
  ],
  declarations: [
    TagBoxComponent,
    TagBoxDropdownComponent
  ],
  imports: [
    CommonModule,
    InputModule,
    SearchPanelModule,
    IconsModule.forRoot(),
    CustomCommonModule
  ]
})
export class TagBoxModule { }
