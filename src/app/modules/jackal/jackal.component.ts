import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-jackal',
  templateUrl: './jackal.component.html',
  styleUrls: ['./jackal.component.scss']
})
export class JackalComponent implements OnInit {
  public result: string;

  public code = `
    private _toJackal(str: string): string {
      if (!str) {
        return '';
      }

      let res = '';

      for (let i = 0, count = 1; i <= str.length; i++) {
        if (res[res.length - 1] === str[i]) {
          count++;
          continue;
        }

        if (count > 1) {
          res += count;
        }

        if (!str[i]) {
          break;
        }

        count = 1;
        res += str[i];
      }

      return res;
    }
  `;

  constructor() { }

  ngOnInit() { }

  public onChangeValue(e: string) {
    this.result = this._toJackal(e);
  }

  private _toJackal(str: string): string {
    if (!str) {
      return '';
    }

    let res = '';

    for (let i = 0, count = 1; i <= str.length; i++) {
      if (res[res.length - 1] === str[i]) {
        count++;
        continue;
      }

      if (count > 1) {
        res += count;
      }

      if (!str[i]) {
        break;
      }

      count = 1;
      res += str[i];
    }

    return res;
  }
}
