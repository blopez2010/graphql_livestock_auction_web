import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { merge, of } from 'rxjs';
import { catchError, debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import { People, Response } from 'src/app/models';
import { PeopleService } from 'src/app/services/people.service';

import { PeopleFormComponent } from '../../components/people-form/people-form.component';
import { PaginatedResponse } from '../../models/paginatedResponse';

@Component({
  selector: 'lsa-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  public displayedColumns: string[] = [
    'name',
    'nickname',
    'phoneNumber',
    'externalIdentifier',
    'address',
    'isBanned',
    'bannedDescription',
    'more'
  ];
  public dataSource: any = new MatTableDataSource<any>([]);
  public searchForm: FormGroup;
  public totalCount = 0;
  public isRateLimitReached = false;

  @ViewChild(MatPaginator, { static: true })
  public paginator: MatPaginator;

  @ViewChild(MatSort, { static: true })
  public sort: MatSort;

  constructor(
    private builder: FormBuilder,
    private dialog: MatDialog,
    private peopleService: PeopleService,
    private toastrService: ToastrService
  ) {}

  //#endregion

  public ngOnInit() {
    this.searchForm = this.builder.group({
      search: ''
    });

    this.searchForm
      .get('search')
      .valueChanges.pipe(debounceTime(300))
      .subscribe((value) => {
        this.dataSource.filter = value.trim().toLowerCase();
      });

    this.dataSource.sort = this.sort;
  }

  // tslint:disable-next-line: use-life-cycle-interface
  public ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.searchForm.get('search').valueChanges.subscribe(() => (this.paginator.pageIndex = 0));

    merge(
      this.sort.sortChange,
      this.paginator.page,
      this.searchForm.get('search').valueChanges.pipe(debounceTime(300))
    )
      .pipe(
        startWith({
          data: [],
          totalCount: 0,
          limit: 0,
          offset: 0,
          isLoading: false
        } as PaginatedResponse<People>),
        switchMap(() => {
          return this.peopleService.getPaginated(
            this.dataSource.filter,
            this.sort.active || 'name',
            this.sort.direction.toUpperCase() || 'ASC',
            this.paginator.pageIndex,
            this.paginator.pageSize
          );
        }),
        map((result) => {
          this.totalCount = result.totalCount;
          this.isRateLimitReached = false;
          return result.data;
        }),
        catchError((error) => {
          this.isRateLimitReached = true;
          return of([]);
        })
      )
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource<People>(data);
      });
  }

  //#region Public methods

  public addPeople() {
    this.dialog
      .open(PeopleFormComponent, {
        disableClose: true,
        maxWidth: '30em'
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          this.peopleService.create(data).subscribe((result: Response) => {
            this.toastrService.success('Persona agregada');
            this.dataSource = new MatTableDataSource<any>(this.peopleService.getCacheData());
          });
        }
      });
  }

  public editPeople(element: People) {
    // const dataCached = this.peopleService.getPeopleIdFromCache(element.id);

    this.dialog
      .open(PeopleFormComponent, {
        disableClose: true,
        maxWidth: '30em',
        data: element
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          this.peopleService.update(data).subscribe((result: Response) => {
            this.updateSuccess(result, 'Persona actualizada');
          });
        }
      });
  }

  //#region Private methods

  private updateSuccess(result: Response, successText: string) {
    const filter = this.dataSource.filter;
    this.toastrService.success(successText);
    this.dataSource = new MatTableDataSource<People>(this.peopleService.getCacheData());
    this.searchForm.get('search').setValue(filter);
  }

  //#endregion
}
