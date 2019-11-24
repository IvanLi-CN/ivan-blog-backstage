import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameAdministrationRoutingModule } from './game-administration-routing.module';
import { GameTypeComponent } from './game-type/game-type.component';
import { PlatformListComponent } from './platform-list/platform-list.component';
import { GameListComponent } from './game-list/game-list.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    GameAdministrationRoutingModule
  ]
})
export class GameAdministrationModule { }
