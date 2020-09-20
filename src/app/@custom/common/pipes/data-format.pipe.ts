import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  pure: true
})
@Injectable()
export class DateFormatPipe implements PipeTransform {
  protected readonly locale = 'ru-RU';
  protected readonly units = {
    'YYYY': {
      year: 'numeric'
    },
    'YY': {
      year: '2-digit'
    },
    'M': {
      month: 'numeric'
    },
    'MM': {
      month: '2-digit'
    },
    'MMM': {
      month: 'short'
    },
    'MMMM': {
      month: 'long'
    },
    'D': {
      day: 'numeric'
    },
    'DD': {
      day: '2-digit'
    },
    'd': {
      weekday: 'short'
    },
    'dd': {
      weekday: 'long'
    },
    'hh': {
      hour: '2-digit'
    },
    'mm': {
      minute: '2-digit'
    },
    'ss': {
      second: '2-digit'
    }
  };

  transform(value: any, format: string, plural: boolean = true): string {
    const _value = new Date(value);
    if (!value || _value.getTime() !== _value.getTime()) {
      return null;
    }

    const dateUnits = [];
    const dateItems = format.split(/\, | \- | |:|\-|\.|_/);
    const delimeters = format.split(/[DMYdhms]/).filter(Boolean);
    let stringDate = '';

    dateItems.forEach((item, index) => {
      let unit: string;

      if (/hh|mm|ss/.test(item)) {
        unit = _value.toLocaleTimeString(this.locale, this.units[item]);
        if (unit.length === 1) {
          unit = `0${unit}`;
        }
      } else if (plural && item === 'MMMM') {
        const options = Object.assign({ day: 'numeric' }, this.units[item]);
        unit = _value.toLocaleDateString(this.locale, options).split(' ')[1];
      } else if (item === 'MMM') {
        unit = _value.toLocaleDateString(this.locale, this.units[item]);
        unit = unit.slice(0, 3);
      } else if (item === 'd') {
        unit = _value.toLocaleString(this.locale, this.units[item]);
        unit = unit.replace(/^./, c => c.toUpperCase());
      } else {
        unit = _value.toLocaleString(this.locale, this.units[item]);
      }

      if (index === 0) {
        unit = unit.toCapitalize();
      }

      dateUnits.push(unit);
    });

    dateUnits.forEach((item, i) => {
      stringDate += item + (delimeters[i] ? delimeters[i] : '');
    });

    return stringDate;
  }
}
