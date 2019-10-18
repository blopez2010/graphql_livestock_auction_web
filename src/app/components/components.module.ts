import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material/material.module';
import { AddButtonComponent } from './add-button/add-button.component';
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';
import { ItemFormControlsComponent } from './item-form-controls/item-form-controls.component';
import { LoaderComponent } from './loader/loader.component';
import { PeopleFormControlsComponent } from './people-form-controls/people-form-controls.component';
import { PeopleFormComponent } from './people-form/people-form.component';

@NgModule({
	imports: [ CommonModule, ReactiveFormsModule, MaterialModule ],
	entryComponents: [
		ItemFormControlsComponent,
		PeopleFormControlsComponent,
		PeopleFormComponent,
		AutoCompleteComponent,
		AddButtonComponent,
		LoaderComponent
	],
	declarations: [
		ItemFormControlsComponent,
		PeopleFormControlsComponent,
		PeopleFormComponent,
		AutoCompleteComponent,
		AddButtonComponent,
		LoaderComponent
	],
	exports: [
		ItemFormControlsComponent,
		PeopleFormControlsComponent,
		PeopleFormComponent,
		AutoCompleteComponent,
		AddButtonComponent,
		LoaderComponent
	]
})
export class ComponentsModule {}
