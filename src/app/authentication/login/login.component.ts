import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'src/app/shared/session.service';

@Component({
	selector: 'lsa-login',
	templateUrl: './login.component.html',
	styleUrls: [ './login.component.scss' ]
})
export class LoginComponent implements OnInit {
	public loginForm: FormGroup;
	public hidePassword = true;

	constructor(
		private formBuilder: FormBuilder,
		private sessionService: SessionService,
		private router: Router,
		private toastr: ToastrService
	) {}

	//#endregion

	//#region Public methods

	public ngOnInit() {
		this.initForm();
	}

	public onSave() {
		if (this.loginForm.valid) {
			this.sessionService.login(this.loginForm.value).subscribe(
				() => {
					this.router.navigate([ '/home' ]);
				},
				(err) => {
					this.toastr.error('El usuario o el password es incorrecto.');
				}
			);
		}
	}

	//#region Private methods

	private initForm() {
		this.loginForm = this.formBuilder.group({
			user: [ '', Validators.required ],
			password: [ '', Validators.required ]
		});
	}

	//#endregion
}
