import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { EventsFilterComponent } from './events-filter/events-filter.component';
import { ItemFormControlsComponent } from './item-form-controls/item-form-controls.component';
import { ItemsFilterComponent } from './items-filter/items-filter.component';
import { PeopleFilterComponent } from './people-filter/people-filter.component';
import { PeopleFormControlsComponent } from './people-form-controls/people-form-controls.component';
import { PeopleFormComponent } from './people-form/people-form.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  entryComponents: [
    ItemFormControlsComponent,
    PeopleFormControlsComponent,
    EventsFilterComponent,
    ItemsFilterComponent,
    PeopleFormComponent,
    PeopleFilterComponent
  ],
  declarations: [
    ItemFormControlsComponent,
    PeopleFormControlsComponent,
    EventsFilterComponent,
    ItemsFilterComponent,
    PeopleFormComponent,
    PeopleFilterComponent
  ],
  exports: [
    ItemFormControlsComponent,
    PeopleFormControlsComponent,
    EventsFilterComponent,
    ItemsFilterComponent,
    PeopleFormComponent,
    PeopleFilterComponent
  ]
})
export class ComponentsModule {}
