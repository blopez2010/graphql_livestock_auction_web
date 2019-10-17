import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HelpersService } from 'src/app/shared/helpers.service';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material';

@Component({
	selector: 'lsa-auto-complete',
	templateUrl: './auto-complete.component.html',
	styleUrls: [ './auto-complete.component.scss' ]
})
export class AutoCompleteComponent implements OnInit {
	public filteredList: any[];
	public form: FormGroup;

	constructor(private helpersService: HelpersService, private formBuilder: FormBuilder) {}

	@Input() list: any[] = [];
	@Input() searchField = '';
	@Input() lookupField = '';
	@Input() defaultValue: any;
	@Input() placeholder: any;
	@Input() showAddButton = false;
	@Output() selectedItemChange = new EventEmitter<any>();
	@Output() addClicked = new EventEmitter<any>();
	@ViewChild('matAutocomplete', { static: true })
	matAutocomplete: MatAutocomplete;
	@ViewChild(MatAutocompleteTrigger, { static: true })
	matAutocompleteTrigger: MatAutocompleteTrigger;

	ngOnInit() {
		if (!this.lookupField) {
			this.lookupField = this.searchField;
		}

		this.form = this.formBuilder.group({
			[this.searchField]: ''
		});

		this.form.get(this.searchField).valueChanges.subscribe((lookupObj) => {
			if (typeof lookupObj === 'string') {
				if (lookupObj) {
					this.filter(lookupObj);
				} else {
					this.list.slice();
				}
			}

			if (typeof lookupObj === 'object') {
				this.selectedItemChange.emit(lookupObj);
			}
		});

		if (this.defaultValue) {
			this.form.get(this.searchField).setValue(this.defaultValue);
		}

		this.displayFn = this.displayFn.bind(this);
	}

	public displayFn(item) {
		return this.helpersService.displayFn(item, this.matAutocomplete);
	}

	public add($event) {
		$event.stopPropagation();
		this.matAutocompleteTrigger.closePanel();
		this.addClicked.emit();
	}

	private filter(name: string) {
		const filterValue = name.toLowerCase();

		this.filteredList = this.list.filter(
			(option) => option[this.lookupField].toLowerCase().indexOf(filterValue.toLowerCase()) >= 0
		);
	}
}
