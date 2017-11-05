import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
form: FormGroup;
message;
messageClass;
processing = false;


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService) { this.createForm();
  }
  createForm() {
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30)
      ])],
      username: ['',  Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15)
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(35)
      ])],
      role: ''
    });
  }

  onRegisterSubmit () {
    this.processing = true;
    const user = {
      email: this.form.get('email').value,
      username: this.form.get('username').value,
      password: this.form.get('password').value,
      role: this.form.get('role').value
    };

    this.authService.registerUser(user).subscribe(data => {
    if (!data.success) {
      this.processing = false;
      this.messageClass = 'alert alert-danger';
      this.message = data.message;
    } else {
      this.messageClass = 'alert alert-success';
      this.message = data.message;
    }
    });
  }
  ngOnInit() {
  }

}
