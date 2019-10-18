/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';

import { ItemsService } from './items.service';

describe('Service: Items', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ ItemsService ]
		});
	});

	it(
		'should ...',
		inject([ ItemsService ], (service: ItemsService) => {
			expect(service).toBeTruthy();
		})
	);
});
