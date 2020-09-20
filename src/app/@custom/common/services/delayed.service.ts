import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, Subject } from 'rxjs';
import { filter, debounceTime, take, takeUntil, switchMap, catchError, tap } from 'rxjs/operators';
import { DelayedObservable } from '@custom/common/models/delayed/delayed-observable';

@Injectable()
export class DelayedService {
  public delay = 10;

  private _delayedObservers$: BehaviorSubject<DelayedObservable[]> = new BehaviorSubject([]);

  public storedDelayers$: Observable<DelayedObservable[]> = this._delayedObservers$.asObservable().pipe(
    filter(data => data !== null),
  );

  public delayedObservers$: Observable<DelayedObservable[]> = this._delayedObservers$.asObservable().pipe(
    filter(data => data !== null),
    debounceTime(this.delay * 1000),
  );

  public cancelLastObservable(): void {
    const items = this._delayedObservers$.getValue();
    if (!items || !items.length) {
      return;
    }

    items[items.length - 1].stop();
  }

  public decorate<T>(obs$: Observable<T>, items: any, preAction?: () => void): Observable<T> {
    const storeItems = [...items];
    const stop$ = new Subject<void>();
    const obj = {
      obs: this.delayedObservers$.pipe(
        take(1),
        takeUntil(stop$),
        switchMap(() => obs$),
        catchError((e) => {
          obj.stop();
          return throwError(e);
        }),
        tap(() => {
          this._removeDelayed(obj);
        })
      ),
      stop: () => {
        stop$.next();
        stop$.complete();
        items.splice(0, items.length);
        items.splice(0, 0, ...storeItems);
        this._removeDelayed(obj);
      },
      store: storeItems
    };

    this._addDelayed(obj);
    preAction();

    return obj.obs;
  }

  private _addDelayed(obj: DelayedObservable): void {
    const items = this._delayedObservers$.getValue();
    items.push(obj);
    this._delayedObservers$.next(items);
  }

  private _removeDelayed(obj: DelayedObservable): void {
    const items = this._delayedObservers$.getValue();
    items.splice(items.indexOf(obj), 1);
    this._delayedObservers$.next(items);
  }
}
