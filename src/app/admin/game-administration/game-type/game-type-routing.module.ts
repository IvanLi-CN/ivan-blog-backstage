import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GameTypeComponent} from './game-type.component';


const routes: Routes = [
  {path: '', component: GameTypeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameTypeRoutingModule { }
