import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Event } from '../../models';

@Component({
  selector: 'lsa-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {
  public eventForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EventFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Event
  ) {}

  public ngOnInit() {
    this.initForm();
    this.patchForm(this.data);
  }

  public addEvent() {
    this.dialogRef.close(this.eventForm.value);
  }

  private initForm() {
    this.eventForm = this.formBuilder.group({
      id: null,
      name: ['', Validators.required],
      description: '',
      startDate: [{ value: undefined }],
      endDate: [{ value: undefined }]
    });
  }

  private patchForm(event: Event) {
    if (event) {
      this.eventForm.patchValue({
        ...event
      });
    }
  }
}
