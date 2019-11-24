import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MemberLoginBlacklistComponent} from './member-login-blacklist.component';


const routes: Routes = [
  {path: '', component: MemberLoginBlacklistComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberLoginBlacklistRoutingModule { }
