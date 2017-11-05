import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  messageClass;
  message;
  processing = false;
  form;
  previousUrl;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private authGuard: AuthGuard
  ) {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      username: '',
      password: '',
      role: ''
    });
  }

  onLoginSubmit() {
    this.processing = true;
    const user = {
      username: this.form.get('username').value,
      password: this.form.get('password').value,
      role: this.form.get('role').value
    };

    // Function to send login data to API
    this.authService.login(user).subscribe(data => {

      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.authService.storeUserData(data.token, data.user);
        setTimeout(() => {
          if (this.previousUrl) {
            this.router.navigate([this.previousUrl]);
          } else {
            this.router.navigate(['/profile']);
          }
        }, 2000);
      }
    });
  }

  ngOnInit() {
    // Set error message: need to login
    if (this.authGuard.redirectUrl) {
      this.messageClass = 'alert alert-danger';
      this.message = 'You must be logged in to view that page.';
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
  }
}
