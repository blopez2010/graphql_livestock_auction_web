import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  allPeople,
  createPeople,
  getItemById,
  updatePeople,
  updatePeopleById
} from '../graphql/types-definitions';
import { People, Response } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  constructor(private apollo: Apollo) {}

  public getPeopleIdFromCache(id: string): Observable<People> {
    const people = this.apollo.getClient().readFragment({
      id,
      fragment: getItemById
    });

    return people;
  }

  public get(): Observable<Response> {
    return this.apollo
      .query({
        query: allPeople
      })
      .pipe(
        map(result => ({
          data: result.data['allPeople'],
          isLoading: result.loading
        }))
      );
  }

  public getCacheData() {
    return this.apollo.getClient().readQuery({ query: allPeople })['allPeople'];
  }

  public create(people: People): Observable<Response> {
    return this.apollo
      .mutate({
        mutation: createPeople,
        variables: {
          input: {
            ...people,
            id: undefined,
            bannedDescription: undefined
          }
        }
      })
      .pipe(
        map(result => {
          const data = result.data['createPeople'].data;
          this.apollo.getClient().writeQuery({
            query: allPeople,
            data: {
              allPeople: [...this.getCacheData(), data]
            }
          });

          return {
            data,
            isLoading: result.loading
          };
        })
      );
  }

  public update(people: People): Observable<Response> {
    return this.apollo
      .mutate({
        mutation: updatePeople,
        variables: {
          id: people.id,
          input: {
            ...people,
            id: undefined
          }
        }
      })
      .pipe(
        map(result => {
          const data = result.data['updatePeople'];
          this.apollo.getClient().writeFragment({
            id: people.id,
            fragment: updatePeopleById,
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
}
