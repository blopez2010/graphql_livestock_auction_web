import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  allEvents,
  createEvent,
  deleteEvent,
  getActiveEvent,
  updateEvent,
  updateEventById
} from '../graphql/types-definitions';
import { Event, Response } from '../models';

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

  public getCacheData() {
    return this.apollo.getClient().readQuery({ query: allEvents })['allEvents'];
  }

  public create(event: Event): Observable<Response> {
    return this.apollo
      .mutate({
        mutation: createEvent,
        variables: {
          input: {
            ...event,
            id: undefined
          }
        }
      })
      .pipe(
        map(result => {
          const data = result.data['createEvent'];
          return {
            data,
            isLoading: result.loading
          };
        })
      );
  }

  public update(event: Event): Observable<Response> {
    return this.apollo
      .mutate({
        mutation: updateEvent,
        variables: {
          id: event.id,
          input: {
            ...event,
            id: undefined
          }
        }
      })
      .pipe(
        map(result => {
          const data = result.data['updateEvent'];
          this.apollo.getClient().writeFragment({
            id: event.id,
            fragment: updateEventById,
            data: {
              ...data,
              id: undefined
            }
          });

          return {
            data,
            isLoading: result.loading
          };
        })
      );
  }

  public delete(event: Event): Observable<Response> {
    return this.apollo
      .mutate({
        mutation: deleteEvent,
        variables: {
          id: event.id
        }
      })
      .pipe(
        map(result => {
          const data = result.data['deleteEvent'];
          return {
            data,
            isLoading: result.loading
          };
        })
      );
  }
}
