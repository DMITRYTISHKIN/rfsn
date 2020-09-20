import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';


const contentRoutes: Routes = [
  { path: '', redirectTo: 'jackal' },
  { path: 'jackal', loadChildren: () => import('../jackal/jackal.module').then((m) => m.JackalModule) },
  { path: 'people', loadChildren: () => import('../people/people.module').then((m) => m.PeopleModule) },

];

const routes: Routes = [{ path: '', component: MainComponent, children: contentRoutes }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
