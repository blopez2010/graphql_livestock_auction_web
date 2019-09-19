import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatAutocomplete,
  MatDialog,
  MatPaginator,
  MatTableDataSource
} from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PeopleService } from 'src/app/services/people.service';
import { Event, Item, Response } from '../../models';
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
  private people: Response[];
  private selectedEventId: string;

  constructor(
    private dialog: MatDialog,
    private toastrService: ToastrService,
    private itemsService: ItemsService,
    private peopleService: PeopleService,
    private route: ActivatedRoute
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

  private loadData(activeEvent: Event) {
    this.showSpinner = true;
    this.itemsService
      .getByEvent(new Date(activeEvent.createdAt).getFullYear())
      .subscribe(
        result => {
          this.loadItemsData(result);
          this.showSpinner = result.isLoading;

          this.people = this.route.data['value']['people'];
        },
        () => (this.showSpinner = false)
      );
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
    this.searchEventChange(filter);
  }

  //#endregion

  ngOnInit() {
    this.selectedEventId = this.route.data['value']['activeEvent'].id;
    this.showSpinner = true;
    this.loadData(this.route.data['value']['activeEvent']);
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

  public selectedEventChange(event: any) {
    this.loadData(event);
  }

  public searchEventChange(text: string) {
    this.dataSource.filter = text.trim().toLowerCase();
  }
  //#endregion
}
