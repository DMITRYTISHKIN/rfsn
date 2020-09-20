import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PeopleItem } from 'app/model/people/people-item';
import { PEOPLE_ITEMS } from 'app/mock/people.mock';
import { RxFn } from 'rxfn';
import { tap, map, delay } from 'rxjs/operators';

@Injectable()
export class PeopleService {
  public getPeople = new RxFn<PeopleItem[]>(this._getPeople.bind(this));
  public getPeopleItem = new RxFn<PeopleItem, number>(this._getPeopleItem.bind(this));

  constructor() { }

  private _getPeople(): Observable<PeopleItem[]> {
    return of(PEOPLE_ITEMS).pipe(
      delay(500)
    );
  }

  private _getPeopleItem(id: number): Observable<PeopleItem> {
    return of(PEOPLE_ITEMS.find(i => i.id === id)).pipe(
      delay(500)
    );
  }

  public addPeopleItem(item: PeopleItem): Observable<any> {
    return of(item).pipe(
      map(val => {
        val.id = PEOPLE_ITEMS.length + 1;
        PEOPLE_ITEMS.push(val);
      })
    );
  }

  public removePeopleItem(item: PeopleItem): Observable<any> {
    const data = this.getPeople.getValue();

    return of(item).pipe(
      tap(_ => this.getPeople.setValue(data.filter(i => i.id !== item.id)))
    );
  }

  public updatePeopleItem(item: PeopleItem, changes: Partial<PeopleItem>): Observable<PeopleItem> {
    return of(Object.assign(item, changes));
  }
}
