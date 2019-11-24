import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatformListRoutingModule } from './platform-list-routing.module';
import {PlatformListComponent} from './platform-list.component';
import {SharedModule} from '../../../shared/shared.module';
import { PlatformListEditorComponent } from './platform-list-editor/platform-list-editor.component';
import { PlatformRateEditorComponent } from './platform-rate-editor/platform-rate-editor.component';


@NgModule({
  declarations: [
    PlatformListComponent,
    PlatformListEditorComponent,
    PlatformRateEditorComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    PlatformListRoutingModule
  ]
})
export class PlatformListModule { }
