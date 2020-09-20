import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WbIconComponent } from './wb-icon.component';

describe('WbIconComponent', () => {
  let component: WbIconComponent;
  let fixture: ComponentFixture<WbIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WbIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WbIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
