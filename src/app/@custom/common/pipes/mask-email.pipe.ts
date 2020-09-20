import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskEmail'
})
export class MaskEmailPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return '';
    }

    let [name, url] = value.split('@');
    name = name.substr(0, 2) + name.substr(2, 7).replace(/./g, '*');
    return name + '@' + url;
  }
}
