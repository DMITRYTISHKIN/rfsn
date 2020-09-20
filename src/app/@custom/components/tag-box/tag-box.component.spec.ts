import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagBoxComponent } from './tag-box.component';
import { SearchPanelModule } from '../search-panel/search-panel.module';
import { InputModule } from '../input/input.module';
import { IconsModule } from '../icons/icons.module';
import { CustomCommonModule } from '@custom/common/custom-common.module';

describe('TagBoxComponent', () => {
  let component: TagBoxComponent;
  let fixture: ComponentFixture<TagBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagBoxComponent ],
      imports: [
        InputModule,
        SearchPanelModule,
        IconsModule.forRoot(),
        CustomCommonModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
