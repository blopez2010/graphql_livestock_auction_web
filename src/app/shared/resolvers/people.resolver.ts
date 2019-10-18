import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { People, Response } from '../../models';
import { PeopleService } from '../../services/people.service';

@Injectable()
export class PeopleResolver implements Resolve<People> {
	constructor(private peopleService: PeopleService) {}

	public resolve(): People | Observable<People> | Promise<People> {
		return this.peopleService.get().pipe(
			switchMap(({ data }: Response) =>
				of(
					data.map((p: People) => ({
						...p,
						fullName: p.nickname ? `${p.name} (${p.nickname})` : p.name
					}))
				)
			)
		);
	}
}
