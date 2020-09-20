import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PeopleComponent } from './people.component';
import { PeoplePageComponent } from './people-page/people-page.component';


const routes: Routes = [
  { path: '', component: PeopleComponent },
  { path: ':id', component: PeoplePageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeopleRoutingModule { }
