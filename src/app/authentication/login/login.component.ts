import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import gql from "graphql-tag";
import { ToastrService } from "ngx-toastr";
import { SessionService } from "src/app/shared/session.service";

const loginMutation = gql`
  mutation login($user: String!, $password: String!) {
    login(user: $user, password: $password) {
      user
      token
    }
  }
`;

@Component({
  selector: "lsa-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
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

  //#region Private methods

  private initForm() {
    this.loginForm = this.formBuilder.group({
      user: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  //#endregion

  //#region Public methods

  ngOnInit() {
    this.initForm();
  }

  public onSave() {
    if (this.loginForm.valid) {
      this.sessionService.login(this.loginForm.value).subscribe(
        () => {
          this.router.navigate(["/home"]);
        },
        err => {
          this.toastr.error("El usuario o el password es incorrecto.");
        }
      );
    }
  }

  //#endregion
}
