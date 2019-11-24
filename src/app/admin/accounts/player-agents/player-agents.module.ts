import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerAgentsRoutingModule } from './player-agents-routing.module';
import { PlayerAgentsIndexComponent } from './player-agents-index.component';
import {SharedModule} from '../../../shared/shared.module';
import { PlayerAgentEditorComponent } from './player-agent-editor/player-agent-editor.component';


@NgModule({
  declarations: [PlayerAgentsIndexComponent, PlayerAgentEditorComponent],
  imports: [
    CommonModule,
    SharedModule,
    PlayerAgentsRoutingModule
  ]
})
export class PlayerAgentsModule { }
