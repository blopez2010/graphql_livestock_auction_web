import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'lsa-add-button',
	templateUrl: './add-button.component.html',
	styleUrls: [ './add-button.component.scss' ]
})
export class AddButtonComponent implements OnInit {
	constructor() {}

	@Output() addClicked = new EventEmitter();

	ngOnInit() {}
}
