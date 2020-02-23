import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material/material.module';
import { AddButtonComponent } from './add-button/add-button.component';
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { EventFormControlsComponent } from './event-form-controls/event-form-controls.component';
import { EventFormComponent } from './event-form/event-form.component';
import { ItemFormControlsComponent } from './item-form-controls/item-form-controls.component';
import { LoaderComponent } from './loader/loader.component';
import { PeopleFormControlsComponent } from './people-form-controls/people-form-controls.component';
import { PeopleFormComponent } from './people-form/people-form.component';
@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  entryComponents: [
    ItemFormControlsComponent,
    PeopleFormControlsComponent,
    PeopleFormComponent,
    AutoCompleteComponent,
    AddButtonComponent,
    LoaderComponent,
    EventFormComponent,
    EventFormControlsComponent,
    ConfirmationDialogComponent
  ],
  declarations: [
    ItemFormControlsComponent,
    PeopleFormControlsComponent,
    PeopleFormComponent,
    AutoCompleteComponent,
    AddButtonComponent,
    LoaderComponent,
    EventFormComponent,
    EventFormControlsComponent,
    ConfirmationDialogComponent
  ],
  exports: [
    ItemFormControlsComponent,
    PeopleFormControlsComponent,
    PeopleFormComponent,
    AutoCompleteComponent,
    AddButtonComponent,
    LoaderComponent,
    EventFormComponent,
    EventFormControlsComponent,
    ConfirmationDialogComponent
  ]
})
export class ComponentsModule {}
