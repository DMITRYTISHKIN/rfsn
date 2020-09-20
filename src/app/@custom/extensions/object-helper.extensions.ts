import { Renderer2 } from '@angular/core';
import { isDate } from 'util';

export class ObjectMap {
  constructor(
    public value: string,
    public key: string
  ) { }
}

export class ObjectEnum {
  constructor(
    public value: any,
    public key: string
  ) { }
}

export function getSecond(days: number = 0, hours: number = 0, minutes: number = 0, seconds: number = 0): number {
  return (days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60) + seconds;
}

export function parseDate(date: string) {
  return date ? new Date(date) : null;
}


const replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
const replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
const replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
export const linkify = (inputText: string) => {
  let replacedText: string;

  // URLs starting with http://, https://, or ftp://
  replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

  // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
  replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

  // Change email addresses to mailto:: links.
  replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

  return replacedText;
}

export class ObjectHelper {
  public static clone = (value: any): any => {
    const json = JSON.stringify(value);
    return JSON.parse(json);
  }

  public static perm = (arr) => {
    if (arr.length > 1) {
      const beg = arr[0];
      const arr1 = ObjectHelper.perm(arr.slice(1));
      const arr2 = [];
      const l =  arr1[0].length;
      for (const item of arr1) {
        for (let j = 0; j <= l; j++)  {
          arr2.push(item.slice(0, j).concat(beg, item.slice(j)));
        }
      }

      return arr2;
    }

    return [arr];
  }

  public static createQueryParams = (obj: { [key: string]: any }): string => {
    return Object.entries(obj).reduce((arr, item) => {
      if (item[1] || item[1] === 0 || item[1] === false) {
        arr.push(item.join('='));
      }
      return arr;
    }, []).join('&');
  }

  public static getKeyEnumByValue = <T, K extends keyof T>(enumObject: T, enumValue: T[K] | string): K => {
    return Object.keys(enumObject).find((key) => enumObject[key] === enumValue) as K;
  }

  public static toggleClass = (renderer: Renderer2, element: Element, className: string): void => {
    if (element.classList.contains(className)) {
      renderer.removeClass(element, className);
    } else {
      renderer.addClass(element, className);
    }
  }

  public static restartAnimation = (renderer: Renderer2, element: HTMLElement, className: string): void => {
    renderer.removeClass(element, className);
    const a = element.offsetWidth;
    renderer.addClass(element, className);
    element.addEventListener('animationend', () => {
      renderer.removeClass(element, className);
    }, { once: true });
  }

  public static isEmpty = (obj: any) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  public static enumToArray = <T>(data: T): ObjectEnum[] => {
    const keys = [];
    for (const n in data) {
      if (typeof data[n] !== 'number') {
        keys.push(n);
      }
    }

    return keys.map((key) => {
      return new ObjectEnum(data[key], key);
    });
  }

  public static objectToMapArray = <T extends {}>(data: T, valueKey: string): ObjectMap[] => {
    return Object.keys(data).map((key) => {
      return new ObjectMap(valueKey ? data[key][valueKey] : data[key], key);
    });
  }

  public static formatTime(time: number): string {
    if (!time) {
      return '0:00';
    }
    return [ Math.floor((time % 3600) / 60), ('00' + Math.round(time % 60)).slice(-2) ].join(':');
  }
}
