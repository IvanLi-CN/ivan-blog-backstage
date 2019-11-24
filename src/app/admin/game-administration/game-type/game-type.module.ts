import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameTypeRoutingModule } from './game-type-routing.module';
import {GameTypeComponent} from './game-type.component';
import {SharedModule} from '../../../shared/shared.module';
import { GameTypeEditorComponent } from './game-type-editor/game-type-editor.component';


@NgModule({
  declarations: [
    GameTypeComponent,
    GameTypeEditorComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    GameTypeRoutingModule
  ]
})
export class GameTypeModule { }
