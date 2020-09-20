import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsTimeText'
})
export class SecondsTimeTextPipe implements PipeTransform {

  transform(value: number): string {
    let str = [];

    const dirtHours = ((value / 1000) / 60) / 60;
    const hours = Math.floor(dirtHours);
    const minutes = Math.floor((dirtHours - hours) * 60);
    const seconds = Math.floor((dirtHours - hours - minutes) * 60);

    if (hours > 0) {
      str.push(`${hours} ч.`);
    }

    if (minutes > 0) {
      str.push(`${minutes} мин`);
    }

    if (seconds > 0) {
      str.push(`${seconds} сек`);
    }

    return str.join(' ');
  }
}
