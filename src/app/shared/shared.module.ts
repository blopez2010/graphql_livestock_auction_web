import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApolloModule } from 'apollo-angular';

import { MaterialModule } from '../material/material.module';
import { MenuComponent } from './menu/menu.component';
import { ActiveEventResolver } from './resolvers/active-event.resolver';
import { EventsResolver } from './resolvers/events.resolver';
import { PeopleResolver } from './resolvers/people.resolver';
import { TokenStorageService } from './token-storage.service';

@NgModule({
	imports: [ MaterialModule, ReactiveFormsModule, RouterModule, CommonModule, ApolloModule ],
	declarations: [ MenuComponent ],
	providers: [ TokenStorageService, ActiveEventResolver, PeopleResolver, EventsResolver ],
	exports: [ MaterialModule, ApolloModule, MenuComponent ]
})
export class SharedModule {}
