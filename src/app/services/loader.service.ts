import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Loader } from '../models';

@Injectable({
	providedIn: 'root'
})
export class LoaderService {
	private loaderSubject = new Subject<Loader>();

	constructor() {}

	// tslint:disable-next-line: member-ordering
	public loaderState = this.loaderSubject.asObservable();

	public show() {
		this.loaderSubject.next({ show: true } as Loader);
	}

	public hide() {
		this.loaderSubject.next({ show: false } as Loader);
	}
}
