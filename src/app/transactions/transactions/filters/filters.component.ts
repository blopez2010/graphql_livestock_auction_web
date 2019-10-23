import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Event, People } from '../../../models';
import { ValidateAmountRange, ValidateDateRange } from './validators';

@Component({
	selector: 'lsa-filters',
	templateUrl: './filters.component.html',
	styleUrls: [ './filters.component.scss' ]
})
export class FiltersComponent implements OnInit {
	public form: FormGroup;
	public events: Event[];
	public buyers: People[];
	public activeEvent: string;

	@Output() public searchClicked = new EventEmitter();

	constructor(private route: ActivatedRoute, private formBuilder: FormBuilder) {}

	public ngOnInit(): void {
		this.initForm();

		this.events = this.route.data['value']['events'];
		this.buyers = this.route.data['value']['people'];
		const resolvedActiveEvent = this.route.data['value']['activeEvent'];

		this.activeEvent = resolvedActiveEvent
			? `${resolvedActiveEvent.name} - ${new Date(resolvedActiveEvent.createdAt).getFullYear()}`
			: '';

		this.form.get('eventId').setValue(this.activeEvent);
	}

	//#region Public methods

	public search() {
		if (this.form.valid) {
			this.searchClicked.emit();
		}
	}

	public reset() {
		this.form.reset();
	}

	public toDateRangeFilter = (date: Date): boolean => {
		const fromDate = this.form.get('paymentDateFrom').value;
		if (fromDate) {
			return date > (fromDate as Date);
		}

		return false;
	};

	public selectedEventChange(event) {}
	public selectedBuyerChange(event) {}

	//#endregion

	//#region Private methods

	private initForm() {
		this.form = this.formBuilder.group({
			eventId: [ undefined, Validators.required ],
			buyerId: undefined,
			amountFrom: [ undefined, ValidateAmountRange ],
			amountTo: [ undefined, ValidateAmountRange ],
			isDonated: false,
			isPayed: false,
			isLastBuyer: false,
			paymentMethod: undefined,
			paymentReference: undefined,
			paymentDateFrom: [ { value: undefined, disabled: true }, ValidateDateRange ],
			paymentDateTo: [ { value: undefined, disabled: true }, ValidateDateRange ]
		});
	}

	//#endregion
}
