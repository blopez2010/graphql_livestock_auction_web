import { Component, OnInit } from '@angular/core';
import { Reports } from 'src/app/models';

@Component({
  selector: 'lsa-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public selectedReport: Reports;

  constructor() { }

  public ngOnInit() {
  }
}
