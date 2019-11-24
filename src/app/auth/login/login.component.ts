import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isWaiting = false;

  form = this.fb.group({
    account: ['', [Validators.required, Validators.minLength(2)]],
    password: ['', [Validators.minLength(2)]],
    captcha: ['', [Validators.required]],
  });

  captchaImage$ = this.authService.fetchCaptcha();

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    public router: Router,
  ) {
  }

  ngOnInit() {
  }

  async submit($event: Event) {
    $event.preventDefault();
    this.isWaiting = true;
    for (const i of Object.keys(this.form.controls) ) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    await this.authService.login(this.form.value).toPromise()
      .then(() => this.router.navigate(['/']))
      .catch(() => {})
      .finally(() => {
        this.isWaiting = false;
      });
  }
}
