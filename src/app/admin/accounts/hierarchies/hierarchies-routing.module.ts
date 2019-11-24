import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HierarchiesIndexComponent} from './hierarchies-index.component';


const routes: Routes = [
  {path: '', component: HierarchiesIndexComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HierarchiesRoutingModule { }
