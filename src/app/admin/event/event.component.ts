import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { Event, Response } from 'src/app/models';
import { EventsService } from 'src/app/services/events.service';
import { ItemsService } from 'src/app/services/items.service';

import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { EventFormComponent } from '../../components/event-form/event-form.component';

@Component({
  selector: 'lsa-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  public displayedColumns: string[] = ['more', 'name', 'description', 'startDate', 'endDate'];
  public searchForm: FormGroup;
  public dataSource: any = new MatTableDataSource<any>([]);
  public totalCount = 0;
  public size = 0;
  public isRateLimitReached = false;

  @ViewChild(MatPaginator, { static: true })
  public paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) public sort: MatSort;

  constructor(
    private builder: FormBuilder,
    private dialog: MatDialog,
    private eventService: EventsService,
    private itemsService: ItemsService,
    private toastrService: ToastrService
  ) {}

  public ngOnInit() {
    this.getEvents();
    this.searchForm = this.builder.group({
      search: ''
    });

    this.searchForm
      .get('search')
      .valueChanges.pipe(debounceTime(300))
      .subscribe((value) => {
        this.dataSource.filter = value.trim().toLowerCase();
      });
  }

  public addEvent() {
    this.dialog
      .open(EventFormComponent, {
        disableClose: true,
        maxWidth: '20em'
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          this.eventService.create(data).subscribe((result: Response) => {
            if (result.data.data !== null) {
              this.toastrService.success('Evento agregado');
              this.getEvents();
            } else {
              this.toastrService.error(result.data.error.message);
            }
          });
        }
      });
  }

  public editEvent(element: Event) {
    this.dialog
      .open(EventFormComponent, {
        disableClose: true,
        maxWidth: '20em',
        data: element
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          this.eventService.update(data).subscribe((result: Response) => {
            this.updateSuccess('Evento actualizado');
          });
        }
      });
  }

  public deleteEvent(element: Event) {
    this.itemsService
      .getByEventPaginated(element.id, null, 'ordinal', 'ASC', 1, 1)
      .subscribe((result) => {
        if (result.data.length === 0) {
          this.openDialog(element);
        } else {
          this.toastrService.error('El evento no puede ser eliminado');
        }
      });
  }

  public openDialog(element: Event): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: {
        title: 'Eliminar',
        body: '¿Deseas eliminar este evento?'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.eventService.delete(element).subscribe((response) => {
          if (!response.data.error) {
            this.toastrService.success('Evento Eliminado');
            this.getEvents();
          } else {
            this.toastrService.error(response.data.error.message);
          }
        });
      }
    });
  }

  private getEvents() {
    this.eventService.get().subscribe((result) => {
      this.dataSource = new MatTableDataSource<any>(result.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.totalCount = result.data.length;
    });
  }

  private updateSuccess(successText: string) {
    const filter = this.dataSource.filter;
    this.toastrService.success(successText);
    this.getEvents();
    this.searchForm.get('search').setValue(filter);
  }
}
