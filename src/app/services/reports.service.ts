import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { getTransactionsBuyersReport, getTransactionsDebtorsReport } from '../graphql/types-definitions/transactions/queries';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(
    private apollo: Apollo
  ) { }

  /**
   * getBuyersReport
   */
  public getBuyersReport(eventId: string): Observable<any> {
    return this.apollo.query({
      query: getTransactionsBuyersReport,
      variables: {
        eventId
      }
    })
      .pipe(
        map((result) => ({
          data: result['data']['getTransactionsBuyersReport']
        }))
      );
  }

  /**
   * getDebtorsReport
   */
  public getDebtorsReport(eventId: string): Observable<any> {
    return this.apollo.query({
      query: getTransactionsDebtorsReport,
      variables: {
        eventId
      }
    })
      .pipe(
        map((result) => ({
          data: result['data']['getTransactionsDebtorsReport']
        }))
      );
  }

}
