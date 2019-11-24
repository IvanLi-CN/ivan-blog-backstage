import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import {FormsModule} from '@angular/forms';
import {CoreModule} from '../core/core.module';
import {SharedModule} from '../shared/shared.module';


@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    CoreModule,
    SharedModule,
  ]
})
export class AdminModule { }
