import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PlatformListComponent} from './platform-list.component';


const routes: Routes = [
  {path: '', component: PlatformListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlatformListRoutingModule { }
