import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MembersRoutingModule} from './members-routing.module';
import {MembersComponent} from './members.component';
import {SharedModule} from '../../../shared/shared.module';
import {MembersEditorComponent} from './members-editor/members-editor.component';
import {MembersCapitalEditorComponent} from './members-capital-editor/members-capital-editor.component';


@NgModule({
  declarations: [MembersComponent, MembersEditorComponent, MembersCapitalEditorComponent],
  imports: [
    CommonModule,
    SharedModule,
    MembersRoutingModule
  ]
})
export class MembersModule { }
