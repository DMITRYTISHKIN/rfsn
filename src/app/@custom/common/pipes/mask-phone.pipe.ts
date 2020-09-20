import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskPhone'
})
export class MaskPhonePipe implements PipeTransform {

  transform(value: any, country?: string): string {
    if (typeof value !== 'string') {
      value = `${value}`;
    }

    if (!value) {
      return '';
    }

    if (country) {
      switch (country) {
        case 'RU':
          value = value.substr(0, value.length - 9) + '***' + value.substr(value.length - 6);
          break;
        case 'BY':
          value = value.substr(0, value.length - 9) + '***' + value.substr(value.length - 6);
          break;
        case 'KZ':
          value = value.substr(0, value.length - 8) + '***' + value.substr(value.length - 5);
          break;
        case 'KG':
          value = value.substr(0, value.length - 7) + '***' + value.substr(value.length - 4);
          break;
        case 'AM':
          value = value.substr(0, value.length - 6) + '***' + value.substr(value.length - 3);
          break;
      }
    } else {
      value = value.substr(0, value.length - 7) + '***' + value.substr(value.length - 4);
    }

    return value;
  }
}
