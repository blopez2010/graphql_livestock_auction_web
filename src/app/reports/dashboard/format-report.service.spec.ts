/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FormatReportService } from './format-report.service';

describe('Service: FormatReport', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormatReportService]
    });
  });

  it('should ...', inject([FormatReportService], (service: FormatReportService) => {
    expect(service).toBeTruthy();
  }));
});
