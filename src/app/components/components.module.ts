import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { ItemFormControlsComponent } from './item-form-controls/item-form-controls.component';
import { PeopleFormControlsComponent } from './people-form-controls/people-form-controls.component';
import { PeopleFormComponent } from './people-form/people-form.component';
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';

@NgModule({
	imports: [ CommonModule, ReactiveFormsModule, MaterialModule ],
	entryComponents: [
		ItemFormControlsComponent,
		PeopleFormControlsComponent,
		PeopleFormComponent,
		AutoCompleteComponent
	],
	declarations: [ ItemFormControlsComponent, PeopleFormControlsComponent, PeopleFormComponent, AutoCompleteComponent ],
	exports: [ ItemFormControlsComponent, PeopleFormControlsComponent, PeopleFormComponent, AutoCompleteComponent ]
})
export class ComponentsModule {}
