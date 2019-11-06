import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as moment from 'moment';
import { PaymentMethods } from 'src/app/models';

@Component({
  selector: 'lsa-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss']
})
export class PayComponent implements OnInit {
  public payForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  public ngOnInit() {
    this.payForm = this.formBuilder.group({
      paymentMethod: [PaymentMethods.DEPOSIT, Validators.required],
      paymentDate: [null, Validators.required],
      paymentReference: null
    });

    this.payForm.patchValue(this.data || {});
  }

  public toDateRangeFilter = (date: Date): boolean => {
    return moment().diff(date) > 0;
  };

  public pay() {
    if (this.payForm.valid) {
      this.dialogRef.close(this.payForm.value);
    }
  }
}
