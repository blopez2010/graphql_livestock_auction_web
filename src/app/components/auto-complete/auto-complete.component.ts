import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material';
import { guidRegex } from 'src/app/shared/constants';

import { HelpersService } from '../../shared/helpers.service';

class CustomErrorStateMatcher implements ErrorStateMatcher {
  constructor(private isRequired: boolean) {}

  public isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const controlTouched = !!(control && (control.dirty || control.touched));
    const controlInvalid = !!(control && control.invalid);
    // const isFormInvalid = form.dirty && form.invalid;

    return (
      (this.isRequired && (controlTouched && controlInvalid)) || (this.isRequired && controlInvalid)
    );
  }
}

@Component({
  selector: 'lsa-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss']
})
export class AutoCompleteComponent implements OnInit {
  public filteredList: any[];
  public customErrorStateMatcher: CustomErrorStateMatcher;
  public form: FormGroup;
  
  @Input() public list: any[] = [];
  @Input() public searchField = '';
  @Input() public lookupField = '';
  @Input() public defaultValue: any;
  @Input() public placeholder: any;
  @Input() public showAddButton = false;
  @Input() public isRequired = false;

  @Output() public selectedItemChange = new EventEmitter<any>();
  @Output() public addClicked = new EventEmitter<any>();

  @ViewChild('matAutocomplete', { static: true })
  public matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger, { static: true })
  public matAutocompleteTrigger: MatAutocompleteTrigger;

  constructor(private changeDetector : ChangeDetectorRef, private helpersService: HelpersService, private formBuilder: FormBuilder) {}
  
  // tslint:disable-next-line: use-life-cycle-interface
  public ngAfterViewChecked(){
    this.changeDetector.detectChanges();
  }
  
  public ngOnInit() {
    this.customErrorStateMatcher = new CustomErrorStateMatcher(this.isRequired);

    if (!this.lookupField) {
			this.lookupField = this.searchField;
		}

		this.form = this.formBuilder.group({
			[this.searchField]: ''
		});

    this.form.get(this.searchField).valueChanges.subscribe((lookupObj) => {
      if (typeof lookupObj === 'string') {
        if (lookupObj) {
          this.filter(lookupObj);
        } else {
          this.list.slice();
        }
      }

      if (typeof lookupObj === 'object') {
        this.selectedItemChange.emit(lookupObj);
      }
    });

    if (this.defaultValue) {
			this.form.get(this.searchField).setValue(this.defaultValue);
		}

    this.displayFn = this.displayFn.bind(this);
  }

  public displayFn(item) {
    return this.helpersService.displayFn(item, this.matAutocomplete);
  }

  public add($event) {
    $event.stopPropagation();
    this.matAutocompleteTrigger.closePanel();
    this.addClicked.emit();
  }

  private filter(name: string) {
    const filterValue = name.toLowerCase();

    this.filteredList = this.list.filter(
      (option) => option[this.lookupField].toLowerCase().indexOf(filterValue.toLowerCase()) >= 0
    );
  }
}
