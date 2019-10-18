/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';

import { AuctionService } from './auction.service';

describe('Service: Auction', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ AuctionService ]
		});
	});

	it(
		'should ...',
		inject([ AuctionService ], (service: AuctionService) => {
			expect(service).toBeTruthy();
		})
	);
});
