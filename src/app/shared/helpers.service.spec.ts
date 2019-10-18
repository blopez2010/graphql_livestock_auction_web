/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';

import { HelpersService } from './helpers.service';

describe('Service: Helpers', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ HelpersService ]
		});
	});

	it(
		'should ...',
		inject([ HelpersService ], (service: HelpersService) => {
			expect(service).toBeTruthy();
		})
	);
});
