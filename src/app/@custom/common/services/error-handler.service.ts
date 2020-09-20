import { Injectable, ViewRef } from '@angular/core';
import { PopupService } from 'app/@custom/components/popup/popup.service';
import { PopupModel } from 'app/@custom/components/popup/models/popup-model';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ErrorDialogComponent } from '../components/error-dialog/error-dialog.component';

interface ErrorModel {
  date: Date;
  message: string;
}

@Injectable()
export class ErrorHandlerService {
  private _popup: PopupModel;
  private _errors$: BehaviorSubject<ErrorModel[]> = new BehaviorSubject(null);

  constructor(
    private _popupService: PopupService
  ) {
    this._errors$.pipe(
      filter(i => i !== null)
    ).subscribe((errors) => {
      this._popup.data = errors;
    });
  }

  public showError(err: string, parent?: ViewRef): void {
    const dataErr = {
      date: new Date(),
      message: err
    };

    if (this._popup) {
      this._addErr(dataErr);
      return;
    }

    this._popup = this._popupService.open({
      title: 'Ошибка',
      component: ErrorDialogComponent,
      alignButtons: 'center',
      cancel: { text: 'Закрыть', callback: this._closePopup.bind(this) },
      parent
    });

    this._setErr(dataErr);
  }

  private _closePopup(): void {
    this._popup.close$.next();
    this._popup = null;
    this._delErr();
  }

  private _delErr(): void {
    this._errors$.next(null);
  }

  private _setErr(err: ErrorModel): void {
    this._errors$.next([err]);
  }

  private _addErr(err: ErrorModel): void {
    this._errors$.next([err, ...this._errors$.getValue()]);
  }
}
