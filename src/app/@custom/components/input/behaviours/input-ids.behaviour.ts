import { InputBehaviour } from './input.behaviour';

export class InputIdsBehaviour extends InputBehaviour {

  public transform = (value: string, event: any, input: HTMLInputElement): string => {
    if (!value) {
      return value;
    }

    const ids = value.match(/\d+/g);
    if (ids) {
      return ids.join(', ');
    }

    return value;
  }
}
