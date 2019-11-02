import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { People } from '../../models';

@Component({
  selector: 'lsa-people-form',
  templateUrl: './people-form.component.html',
  styleUrls: ['./people-form.component.scss']
})
export class PeopleFormComponent implements OnInit {
  public peopleForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PeopleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: People
  ) {}

  //#endregion

  public ngOnInit() {
    this.initForm();
    this.patchForm(this.data);
  }

  public addPeople() {
    this.dialogRef.close({
      ...this.peopleForm.value,
      isBanned: !(this.peopleForm.value as People).isBanned
    });
  }

  //#region Private methods

  private initForm() {
    this.peopleForm = this.formBuilder.group({
      id: null,
      name: ['', Validators.required],
      nickname: '',
      phoneNumber: '',
      externalIdentifier: '',
      address: ['', Validators.required],
      isBanned: false,
      bannedDescription: [{ value: null, disabled: true }]
    });

    this.peopleForm.get('isBanned').valueChanges.subscribe((isBanned) => {
      if (!isBanned) {
        this.peopleForm.get('bannedDescription').enable();
      } else {
        this.peopleForm.get('bannedDescription').disable();
      }
    });
  }

  private patchForm(people: People) {
    if (people) {
      this.peopleForm.patchValue({
        ...people,
        isBanned: !people.isBanned
      });
    }
  }
}
