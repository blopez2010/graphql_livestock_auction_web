/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemFormControlsComponent } from './item-form-controls.component';

describe('ItemFormControlsComponent', () => {
	let component: ItemFormControlsComponent;
	let fixture: ComponentFixture<ItemFormControlsComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ ItemFormControlsComponent ]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ItemFormControlsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
