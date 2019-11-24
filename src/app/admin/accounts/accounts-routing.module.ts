import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


const routes: Routes = [
  {
    path: 'hierarchies',
    loadChildren: () => import('../accounts/hierarchies/hierarchies.module').then(mod => mod.HierarchiesModule),
  },
  {
    path: 'player-agents',
    loadChildren: () => import('../accounts/player-agents/player-agents.module').then(mod => mod.PlayerAgentsModule),
  },
  {path: 'members', loadChildren: () => import('./members/members.module').then(mod => mod.MembersModule)},
  {
    path: 'member-login-blacklist',
    loadChildren: () => import('./member-login-blacklist/member-login-blacklist.module').then(mod => mod.MemberLoginBlacklistModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule {
}
