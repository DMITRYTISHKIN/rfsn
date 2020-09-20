import { Pipe, PipeTransform } from '@angular/core';
import { ObjectHelper } from '@custom/extensions/object-helper.extensions';

@Pipe({
  name: 'formatSeconds'
})
export class FormatSecondsPipe implements PipeTransform {

  transform(value: number): string {
    return ObjectHelper.formatTime(value);
  }
}
