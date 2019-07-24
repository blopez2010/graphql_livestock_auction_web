import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Item, People } from '../../../models/';

@Component({
  selector: 'lsa-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit {
  public itemForm: FormGroup;
  public people: People[];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ItemFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item: Item; people: People[] }
  ) {}

  //#region Private methods
  private initForm() {
    this.itemForm = this.formBuilder.group({
      id: null,
      eventId: [null, Validators.required],
      ordinal: [null, Validators.required],
      description: null,
      externalIdentifier: null,
      ownerId: [null, Validators.required]
    });
  }

  //#endregion

  ngOnInit() {
    this.initForm();
    this.people = this.data.people;
  }

  //#region Public methods

  public addItem() {}

  //#endregion
}
