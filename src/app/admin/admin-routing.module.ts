import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AdminComponent} from './admin.component';


const routes: Routes = [
  {
    path: '', component: AdminComponent, children: [
      {
        path: '',
        loadChildren: () => import('./index/index.module').then(mod => mod.IndexModule),
      },
      {
        path: 'accounts',
        loadChildren: () => import('./accounts/accounts.module').then(mod => mod.AccountsModule),
      },
      {
        path: 'contents',
        loadChildren: () => import('./contents/contents.module').then(mod => mod.ContentsModule),
      },
      // {
      //   path: '**',
      //   redirectTo: '/'
      // }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
