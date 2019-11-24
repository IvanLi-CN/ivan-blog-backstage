import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameListRoutingModule } from './game-list-routing.module';
import {GameListComponent} from './game-list.component';
import {SharedModule} from '../../../shared/shared.module';
import { GameListEditorComponent } from './game-list-editor/game-list-editor.component';


@NgModule({
  declarations: [
    GameListComponent,
    GameListEditorComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    GameListRoutingModule
  ]
})
export class GameListModule { }
