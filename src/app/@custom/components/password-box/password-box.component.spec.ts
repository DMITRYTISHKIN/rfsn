import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordBoxComponent } from './password-box.component';
import { InputModule } from '../input/input.module';

describe('PasswordBoxComponent', () => {
  let component: PasswordBoxComponent;
  let fixture: ComponentFixture<PasswordBoxComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [ PasswordBoxComponent ],
        imports: [ InputModule ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
