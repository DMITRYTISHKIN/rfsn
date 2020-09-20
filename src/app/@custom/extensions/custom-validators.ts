import { FormControl, ValidationErrors, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { switchMap, filter, debounceTime, first, tap } from 'rxjs/operators';

export class CustomValidators {
  public static JsonValidator(control: FormControl) {
    if (!control.value) {
      return null;
    }

    try {
      JSON.parse(control.value);
    } catch (e) {
      return { json: 'Невалидный JSON' };
    }

    return null;
  }


  public static ServerValidator(obs: (val: any) => Observable<ValidationErrors | null>): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      const val = control.value;
      if (!control.statusChanges) {
        return of(null);
      }

      const _control = control as any;
      if (_control.prevErrors && _control.prevErrors.serverError) {
        control.setErrors({ serverError: _control.prevErrors.serverError });
      }

      return control.statusChanges.pipe(
        debounceTime(500),
        first(),
        filter(() => val === control.value),
        switchMap(() => obs(control.value)),
        tap(error => _control.prevErrors = error)
      );
    };
  }
}
