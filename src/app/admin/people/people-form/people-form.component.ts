import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  //#region Private methods

  private initForm() {
    this.peopleForm = this.formBuilder.group({
      id: '',
      name: ['', Validators.required],
      nickname: '',
      phoneNumber: '',
      externalIdentifier: '',
      address: ['', Validators.required],
      isBanned: '',
      bannedDescription: ''
    });
  }

  //#endregion

  ngOnInit() {
    this.initForm();
  }

  public addPeople() {
    this.dialogRef.close(this.peopleForm.value);
  }
}
