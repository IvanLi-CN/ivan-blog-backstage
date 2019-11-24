import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberLoginBlacklistRoutingModule } from './member-login-blacklist-routing.module';
import { MemberLoginBlacklistComponent } from './member-login-blacklist.component';
import { MemberBlacklistEditorComponent } from './member-blacklist-editor/member-blacklist-editor.component';
import {SharedModule} from '../../../shared/shared.module';


@NgModule({
  declarations: [MemberLoginBlacklistComponent, MemberBlacklistEditorComponent],
  imports: [
    CommonModule,
    SharedModule,
    MemberLoginBlacklistRoutingModule
  ]
})
export class MemberLoginBlacklistModule { }
