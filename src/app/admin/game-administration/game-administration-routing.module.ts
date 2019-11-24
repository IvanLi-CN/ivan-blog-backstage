import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'game-list', loadChildren: () => import('./game-list/game-list.module').then(mod => mod. GameListModule) },
  { path: 'game-type', loadChildren: () => import('./game-type/game-type.module').then(mod => mod. GameTypeModule) },
  { path: 'platform-list', loadChildren: () => import('./platform-list/platform-list.module').then(mod => mod. PlatformListModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameAdministrationRoutingModule { }
