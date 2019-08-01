import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatAutocomplete } from '@angular/material';
import { People } from 'src/app/models';
import { HelpersService } from 'src/app/shared/helpers.service';

@Component({
  selector: 'lsa-item-form-controls',
  templateUrl: './item-form-controls.component.html',
  styleUrls: ['./item-form-controls.component.scss']
})
export class ItemFormControlsComponent implements OnInit {
  constructor(private helpersService: HelpersService) {}

  @Input() form: FormGroup;
  @Input() filteredPeople: People[];

  @ViewChild('matAutocomplete', { static: true })
  matAutocomplete: MatAutocomplete;

  ngOnInit() {
    this.displayFn = this.displayFn.bind(this);
  }

  public displayFn(item) {
    return this.helpersService.displayFn(item, this.matAutocomplete);
  }
}
