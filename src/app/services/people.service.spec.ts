/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';

import { PeopleService } from './people.service';

describe('Service: People', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PeopleService]
    });
  });

  it('should ...', inject([PeopleService], (service: PeopleService) => {
    expect(service).toBeTruthy();
  }));
});
