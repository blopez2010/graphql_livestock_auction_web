import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataReportService {
  private updateSubject = new Subject<any>();

  constructor() { }

  // tslint:disable-next-line: member-ordering
  public updateState = this.updateSubject.asObservable();

  /**
   * updateData
   */
  public updateData(data: any, options: any = null) {
    this.updateSubject.next({ data, options });
  }
}
