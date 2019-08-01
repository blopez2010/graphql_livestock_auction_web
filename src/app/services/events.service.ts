import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { allEvents, getActiveEvent } from '../graphql/types-definitions';
import { Response } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  constructor(private apollo: Apollo) {}

  public get(): Observable<Response> {
    return this.apollo
      .query({
        query: allEvents
      })
      .pipe(
        map(result => ({
          data: result.data['allEvents'],
          isLoading: result.loading
        }))
      );
  }

  /**
   * getActiveEvent
   */
  public getActiveEvent(): Observable<Response> {
    return this.apollo
      .query({
        query: getActiveEvent
      })
      .pipe(
        map(result => ({
          data: result.data['getActiveEvent'],
          isLoading: result.loading
        }))
      );
  }
}
