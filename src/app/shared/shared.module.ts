import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApolloModule } from 'apollo-angular';

import { ComponentsModule } from '../components/components.module';
import { MaterialModule } from '../material/material.module';
import { LoaderInterceptor } from './loader.interceptor';
import { MenuComponent } from './menu/menu.component';
import { ActiveEventResolver } from './resolvers/active-event.resolver';
import { EventsResolver } from './resolvers/events.resolver';
import { PeopleResolver } from './resolvers/people.resolver';
import { TokenStorageService } from './token-storage.service';

@NgModule({
	imports: [ MaterialModule, ReactiveFormsModule, RouterModule, CommonModule, ApolloModule, ComponentsModule ],
	declarations: [ MenuComponent ],
	providers: [
		TokenStorageService,
		ActiveEventResolver,
		PeopleResolver,
		EventsResolver,
		{ provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
	],
	exports: [ MaterialModule, ApolloModule, MenuComponent ]
})
export class SharedModule {}
