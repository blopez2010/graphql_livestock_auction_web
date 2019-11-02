/* tslint:disable:no-unused-variable */

import { async, inject, TestBed } from '@angular/core/testing';

import { LoaderService } from './loader.service';

describe('Service: Loader', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoaderService]
    });
  });

  it('should ...', inject([LoaderService], (service: LoaderService) => {
    expect(service).toBeTruthy();
  }));
});
