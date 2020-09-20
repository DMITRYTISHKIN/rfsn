import { FormGroup, FormArray } from '@angular/forms';

export abstract class FormComponentBase {
  public abstract formGroup: FormGroup;

  public isValidControl(name: string): boolean {
    const control = this.formGroup.get(name);
    return control.invalid && (control.dirty || control.touched);
  }

  public resetForm(data: any): void {
    this.formGroup.patchValue(data, { emitEvent: false, onlySelf: true });
    this.resetFormValidation();
  }

  public resetFormValidation(): void {
    this.formGroup.markAsPristine();
    this.formGroup.markAsUntouched();
    this.formGroup.updateValueAndValidity();
  }

  public isValidForm(): boolean {
    this.formGroup.markAsDirty();
    this.formGroup.markAsTouched();

    this._mark(this.formGroup);
    this.formGroup.updateValueAndValidity();
    return this.formGroup.valid;
  }

  private _mark(formGroup: FormGroup): void {
    for (const control in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(control)) {
        const group = formGroup.get(control);
        group.markAsDirty();
        group.markAsTouched();
        if (group instanceof FormArray) {
          for (const i in group.controls) {
            if (group.controls.hasOwnProperty(i)) {
              const g = group.get(i);
              if (g instanceof FormGroup) {
                this._mark(g);
                continue;
              }

              group.get(i).markAsDirty();
              group.get(i).markAsTouched();
            }
          }
        }
      }
    }
  }
}
