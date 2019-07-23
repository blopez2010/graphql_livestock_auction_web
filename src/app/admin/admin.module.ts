import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { ItemComponent } from './item/item.component';
import { PeopleFormComponent } from './people/people-form/people-form.component';
import { PeopleComponent } from './people/people.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    AdminRoutingModule
  ],
  entryComponents: [PeopleFormComponent, ItemComponent],
  declarations: [
    AdminComponent,
    PeopleComponent,
    PeopleFormComponent,
    ItemComponent
  ]
})
export class AdminModule {}
