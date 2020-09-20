import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpoilerComponent } from './spoiler.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SpoilerComponent', () => {
  let component: SpoilerComponent;
  let fixture: ComponentFixture<SpoilerComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [ SpoilerComponent ],
        imports: [ BrowserAnimationsModule ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SpoilerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
