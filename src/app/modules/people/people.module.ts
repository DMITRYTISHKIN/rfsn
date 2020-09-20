import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeopleRoutingModule } from './people-routing.module';
import { PeopleComponent } from './people.component';
import { PeopleService } from './people.service';
import { CustomModule } from '@custom/custom.module';
import { CustomCommonModule } from '@custom/common/custom-common.module';
import { SharedModule } from 'app/@shared/shared.module';
import { PeoplePageComponent } from './people-page/people-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [PeopleComponent, PeoplePageComponent],
  imports: [
    CommonModule,
    PeopleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CustomModule,
    CustomCommonModule,
    SharedModule
  ],
  providers: [
    PeopleService
  ]
})
export class PeopleModule { }
