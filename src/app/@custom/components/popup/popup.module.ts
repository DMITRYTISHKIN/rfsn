import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupComponent } from './popup.component';
import { PopupOverlayComponent } from './popup-overlay/popup-overlay.component';
import { PopupService } from './popup.service';
import { ButtonModule } from '../button/button.module';
import { PopupDraggableDirective } from './popup-draggable.directive';
import { IconsModule } from '../icons/icons.module';



@NgModule({
  declarations: [
    PopupComponent,
    PopupOverlayComponent,
    PopupDraggableDirective
  ],
  imports: [
    CommonModule,
    ButtonModule,
    IconsModule
  ],
  providers: [
    PopupService
  ],
  entryComponents: [
    PopupOverlayComponent,
    PopupComponent
  ]
})
export class PopupModule { }
