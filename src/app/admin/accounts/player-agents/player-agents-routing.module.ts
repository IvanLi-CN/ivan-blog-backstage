import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PlayerAgentsIndexComponent} from './player-agents-index.component';


const routes: Routes = [
  {
    path: '',
    component: PlayerAgentsIndexComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayerAgentsRoutingModule { }
