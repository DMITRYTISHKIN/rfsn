import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconService } from './svg-icon/svg-icon.service';
import { SvgIconComponent } from './svg-icon/svg-icon.component';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { SvgIconPathProvide } from './models/svg-icon-path-provide';
import { WbIconComponent } from './wb-icon/wb-icon.component';

@NgModule({
  exports: [
    SvgIconComponent,
    WbIconComponent
  ],
  declarations: [
    SvgIconComponent,
    WbIconComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    SvgIconService,
    { provide: SvgIconPathProvide, useValue: 'icons/svg' }
  ]
})
export class IconsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IconsModule,
      providers: [
        SvgIconService,
        { provide: SvgIconPathProvide, useValue: 'icons/svg' }
      ]
    };
  }

  constructor(
    private _iconService: SvgIconService
  ) {
    this._preloadSvgIcons();
  }

  private _preloadSvgIcons(): void {

  }
}
