import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { People } from 'src/app/models';
import { HelpersService } from 'src/app/shared/helpers.service';
import { PeopleFormComponent } from '../people-form/people-form.component';

@Component({
  selector: 'lsa-people-filter',
  templateUrl: './people-filter.component.html',
  styleUrls: ['./people-filter.component.scss']
})
export class PeopleFilterComponent implements OnInit {
  public filteredPeople: any[];
  public form: FormGroup;
  showSpinner: any;
  public selectedBuyer: People = null;

  constructor(
    private helpersService: HelpersService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  @Output() selectedPeopleChange = new EventEmitter<any>();
  @Output() addedPeople = new EventEmitter<People>();
  @Input() people: People[] = [];
  @ViewChild('matAutocomplete', { static: true })
  matAutocomplete: MatAutocomplete;

  private initForm() {
    this.form = this.formBuilder.group({
      search: ''
    });
    this.people = this.route.data['value']['people'];
  }

  private filter(name: string) {
    const filterValue = name.toLowerCase();

    this.filteredPeople = this.people.filter(option => {
      return (
        option.fullName.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0
      );
    });
  }

  ngOnInit() {
    this.initForm();
    this.displayFn = this.displayFn.bind(this);

    this.form.get('search').valueChanges.subscribe(name => {
      if (typeof name === 'string') {
        if (name) {
          this.filter(name);
        } else {
          this.people.slice();
        }
      } else if (typeof name === 'object') {
        this.selectedPeopleChange.emit(name);
      } else if (Array.isArray(name)) {
        this.selectedPeopleChange.emit(this.filteredPeople[0]);
      }
    });
  }

  /**
   * addPeople
   */
  public addPeople() {
    this.dialog
      .open(PeopleFormComponent, {
        disableClose: true,
        maxWidth: '30em'
      })
      .afterClosed()
      .subscribe(data => {
        if (data) {
          this.addedPeople.emit(data);
        }
      });
  }

  public displayFn(item) {
    return this.helpersService.displayFn(item, this.matAutocomplete);
  }
}
