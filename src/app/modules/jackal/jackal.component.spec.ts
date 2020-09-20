import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JackalComponent } from './jackal.component';

describe('JackalComponent', () => {
  let component: JackalComponent;
  let fixture: ComponentFixture<JackalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JackalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JackalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
