import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { ItemFormComponent } from './item/item-form/item-form.component';
import { ItemComponent } from './item/item.component';
import { PeopleFormComponent } from './people/people-form/people-form.component';
import { PeopleComponent } from './people/people.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    ComponentsModule
  ],
  entryComponents: [PeopleFormComponent, ItemComponent, ItemFormComponent],
  declarations: [
    AdminComponent,
    PeopleComponent,
    PeopleFormComponent,
    ItemComponent,
    ItemFormComponent
  ]
})
export class AdminModule {}
