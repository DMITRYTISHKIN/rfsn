import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { WebSocketService } from '@custom/common/services/socket.service';
import { ErrorHandlerService } from '@custom/common/services/error-handler.service';
import { AppDocument } from '@core/models/document/document';

export class ServiceBase {
  private _channels: Map<string, WebSocketService> = new Map();

  constructor(
    protected http: HttpClient,
    protected apiUrl: string,
    protected errorService: ErrorHandlerService,
    protected document?: AppDocument
  ) {}

  protected get<T>(url: string, onWrap?: (any) => any, options?: any, noError?: boolean | ((err: any) => any) ): Observable<T> {
    return this.processRequest('get', url, null, onWrap, options, noError);
  }

  protected post<T>(url: string, body: any, onWrap?: (any) => any, options?: any, noError?: boolean | ((err: any) => any)): Observable<T> {
    return this.processRequest('post', url, body, onWrap, options, noError);
  }

  protected put<T>(url: string, body: any, onWrap?: (any) => any, options?: any, noError?: boolean | ((err: any) => any)): Observable<T> {
    return this.processRequest('put', url, body, onWrap, options, noError);
  }

  protected patch<T>(url: string, body: any, onWrap?: (any) => any, options?: any, noError?: boolean | ((err: any) => any)): Observable<T> {
    return this.processRequest('patch', url, body, onWrap, options, noError);
  }

  protected remove<T>(url: string, onWrap?: (any) => any, options?: any, noError?: boolean | ((err: any) => any)): Observable<T> {
    return this.processRequest('remove', url, null, onWrap, options, noError);
  }

  private processRequest<T>(
    method: 'post' | 'get' | 'put' | 'patch' | 'remove',
    url: string,
    body: any,
    onWrap?: (any) => any,
    options?: any,
    noError?: boolean | ((err: any) => any)
  ): Observable<T> {
    const _noError = noError;
    const fn = this._getMethodFunction<T>(method, url, options || {}, body);
    const observable = this.getMiddleObservable<T>(fn, onWrap, _noError);
    return observable;
  }

  protected connect<T>(url: string, onWrap?: (any: any) => any, options?: any, noError?: boolean | ((err: any) => any)): Observable<any> {
    let channel: WebSocketService;

    if (this._channels.has(url)) {
      channel = this._channels.get(url);
    } else {
      channel = new WebSocketService(this.apiUrl + url);
      this._channels.set(url, channel);
    }

    return this.getMiddleObservable(channel.connect(), onWrap, noError);
  }

  protected send(url: string, data: any): void {
    if (this._channels.has(url)) {
      const channel = this._channels.get(url);
      channel.send(data);
    }
  }

  private getMiddleObservable<T>(fn: Observable<any>, onWrap?: (any) => any, noError?: boolean | ((err: any) => any)): Observable<T> {
    return fn.pipe(
      catchError((rejected: any) => {
        let message = '';
        if (typeof noError === 'function') {
          const result = noError(rejected);
          if (result) {
            return result;
          }
        }

        if (rejected && rejected.error) {
          message = `${rejected.url}`;
          if (rejected.status === 0) {
            message += `\nНеизвестная ошибка`;
          } else if (typeof rejected.error === 'string') {
            message += `\n${rejected.error}`;
          } else {
            message += `\n${
              rejected.error.message ||
              rejected.error.Message ||
              rejected.error.error ||
              rejected.message
            }`;
          }

          this.processError(rejected.error.time, message, noError);
        } else if (rejected) {
          message = rejected.message;
          this.processError(Date.now(), message, noError);
        } else {
          message = 'Произошла одна или несколько ошибок';
          this.processError(Date.now(), message, noError);
        }
        return throwError(rejected);
      }),
      tap((response) => {
        this.check(response, noError);
        return response;
      }),
      map((response) => {
        if (response === null) {
          return response;
        }
        if (response.hasOwnProperty('result')) {
          if (response.result === null) {
            response.result = [];
          }
          if (!response.result) {
            response = null;
          } else {
            response = response.result;
          }
        }
        if (response.hasOwnProperty('data')) {
          if (response.data === null) {
            response.data = [];
          }
          if (!response.data) {
            response = null;
          } else {
            response = response.data;
          }
        }
        if (onWrap && response) {
          if (Array.isArray(response)) {
            return response.map(onWrap);
          } else {
            try {
              return onWrap(response);
            } catch (e) {
              this.processError(null, e.message, noError);
            }
          }
        }
        return response;
      })
    );
  }

  private check(response, noError) {
    if (response && !response.is_ok && response.hasOwnProperty('is_ok')) {
      this.processError(response.time, response.message, noError);
      return null;
    }
    return response;
  }

  private processError(time, message, noError: boolean | ((err: any) => any)) {
    if (typeof noError === 'boolean' && noError) {
      return;
    }

    this.errorService.showError(`${message}`);
  }

  private _getMethodFunction<T>(type: string, url: string, options: any, body?: any) {
    const apiUrl = this.apiUrl ? this.apiUrl + url : url;

    switch (type) {
      case 'post':
        return this.http.post<T>(apiUrl, body, options);
      case 'get':
        return this.http.get<T>(apiUrl, options);
      case 'put':
        return this.http.put<T>(apiUrl, body, options);
      case 'patch':
        return this.http.patch<T>(apiUrl, body, options);
      case 'remove':
        return this.http.delete<T>(apiUrl, options);
    }
  }
}
