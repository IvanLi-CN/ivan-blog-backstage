import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HierarchiesRoutingModule } from './hierarchies-routing.module';
import { HierarchiesIndexComponent } from './hierarchies-index.component';
import { HierarchyEditorComponent } from './hierarchy-editor/hierarchy-editor.component';
import {SharedModule} from '../../../shared/shared.module';


@NgModule({
  declarations: [HierarchiesIndexComponent, HierarchyEditorComponent],
  imports: [
    CommonModule,
    SharedModule,
    HierarchiesRoutingModule
  ]
})
export class HierarchiesModule { }
