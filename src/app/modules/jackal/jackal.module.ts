import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JackalRoutingModule } from './jackal-routing.module';
import { JackalComponent } from './jackal.component';
import { CustomModule } from '@custom/custom.module';


@NgModule({
  declarations: [JackalComponent],
  imports: [
    CommonModule,
    JackalRoutingModule,
    CustomModule
  ]
})
export class JackalModule { }
