import { Pipe, PipeTransform } from '@angular/core';
import { CountryCode, formatIncompletePhoneNumber } from 'libphonenumber-js';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {
  private readonly CODE_LENGTH = 3;

  transform(val: any, country: any = 'RU'): any {
    if (!val) {
      return val;
    }

    const value = `${val}`;

    if (value[0] === '8' || value[0] === '7') {
      return `8 ` + formatIncompletePhoneNumber(value.substring(1), 'RU');
    }

    if (value.slice(0, 2) === '+7') {
      return '+7 ' + formatIncompletePhoneNumber(value.substring(2), 'RU');
    }

    if (value.length < this.CODE_LENGTH) {
      return value;
    }

    const startSlice = value[0] === '+' ? 1 : 0;

    if (country) {
      return formatIncompletePhoneNumber((startSlice ? value : `+${value}`), country as CountryCode);
    }

    return formatIncompletePhoneNumber(value, 'RU');
  }
}
