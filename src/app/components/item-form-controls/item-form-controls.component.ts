import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatAutocomplete } from '@angular/material';

import { People } from '../../models';
import { HelpersService } from '../../shared/helpers.service';

@Component({
	selector: 'lsa-item-form-controls',
	templateUrl: './item-form-controls.component.html',
	styleUrls: [ './item-form-controls.component.scss' ]
})
export class ItemFormControlsComponent implements OnInit {
	@Input() public form: FormGroup;
	@Input() public filteredPeople: People[];

	@ViewChild('matAutocomplete', { static: true })
	public matAutocomplete: MatAutocomplete;
	constructor(private helpersService: HelpersService) {}

	public ngOnInit() {
		this.displayFn = this.displayFn.bind(this);
	}

	public displayFn(item) {
		return this.helpersService.displayFn(item, this.matAutocomplete);
	}
}
