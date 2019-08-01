import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { EventsService } from 'src/app/services/events.service';
import { Event, Response } from '../../models';

@Injectable()
export class EventsResolver implements Resolve<Event> {
  constructor(private eventsService: EventsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Event | Observable<Event> | Promise<Event> {
    return this.eventsService
      .get()
      .pipe(switchMap(({ data }: Response) => of(data)));
  }
}
