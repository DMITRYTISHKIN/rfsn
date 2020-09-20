import { Component, OnInit, OnDestroy } from '@angular/core';
import { PeopleService } from './people.service';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PeopleItem } from 'app/model/people/people-item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit, OnDestroy {
  public PEOPLE_TYPE = ['Клиенты', 'Сотрудники'];

  public data: PeopleItem[];
  private _destroy$ = new Subject<void>();

  private _searchValue: string;
  private _peopleType: string;

  constructor(
    public service: PeopleService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.service.getPeople().pipe(
      takeUntil(this._destroy$)
    ).subscribe(data => this.data = this._applyFilter(data));
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public onEdit(item: PeopleItem): void {

  }

  public onCreate(): void {
    this._router.navigate([`people/0`]);
  }

  public onFilterPeopleType(val: string): void {
    this._peopleType = val;
    this.data = this._applyFilter(this.service.getPeople.getValue());
  }

  public onSearchFn = (val: string): Observable<string> => {
    this._searchValue = val;
    this.data = this._applyFilter(this.service.getPeople.getValue());

    return of(val);
  }

  private _applyFilter(data: PeopleItem[]): PeopleItem[] {
    return data.filter(i => {
      if (this._searchValue && (
        i.name.indexOf(this._searchValue) === -1 &&
        i.id.toString() !== this._searchValue &&
        i.phone.toString() !== this._searchValue &&
        i.email !== this._searchValue
      )) {
        return false;
      }

      if (this._peopleType && (
        this._peopleType === this.PEOPLE_TYPE[0] && i.isEmployee ||
        this._peopleType === this.PEOPLE_TYPE[1] && !i.isEmployee
      )) {
        return false;
      }

      return true;
    });
  }
}
