import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatAutocomplete,
  MatDialog,
  MatPaginator,
  MatTableDataSource
} from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EventsService } from 'src/app/services/events.service';
import { PeopleService } from 'src/app/services/people.service';
import { HelpersService } from 'src/app/shared/helpers.service';
import { Event, Item, People, Response } from '../../models';
import { ItemsService } from '../../services/items.service';
import { ItemFormComponent } from './item-form/item-form.component';

@Component({
  selector: 'lsa-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  public displayedColumns: string[] = [
    'ordinal',
    'ownerName',
    'description',
    'more'
  ];
  public dataSource: any = new MatTableDataSource<any>([]);
  public showSpinner = false;
  public searchForm: FormGroup;
  public events: any[] = [];
  public filteredEvents: Observable<any[]>;
  private people: Response[];
  private selectedEventId: string;

  constructor(
    private dialog: MatDialog,
    private toastrService: ToastrService,
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
      let ownerName = d.owner.name;
      if (d.owner.nickname) {
        ownerName = `${d.owner.name} (${d.owner.nickname})`;
      }

      return {
        ...d,
        ownerName,
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

    this.filteredEvents = this.searchForm.get('eventYear').valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.eventName)),
      map(eventName =>
        eventName ? this.filter(eventName) : this.events.slice()
      )
    );

    this.filteredEvents.subscribe((event: any) => {
      if (typeof event === 'object') {
        let selectedEvent;
        if (Array.isArray(event) && event.length === 1) {
          selectedEvent = event[0];
          this.selectedEventId = event[0].id;
        } else {
          selectedEvent = event;
          this.selectedEventId = selectedEvent.id;
        }

        if (selectedEvent.createdAt) {
          this.showSpinner = true;
          this.itemsService
            .getByEvent(new Date(selectedEvent.createdAt).getFullYear())
            .subscribe((response: Response) => this.loadItemsData(response));
        }
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

      this.selectedEventId = selectedEvent.id;
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

          this.people = peopleResult.data.map((p: People) => ({
            ...p,
            name: p.nickname ? `${p.name} (${p.nickname})` : p.name
          }));
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

  private filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.events.filter(
      option =>
        option.eventName.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0
    );
  }

  private updateSuccess(result: Response, successText: string) {
    const filter = this.dataSource.filter;
    this.showSpinner = result.isLoading;
    this.toastrService.success(successText);
    this.loadItemsData({
      data: this.itemsService.getCacheData(
        new Date(result.data.event.createdAt).getFullYear()
      ),
      isLoading: false
    });
    this.applyFilter(filter);
  }

  //#endregion

  ngOnInit() {
    this.initForm();
    this.showSpinner = true;
    this.loadData();
  }

  //#region Public methods
  public addItem() {
    this.dialog
      .open(ItemFormComponent, {
        disableClose: true,
        maxWidth: '30em',
        data: {
          eventId: this.selectedEventId,
          people: this.people
        }
      })
      .afterClosed()
      .subscribe(data => {
        if (data) {
          this.itemsService
            .create(data)
            .subscribe((result: Response) =>
              this.updateSuccess(result, 'Item agregado')
            );
        }
      });
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public displayFn(item) {
    return this.helpersService.displayFn(item, this.matAutocomplete);
  }

  public editItem(item: Item) {
    const dataCached = this.peopleService.getPeopleIdFromCache(item.id);

    this.dialog
      .open(ItemFormComponent, {
        disableClose: true,
        maxWidth: '30em',
        data: {
          eventId: this.selectedEventId,
          people: this.people,
          item: dataCached
        }
      })
      .afterClosed()
      .subscribe(data => {
        if (data) {
          this.itemsService
            .update(data)
            .subscribe((result: Response) =>
              this.updateSuccess(result, 'Item actualizado')
            );
        }
      });
  }
  //#endregion
}
