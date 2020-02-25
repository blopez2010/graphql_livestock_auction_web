/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DataReportService } from './data-report.service';

describe('Service: DataReport', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataReportService]
    });
  });

  it('should ...', inject([DataReportService], (service: DataReportService) => {
    expect(service).toBeTruthy();
  }));
});
