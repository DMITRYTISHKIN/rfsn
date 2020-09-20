import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormComponentBase } from '@custom/common/base/form.component.base';
import { PeopleService } from '../people.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, debounceTime, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PeopleItem } from 'app/model/people/people-item';
import { StorageService } from '@custom/common/services/storage.service';

@Component({
  selector: 'app-people-page',
  templateUrl: './people-page.component.html',
  styleUrls: ['./people-page.component.scss']
})
export class PeoplePageComponent extends FormComponentBase implements OnInit, OnDestroy {

  public formGroup: FormGroup;
  public data: PeopleItem;
  public storageData: PeopleItem;
  public id: number;

  private _destroy$ = new Subject<void>();

  constructor(
    public service: PeopleService,
    private _fb: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _storage: StorageService
  ) {
    super();

    this.formGroup = this._createFormGroup();

    this.formGroup.valueChanges.pipe(
      debounceTime(3000),
      filter(_ => this.formGroup.dirty),
      takeUntil(this._destroy$)
    ).subscribe(data => this._storage.saveSession(this._getKey(), data));
  }

  ngOnInit() {
    this._fetch();
  }

  ngOnDestroy() {
    this.resetForm({});
    this._destroy$.next();
    this._destroy$.complete();
  }

  public onBack(): void {
    this._router.navigate([`people`]);
  }

  public onCancelStorage(): void {
    this._storage.removeSession(this._getKey());
    this._fetch();
  }

  public onAccept(): void {
    if (!this.isValidForm()) {
      return;
    }

    const data = this.formGroup.getRawValue();


    if (!this.id) {
      this.service.addPeopleItem(data).pipe(
        takeUntil(this._destroy$)
      ).subscribe(_ => {
        this._storage.removeSession(this._getKey());
        this.onBack();
      });
    } else if (this.id) {
      this.service.updatePeopleItem(this.data, data).pipe(
        takeUntil(this._destroy$)
      ).subscribe(_ => {
        this._storage.removeSession(this._getKey());
        this.onBack();
      });
    }
  }

  private _fetch(): void {
    this.id = +this._route.snapshot.paramMap.get('id');

    this.storageData = this._storage.getSession(this._getKey());
    if (this.storageData) {
      this.resetForm(this.storageData);
      return;
    }

    if (!this.id) {
      return;
    }

    this.service.getPeopleItem(this.id).pipe(
      takeUntil(this._destroy$)
    ).subscribe(data => {
      this.data = data;
      this.resetForm({
        name: data.name,
        birthDate: data.birthDate,
        gender: data.gender,
        address: data.address,
        phone: data.phone,
        email: data.email,
        isEmployee: data.isEmployee
      });
    });
  }

  private _createFormGroup(): FormGroup {
    return this._fb.group({
      name: [null, [Validators.required]],
      birthDate: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      address: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      email: [null, [Validators.required]],
      isEmployee: [false]
    });
  }

  private _getKey = (): string => `people:${this.id}`;
}
