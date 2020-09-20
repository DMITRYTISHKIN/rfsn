import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskCard'
})
export class MaskCardPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return '';
    }

    value = value.substr(0, 4) + value.substr(4, value.length - 8).replace(/./g, '*') + value.substr(value.length - 4);
    return value;
  }
}
