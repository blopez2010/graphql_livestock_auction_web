import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
	selector: 'lsa-people-form-controls',
	templateUrl: './people-form-controls.component.html',
	styleUrls: [ './people-form-controls.component.scss' ]
})
export class PeopleFormControlsComponent {
	@Input() public form: FormGroup;
	constructor() {}
}
