import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocomplete } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { HelpersService } from 'src/app/shared/helpers.service';
import { Event } from '../../models';

@Component({
	selector: 'lsa-events-filter',
	templateUrl: './events-filter.component.html',
	styleUrls: [ './events-filter.component.scss' ]
})
export class EventsFilterComponent implements OnInit {
	public filteredEvents: any[];
	public events: any[];
	public activeEvent: Event;
	public form: FormGroup;

	constructor(
		private route: ActivatedRoute,
		private helpersService: HelpersService,
		private formBuilder: FormBuilder
	) {}

	@Output() selectedEventChange = new EventEmitter<any>();
	@ViewChild('matAutocomplete', { static: true })
	matAutocomplete: MatAutocomplete;

	ngOnInit() {
		this.events = this.route.data['value']['events'];
		this.activeEvent = this.route.data['value']['activeEvent'];

		this.form = this.formBuilder.group({
			event: ''
		});

		this.form.get('event').valueChanges.subscribe((event) => {
			if (typeof event === 'string') {
				if (event) {
					this.filter(event);
				} else {
					this.events.slice();
				}
			}

			if (typeof event === 'object') {
				this.selectedEventChange.emit(event);
			}
		});

		this.form
			.get('event')
			.setValue(
				this.activeEvent
					? `${this.activeEvent.name} - ${new Date(this.activeEvent.createdAt).getFullYear()}`
					: ''
			);

		this.displayFn = this.displayFn.bind(this);
	}

	public displayFn(item) {
		return this.helpersService.displayFn(item, this.matAutocomplete);
	}

	private filter(name: string) {
		const filterValue = name.toLowerCase();

		this.filteredEvents = this.events.filter(
			(option) => option.eventName.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0
		);
	}
}
