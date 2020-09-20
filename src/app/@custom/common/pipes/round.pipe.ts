import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'round',
  pure: true
})
export class RoundPipe implements PipeTransform {

  transform(value: number): unknown {
    return value.toLocaleString();
  }

}
