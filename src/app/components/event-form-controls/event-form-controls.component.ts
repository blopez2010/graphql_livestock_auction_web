import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'lsa-event-form-controls',
  templateUrl: './event-form-controls.component.html',
  styleUrls: ['./event-form-controls.component.scss']
})
export class EventFormControlsComponent {
  @Input() public form: FormGroup;
  constructor() {}
}
