import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { People } from 'src/app/models/people';
import { PeopleService } from 'src/app/services/people.service';
import { PeopleFormComponent } from './people-form/people-form.component';

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
    'bannedDescription'
  ];
  public dataSource: any = new MatTableDataSource<any>([]);

  constructor(private dialog: MatDialog, private people: PeopleService) {}

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit() {
    this.people.getPeople().subscribe((result: People[]) => {
      this.dataSource = new MatTableDataSource<any>(result);
      this.dataSource.paginator = this.paginator;
    });
  }

  public addPeople() {
    this.dialog
      .open(PeopleFormComponent, {
        disableClose: true,
        maxWidth: '30em'
      })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          console.log(result);
        }
      });
  }
}
