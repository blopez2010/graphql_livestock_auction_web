import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { PeopleComponent } from './people/people.component';

@NgModule({
  imports: [CommonModule, SharedModule, AdminRoutingModule],
  declarations: [AdminComponent, PeopleComponent]
})
export class AdminModule {}
