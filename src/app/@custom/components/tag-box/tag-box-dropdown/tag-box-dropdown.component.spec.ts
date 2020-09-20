import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagBoxDropdownComponent } from './tag-box-dropdown.component';
import { InputModule } from '@custom/components/input/input.module';
import { SearchPanelModule } from '@custom/components/search-panel/search-panel.module';
import { IconsModule } from '@custom/components/icons/icons.module';
import { CustomCommonModule } from '@custom/common/custom-common.module';

describe('TagBoxDropdownComponent', () => {
  let component: TagBoxDropdownComponent;
  let fixture: ComponentFixture<TagBoxDropdownComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [ TagBoxDropdownComponent ],
        imports: [ InputModule, SearchPanelModule, IconsModule.forRoot(), CustomCommonModule ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TagBoxDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
