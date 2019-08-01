import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatAutocomplete,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';
import { HelpersService } from 'src/app/shared/helpers.service';
import { Item, People } from '../../../models/';

@Component({
  selector: 'lsa-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit {
  public itemForm: FormGroup;
  public people: People[];
  public filteredPeople: People[];
  private eventId: string;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ItemFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { item: Item; people: People[]; eventId: string },
    private helpersService: HelpersService
  ) {}

  @ViewChild('matAutocomplete', { static: true })
  matAutocomplete: MatAutocomplete;

  //#region Private methods
  private initForm() {
    this.itemForm = this.formBuilder.group({
      id: null,
      eventId: this.eventId,
      ordinal: [{ value: null, disabled: true }, Validators.required],
      description: null,
      externalIdentifier: null,
      ownerId: [null, Validators.required]
    });

    this.itemForm.get('ownerId').valueChanges.subscribe(name => {
      if (typeof name === 'string') {
        if (name) {
          this.filter(name);
        } else {
          this.people.slice();
        }
      }
    });

    this.displayFn = this.displayFn.bind(this);
  }

  private filter(name: string) {
    const filterValue = name.toLowerCase();

    this.filteredPeople = this.people.filter(
      option =>
        option.name.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0
    );
  }

  private patchForm(data: Item) {
    if (data) {
      const ownerId = data.owner.nickname
        ? `${data.owner.name} (${data.owner.nickname})`
        : data.owner.name;
      this.itemForm.patchValue({
        ...data,
        eventId: data.event.id,
        ownerId
      });
    }
  }

  //#endregion

  ngOnInit() {
    this.eventId = this.data.eventId;
    this.people = this.data.people;
    this.initForm();
    this.patchForm(this.data.item);
  }

  //#region Public methods

  public addItem() {
    this.dialogRef.close(this.itemForm.value);
  }

  public displayFn(item) {
    return this.helpersService.displayFn(item, this.matAutocomplete);
  }

  //#endregion
}
