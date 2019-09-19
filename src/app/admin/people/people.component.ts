import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { People, Response } from 'src/app/models';
import { PeopleService } from 'src/app/services/people.service';
import { PeopleFormComponent } from '../../components/people-form/people-form.component';

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
  public showSpinner = false;
  public searchForm: FormGroup;

  constructor(
    private builder: FormBuilder,
    private dialog: MatDialog,
    private peopleService: PeopleService,
    private toastrService: ToastrService
  ) {}

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  //#region Private methods

  private updateSuccess(result: Response, successText: string) {
    const filter = this.dataSource.filter;
    this.showSpinner = result.isLoading;
    this.toastrService.success(successText);
    this.dataSource = new MatTableDataSource<any>(
      this.peopleService.getCacheData()
    );
    this.searchForm.get('search').setValue(filter);
  }

  //#endregion

  ngOnInit() {
    this.searchForm = this.builder.group({
      search: ''
    });

    this.searchForm
      .get('search')
      .valueChanges.pipe(debounceTime(300))
      .subscribe(value => {
        this.dataSource.filter = value.trim().toLowerCase();
      });

    this.showSpinner = true;
    this.peopleService.get().subscribe(
      (result: Response) => {
        this.dataSource = new MatTableDataSource<any>(result.data);
        this.showSpinner = result.isLoading;
        this.dataSource.paginator = this.paginator;
      },
      () => (this.showSpinner = false)
    );
  }

  //#region Public methods

  public addPeople() {
    this.dialog
      .open(PeopleFormComponent, {
        disableClose: true,
        maxWidth: '30em'
      })
      .afterClosed()
      .subscribe(data => {
        if (data) {
          this.peopleService.create(data).subscribe((result: Response) => {
            this.showSpinner = result.isLoading;
            this.toastrService.success('Persona agregada');
            this.dataSource = new MatTableDataSource<any>(
              this.peopleService.getCacheData()
            );
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
      .subscribe(data => {
        if (data) {
          this.peopleService.update(data).subscribe((result: Response) => {
            this.updateSuccess(result, 'Persona actualizada');
          });
        }
      });
  }

  //#endregion
}
