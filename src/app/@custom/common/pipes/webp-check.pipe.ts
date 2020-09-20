import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'webpCheck',
  pure: true
})
export class WebpCheckPipe implements PipeTransform {
  public transform(src: string, type: string = 'png'): any {
    return /chrome/.test(navigator.userAgent.toLowerCase()) ? src : src.replace('webp', type);
  }
}
