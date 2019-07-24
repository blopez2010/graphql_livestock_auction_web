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
import { Event, Item, Response } from '../../models';
import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'lsa-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  public displayedColumns: string[] = [
    'description',
    'ownerName',
    'eventDescription',
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
    private eventsService: EventsService
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
          .subscribe((response: Response) => {
            this.dataSource = new MatTableDataSource<any>(
              this.getDisplayData(response.data)
            );
            this.showSpinner = response.isLoading;
            this.dataSource.paginator = this.paginator;
          });
      }
    });
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

          this.dataSource = new MatTableDataSource<any>(
            this.getDisplayData(itemsResult.data)
          );
          this.showSpinner = itemsResult.isLoading;
          this.dataSource.paginator = this.paginator;

          this.people = peopleResult.data;
        },
        () => (this.showSpinner = false)
      );
    });
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
    return this.matAutocomplete.options
      .filter(x => x.value === item)
      .map(x => x.viewValue)[0]
      ? this.matAutocomplete.options
          .filter(x => x.value === item)
          .map(x => x.viewValue)[0]
      : item;
  }

  public editItem(item: Item) {}
  //#endregion
}
