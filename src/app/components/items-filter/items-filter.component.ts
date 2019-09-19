import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocomplete } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { HelpersService } from 'src/app/shared/helpers.service';
import { Item } from '../../models';

@Component({
  selector: 'lsa-items-filter',
  templateUrl: './items-filter.component.html',
  styleUrls: ['./items-filter.component.scss']
})
export class ItemsFilterComponent implements OnInit {
  public filteredItems: Item[];
  public form: FormGroup;
  public items: Item[];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private helpersService: HelpersService
  ) {}

  @Input() showTextFilter = true;
  @Output() selectedEventChange = new EventEmitter<any>();
  @Output() filterChange = new EventEmitter<any>();
  @ViewChild('matAutocomplete', { static: true })
  matAutocomplete: MatAutocomplete;

  private initForm() {
    this.form = this.formBuilder.group({
      search: '',
      filter: ''
    });

    this.form.get('search').valueChanges.subscribe(name => {
      if (typeof name === 'string') {
        if (name) {
          this.filter(name);
        } else {
          this.items.slice();
        }
      } else if (typeof name === 'object') {
        this.selectedEventChange.emit(name);
      } else if (Array.isArray(name)) {
        this.selectedEventChange.emit(this.filteredItems[0]);
      }
    });

    this.form
      .get('filter')
      .valueChanges.pipe(debounceTime(500))
      .subscribe((value: string) => this.filterChange.emit(value));
  }

  private filter(name: string) {
    const filterValue = name.toLowerCase();

    this.filteredItems = this.items.filter(
      option =>
        option.description.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0
    );
  }

  ngOnInit() {
    this.initForm();
    this.items = this.route.data['value']['items'];
    this.displayFn = this.displayFn.bind(this);
  }

  public displayFn(item) {
    return this.helpersService.displayFn(item, this.matAutocomplete);
  }
}
