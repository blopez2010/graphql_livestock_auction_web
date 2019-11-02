import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskModule } from 'ngx-mask';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationModule } from './authentication/authentication.module';
import { MaterialModule } from './material/material.module';
import { TokenInterceptor } from './shared/auth/token.interceptor';
import { FooterComponent } from './shared/footer/footer.component';
import { SessionGuard } from './shared/guards/session.guard';
import { HeaderComponent } from './shared/header/header.component';
import { SessionService } from './shared/session.service';

@NgModule({
	declarations: [ AppComponent, HeaderComponent, FooterComponent ],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		MaterialModule,
		AuthenticationModule,
		AppRoutingModule,
		HttpClientModule,
		ReactiveFormsModule,
		ToastrModule.forRoot({
			positionClass: 'toast-top-center',
			preventDuplicates: true
		}),
		NgxMaskModule.forRoot()
	],
	providers: [
		SessionService,
		SessionGuard,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: TokenInterceptor,
			multi: true
		}
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
