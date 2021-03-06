import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ComponentsModule } from '../components/components.module';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { EventComponent } from './event/event.component';
import { ItemFormComponent } from './item/item-form/item-form.component';
import { ItemComponent } from './item/item.component';
import { PeopleComponent } from './people/people.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    ComponentsModule
  ],
  entryComponents: [ItemComponent, ItemFormComponent],
  declarations: [
    AdminComponent,
    PeopleComponent,
    ItemComponent,
    ItemFormComponent,
    EventComponent
  ]
})
export class AdminModule {}
