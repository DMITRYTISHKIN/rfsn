import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateFormatPipe } from './pipes/data-format.pipe';
import { OverlayService } from './services/overlay.service';
import { OverlayComponent } from './components/overlay/overlay.component';
import { PluralPipe } from './pipes/plural.pipe';
import { DraggableDirective } from './directives/draggable.directive';
import { ErrorHandlerService } from './services/error-handler.service';
import { PopupModule } from '@custom/components/popup/popup.module';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';
import { DragscrollDirective } from './directives/dragscroll.directive';
import { OverControlDirective } from './directives/over-control.directive';
import { StorageService } from './services/storage.service';
import { FnPipe } from './pipes/fn.pipe';
import { LoaderDirective } from './directives/loader.directive';
import { FormatSecondsPipe } from './pipes/format-seconds.pipe';
import { TimeIntervalService } from './services/time-interval.service';
import { ToastService } from './services/toast.service';
import { SecondsTimeTextPipe } from './pipes/seconds-time-text';
import { MoveableDirective } from './directives/moveable.directive';
import { WebpCheckPipe } from './pipes/webp-check.pipe';
import { MaskEmailPipe } from './pipes/mask-email.pipe';
import { MaskPhonePipe } from './pipes/mask-phone.pipe';
import { RoundPipe } from './pipes/round.pipe';
import { MaskCardPipe } from './pipes/mask-card';

const declarations = [
  DateFormatPipe,
  PluralPipe,
  OverlayComponent,
  DraggableDirective,
  ErrorDialogComponent,
  DragscrollDirective,
  OverControlDirective,
  LoaderDirective,
  FormatSecondsPipe,
  FnPipe,
  SecondsTimeTextPipe,
  MoveableDirective,
  WebpCheckPipe,
  MaskEmailPipe,
  MaskPhonePipe,
  MaskCardPipe,
  RoundPipe,
];

@NgModule({
  entryComponents: [
    OverlayComponent,
    ErrorDialogComponent
  ],
  exports: declarations,
  declarations,
  imports: [
    CommonModule,
    PopupModule
  ],
  providers: [
    DateFormatPipe,
    PluralPipe,
    MaskEmailPipe,
    MaskPhonePipe,
    ErrorHandlerService,
    OverlayService,
    StorageService,
    TimeIntervalService,
    ToastService
  ],
})
export class CustomCommonModule { }
