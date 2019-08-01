import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatAutocomplete } from '@angular/material';
import { HelpersService } from 'src/app/shared/helpers.service';

@Component({
  selector: 'lsa-items-filter',
  templateUrl: './items-filter.component.html',
  styleUrls: ['./items-filter.component.scss']
})
export class ItemsFilterComponent implements OnInit {
  public filteredEvents: any[];

  constructor(private helpersService: HelpersService) {}

  @Input() form: FormGroup;
  @Input() events: any[];
  @Output() selectedEventChange = new EventEmitter<any>();
  @ViewChild('matAutocomplete', { static: true })
  matAutocomplete: MatAutocomplete;

  ngOnInit() {
    this.displayFn = this.displayFn.bind(this);

    this.form.get('searchItems').valueChanges.subscribe(name => {
      if (typeof name === 'string') {
        if (name) {
          this.filter(name);
        } else {
          this.events.slice();
        }
      }

      if (this.filteredEvents.length === 1) {
        this.selectedEventChange.emit(this.filteredEvents[0]);
      }
    });
  }

  public displayFn(item) {
    return this.helpersService.displayFn(item, this.matAutocomplete);
  }

  private filter(name: string) {
    const filterValue = name.toLowerCase();

    this.filteredEvents = this.events.filter(
      option =>
        option.name.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0
    );
  }
}
