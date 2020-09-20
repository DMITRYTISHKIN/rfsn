import { Observable, Subject, interval, BehaviorSubject, Subscriber } from 'rxjs';
import { takeWhile, takeUntil } from 'rxjs/operators';

export class WebSocketService {

  public connectionStatus: Subject<boolean>;
  private _reconnectionObservable: Observable<number>;
  private _socket: WebSocket;
  private _messages: Subject<any> = new Subject<any>();
  private _isOpened = false;

  defaultResultSelector = (e: MessageEvent) => {
    return JSON.parse(e.data);
  }

  defaultSerializer = (data: any): string => {
    return JSON.stringify(data);
  }

  constructor(
    private url: string,
    private protocols?: string | string[],
    private reconnectInterval = 5000,
    private reconnectAttempts = 10,
    private resultSelector?: (e: MessageEvent) => any,
    private serializer?: (data: any) => string,
  ) {
    this.connectionStatus = new BehaviorSubject<boolean>(false);

    if (!resultSelector) {
      this.resultSelector = this.defaultResultSelector;
    }

    if (!serializer) {
      this.serializer = this.defaultSerializer;
    }
  }

  send(data: any): void {
    this._messages.next(this.serializer(data));
  }

  connect(): Observable<any> {
    const _destroy$ = new Subject<void>();
    return new Observable<any>(observer => {
      this._bindConnection(observer, _destroy$);

      return () => {
        _destroy$.next();
        _destroy$.complete();

        if (this._socket) {
          this._socket.close();
          this._isOpened = false;
          this._socket = null;
        }
      };
    });
  }

  private _reconnect(observer: Subscriber<any>, destroy: Subject<void>): void {
    this._reconnectionObservable = interval(this.reconnectInterval).pipe(
      takeWhile((_, index) => index < this.reconnectAttempts && !this._isOpened),
      takeUntil(destroy)
    );

    this._reconnectionObservable.subscribe({
      next: () => this._bindConnection(observer, destroy),
      complete: () => {
        this._reconnectionObservable = null;
        if (!this._isOpened) {
          this.connectionStatus.complete();
        }
      }
    });
  }

  private _bindConnection(observer: Subscriber<any>, destroy: Subject<void>): void {
    this._socket = new WebSocket(this.url, this.protocols);

    this._socket.onopen = () => {
      this._isOpened = true;

      this._messages.pipe(
        takeUntil(destroy)
      ).subscribe((data: any) => {
        this._socket.send(data);
      });

      this.connectionStatus.next(true);
    };

    this._socket.onmessage = (message: MessageEvent) => {
      observer.next(this.resultSelector(message));
    };

    this._socket.onerror = (error: ErrorEvent) => {
      this._isOpened = false;
      observer.error(error);
      this.connectionStatus.next(false);

      if (!this._reconnectionObservable) {
        this._reconnect(observer, destroy);
      }
    };

    this._socket.onclose = (event: CloseEvent) => {
      this._isOpened = false;
      if (event.wasClean) {
        observer.complete();
      } else {
        observer.error(new Error(event.reason));
      }
      this.connectionStatus.next(false);
    };
  }
}
