import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatAutocomplete,
  MatPaginator,
  MatTableDataSource
} from '@angular/material';
import { forkJoin } from 'rxjs';
import { EventsService } from 'src/app/services/events.service';
import { PeopleService } from 'src/app/services/people.service';
import { HelpersService } from 'src/app/shared/helpers.service';
import { Event, Item, Response } from '../../models';
import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'lsa-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  public displayedColumns: string[] = [
    'ordinal',
    'description',
    'ownerName',
    'more'
  ];
  public dataSource: any = new MatTableDataSource<any>([]);
  public showSpinner = false;
  public searchForm: FormGroup;
  public events: any[];
  private people: Response[];
  private selectedEvent: Event;

  constructor(
    private formBuilder: FormBuilder,
    private itemsService: ItemsService,
    private peopleService: PeopleService,
    private eventsService: EventsService,
    private helpersService: HelpersService
  ) {}

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('matAutocomplete', { static: true })
  matAutocomplete: MatAutocomplete;

  //#region Private methods

  private getDisplayData(data: Item[]) {
    return data.map(d => {
      return {
        ...d,
        ownerName: d.owner.name,
        eventDescription: `${d.event.name} - ${new Date(
          d.event.createdAt
        ).getFullYear()}`
      };
    });
  }

  private initForm() {
    this.searchForm = this.formBuilder.group({
      search: '',
      eventYear: [null, Validators.required]
    });

    this.searchForm.get('eventYear').valueChanges.subscribe((event: any) => {
      if (typeof event === 'object') {
        const selectedEvent = event;

        this.showSpinner = true;
        this.itemsService
          .getByEvent(new Date(selectedEvent.createdAt).getFullYear())
          .subscribe((response: Response) => this.loadItemsData(response));
      }
    });
    this.displayFn = this.displayFn.bind(this);
  }

  private getEventsDisplayData(events: Event[]) {
    return events.map(event => ({
      ...event,
      eventName: `${event.name} - ${new Date(event.createdAt).getFullYear()}`
    }));
  }

  private loadData() {
    this.eventsService.get().subscribe((response: Response) => {
      this.events = this.getEventsDisplayData(response.data);

      const selectedEvent = this.events.sort((a, b) => {
        const date1 = b.createdAt;
        const date2 = a.createdAt;

        if (date1 < date2) {
          return -1;
        } else if (date1 === date2) {
          return 0;
        } else {
          return 1;
        }
      })[0];

      this.searchForm.get('eventYear').setValue(selectedEvent.eventName);

      forkJoin(
        this.itemsService.getByEvent(
          new Date(selectedEvent.createdAt).getFullYear()
        ),
        this.peopleService.get()
      ).subscribe(
        result => {
          const itemsResult = result[0];
          const peopleResult = result[1];

          this.loadItemsData(itemsResult);

          this.people = peopleResult.data;
        },
        () => (this.showSpinner = false)
      );
    });
  }

  private loadItemsData(itemsResult: Response) {
    const items = itemsResult.data.sort((a, b) => {
      if (b.ordinal > a.ordinal) {
        return -1;
      } else if (a.ordinal === b.ordinal) {
        return 0;
      }

      return 1;
    });
    this.dataSource = new MatTableDataSource<any>(this.getDisplayData(items));
    this.showSpinner = itemsResult.isLoading;
    this.dataSource.paginator = this.paginator;
  }

  //#endregion

  ngOnInit() {
    this.initForm();
    this.showSpinner = true;
    this.loadData();
  }

  //#region Public methods
  public addItem() {}

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public displayFn(item) {
    return this.helpersService.displayFn(item, this.matAutocomplete);
  }

  public editItem(item: Item) {}
  //#endregion
}
