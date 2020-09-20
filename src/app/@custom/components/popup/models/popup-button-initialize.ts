import { Observable } from 'rxjs';

export interface PopupButtonInitialize {
  text?: string;
  role?: string;
  size?: string;
  callback?: (arg?: any) => void;
  callback$?: Observable<any>;
}
