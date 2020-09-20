import { Type, TemplateRef, Injector, ViewRef } from '@angular/core';
import { PopupButtonInitialize } from './popup-button-initialize';

export interface PopupParams {
  key?: number;
  title?: string;
  content?: string;
  data?: any;
  component?: Type<any>;
  template?: TemplateRef<any>;
  accept?: PopupButtonInitialize;
  cancel?: PopupButtonInitialize;
  buttons?: PopupButtonInitialize[];
  parentKey?: number;
  width?: string;
  height?: string;
  minWidth?: number;
  headerTemplate?: TemplateRef<any>;
  footerTemplate?: TemplateRef<any>;
  injector?: Injector;
  alignButtons?: 'left' | 'center' | 'right';
  verticalPosition?: 'flex-start' | 'center' | 'flex-end';
  overlayClose?: boolean;
  hideCloseIcon?: boolean;
  pure?: boolean;
  parent?: ViewRef;
  timeoutClose?: number;
  timeoutCallback?: () => void;
}
