import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'lsa-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  public copyrightYear = moment()
    .year()
    .toString();

  constructor() {}
}
