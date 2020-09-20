import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchComponent } from './switch.component';
import { TooltipModule } from '../tooltip/tooltip.module';
import { IconsModule } from '../icons/icons.module';

describe('SwitchComponent', () => {
  let component: SwitchComponent;
  let fixture: ComponentFixture<SwitchComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [ SwitchComponent ],
        imports: [ TooltipModule, IconsModule ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
