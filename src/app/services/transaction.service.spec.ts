/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';

import { TransactionService } from './transaction.service';

describe('Service: Transaction', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionService]
    });
  });

  it('should ...', inject([TransactionService], (service: TransactionService) => {
    expect(service).toBeTruthy();
  }));
});
