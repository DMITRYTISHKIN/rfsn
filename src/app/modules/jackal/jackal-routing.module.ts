import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JackalComponent } from './jackal.component';


const routes: Routes = [
  { path: '', component: JackalComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JackalRoutingModule { }
