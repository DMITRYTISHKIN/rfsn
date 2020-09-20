import { Component, OnInit, Input, TemplateRef, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { SpoilerRole } from './models/spoiler-role';

@Component({
  selector: 'custom-spoiler',
  templateUrl: './spoiler.component.html',
  styleUrls: ['./spoiler.component.scss'],
  animations: [
    trigger('detail', [
      state('inactive', style({
        height: 0,
        transform: 'translateY(-8px)',
        opacity: 0,
        overflow: 'hidden',
        'pointer-events': 'none'
      })),
      state('active', style({
        height: '*',
        opacity: 1
      })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpoilerComponent implements OnInit {
  public SpoilerRole = SpoilerRole;

  @Output() isOpenChange: EventEmitter<boolean> = new EventEmitter();

  public detail = 'inactive';

  @Input() role: SpoilerRole;
  @Input() label: string;
  @Input() content: any;
  @Input() dynamic: boolean;
  @Input() pure: boolean;
  private _isOpen: boolean;


  public isOpenDynamic: boolean;

  @Input() set isOpen(val: boolean) {
    this._isOpen = val;

    if (val) {
      this.isOpenDynamic = true;
    }

    this.detail = val ? 'active' : 'inactive';
    this.isOpenChange.emit(val);
  } get isOpen(): boolean {
    return this._isOpen;
  }
  @Input() className: string;
  @Input() titleTemplate: TemplateRef<any> = null;
  @Input() denyOpen: boolean;

  constructor() { }

  ngOnInit() { }

  public onClick(e: MouseEvent): void {
    if (this.denyOpen) {
      return;
    }

    e.stopPropagation();

    this.isOpen = !this.isOpen;
  }

  public endAnimation(): void {
    if (!this.isOpen) {
      this.isOpenDynamic = false;
    }
  }
}
