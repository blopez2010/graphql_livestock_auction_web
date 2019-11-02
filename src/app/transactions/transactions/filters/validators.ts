import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';

export function ValidateAmountRange(control: AbstractControl) {
	if (control.parent && control.parent.get('amountFrom').value && control.parent.get('amountTo').value) {
		if (!(control.parent.get('amountTo').value > control.parent.get('amountFrom').value)) {
			return {
				valid: false
			};
		}
	}

	return null;
}

export function ValidateDateRange(control: AbstractControl) {
	if (control.parent && control.parent.get('paymentDateFrom').value && control.parent.get('paymentDateTo').value) {
		if (moment(control.parent.get('paymentDateFrom').value).diff(control.parent.get('paymentDateTo').value) > 0) {
			return {
				valid: false
			};
		}
	}

	return null;
}
