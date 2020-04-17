import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Event, People } from '../../../models';
import { ValidateAmountRange, ValidateDateRange } from './validators';

@Component({
  selector: 'lsa-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  public form: FormGroup;
  public events: Event[];
  public buyers: People[];
  public activeEvent: string;

  @Output() public searchClicked = new EventEmitter<any>();

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.initForm();

    this.events = this.route.data['value']['events'];
    this.buyers = this.route.data['value']['people'];
    const resolvedActiveEvent = this.route.data['value']['activeEvent'];

    this.activeEvent = resolvedActiveEvent
      ? `${resolvedActiveEvent.name} - ${new Date(resolvedActiveEvent.createdAt).getFullYear()}`
      : '';

    this.form.get('event').setValue(this.activeEvent);
  }

  // tslint:disable-next-line: use-life-cycle-interface
  public ngAfterViewInit() {
    this.cd.detectChanges();
  }

  //#region Public methods

  public search() {
    if (this.form.valid) {
      const values = Object.entries(this.form.value)
        .filter(([k, v]) => v !== undefined && v !== null && !['event', 'buyer'].includes(k))
        .reduce((acc, [k, v]) => {
          if (['amountFrom', 'amountTo'].includes(k as string)) {
            return { ...acc, [k]: Number.parseFloat(v as string) };
          }

          return { ...acc, [k]: v };
        }, {});
      this.searchClicked.emit(values);
    }
  }

  public reset() {
    this.form.reset();
    this.form.get('eventId').markAsDirty();
  }

  public toDateRangeFilter = (date: Date): boolean => {
    const fromDate = this.form.get('paymentDateFrom').value;
    if (fromDate) {
      return date > (fromDate as Date);
    }

    return false;
  };

  public selectedEventChange(event: any) {
    this.form.get('eventId').setValue(event.id);
  }
  public selectedBuyerChange(buyer) {
    this.form.get('buyerId').setValue(buyer.id);
  }

  //#endregion

  //#region Private methods

  private initForm() {
    this.form = this.formBuilder.group({
      eventId: [undefined, Validators.required],
      event: undefined,
      buyerId: undefined,
      amountFrom: [undefined, ValidateAmountRange],
      amountTo: [undefined, ValidateAmountRange],
      isDonated: false,
      isPayed: false,
      isLastBuyer: false,
      paymentMethod: undefined,
      paymentReference: undefined,
      paymentDateFrom: [{ value: undefined }, ValidateDateRange],
      paymentDateTo: [{ value: undefined }, ValidateDateRange]
    });
  }

  //#endregion
}
