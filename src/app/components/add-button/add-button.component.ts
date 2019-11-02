import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lsa-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss']
})
export class AddButtonComponent implements OnInit {
  @Output() public addClicked = new EventEmitter();

  constructor() {}

  public ngOnInit() {}
}
