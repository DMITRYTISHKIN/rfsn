import { Injectable, ComponentRef, Type, ComponentFactoryResolver, ApplicationRef,
  Injector, ElementRef, Renderer2, RendererFactory2, Optional, Inject } from '@angular/core';
import { OverlayComponent } from '../components/overlay/overlay.component';
import { BehaviorSubject } from 'rxjs';
import { ThemeService } from './theme.service';
import { CustomThemeType } from '@custom/models/custom-theme-type';

@Injectable()
export class OverlayService {
  private _overlays: ComponentRef<OverlayComponent<any>>[] = [];

  private _renderer: Renderer2;

  constructor(
    private _resolver: ComponentFactoryResolver,
    private _injector: Injector,
    private _appRef: ApplicationRef,
    @Optional() public themeService: ThemeService,
    rendererFactory: RendererFactory2
  ) {
    this._renderer = rendererFactory.createRenderer(null, null);
  }

  public open<T>(component: Type<T>, parent?: ElementRef): OverlayComponent<T> {
    const overlay = this._createOverlay(component, this._overlays.length, parent);
    this._overlays.push(overlay);

    if (this.themeService?.getTheme() === CustomThemeType.dark) {
      this._renderer.setStyle(document.body, 'backdrop-filter', 'blur(0)');
    }

    return overlay.instance;
  }

  public close<T>(e: OverlayComponent<T>): void {
    const ref = this._overlays.find(item => item.instance === e);
    this._close(ref);
  }

  private _close(overlay: ComponentRef<any>): void {
    this._overlays = this._overlays.filter(i => i !== overlay);
    this._removeOverlay(overlay);

    if (!this._overlays.length && this.themeService?.getTheme() === CustomThemeType.dark) {
      this._renderer.removeStyle(document.body, 'backdrop-filter');
    }
  }

  private _createOverlay<T>(component: Type<T>, zIndex: number, parent?: ElementRef): ComponentRef<OverlayComponent<T>> {
    const factory = this._resolver.resolveComponentFactory<OverlayComponent<T>>(OverlayComponent);
    const componentRef = factory.create(this._injector);

    componentRef.instance.zIndex = zIndex;
    componentRef.instance.component = component;

    if (parent) {
      const parentElement = (parent.nativeElement as HTMLElement);
      componentRef.instance.parent = parentElement;

      componentRef.instance.resize();
    }

    document.body.appendChild(componentRef.location.nativeElement);

    componentRef.onDestroy(() => {
      this._appRef.detachView(componentRef.hostView);
    });

    componentRef.instance.clickOverlay.subscribe(this._close.bind(this, componentRef));
    this._appRef.attachView(componentRef.hostView);


    return componentRef;
  }

  private _removeOverlay(overlay: ComponentRef<any>): void {
    overlay.destroy();
  }
}
