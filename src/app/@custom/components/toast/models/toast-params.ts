import { TemplateRef } from '@angular/core';

export interface ToastParams {
  timeout?: number;
  key?: string;
  contentTemplate?: TemplateRef<any>;
  text?: string;
  action?: string;
  showKey?: boolean;
  callback?: () => void;
  reject?: () => void;
  zIndex?: number;
  top?: number;
  parent?: HTMLElement;
  className?: string;
  showTimeleft?: boolean;
  labelTimeleft?: string;
  emitActionTimeout?: boolean;
  mouseoverRestartTimer?: boolean;
}
