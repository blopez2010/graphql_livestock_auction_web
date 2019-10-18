import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Event, Response } from '../../models';
import { EventsService } from '../../services/events.service';

@Injectable()
export class ActiveEventResolver implements Resolve<Event> {
	constructor(private eventsService: EventsService) {}

	public resolve(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Event | Observable<Event> | Promise<Event> {
		return this.eventsService.getActiveEvent().pipe(switchMap(({ data }: Response) => of(data)));
	}
}
