import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserInfoGuard} from './core/guards/user-info.guard';
import {PermissionGuard} from './core/guards/permission.guard';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  {
    path: '',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    // canLoad: [UserInfoGuard, PermissionGuard], canActivate: [PermissionGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
