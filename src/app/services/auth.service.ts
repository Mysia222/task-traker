import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  domain = 'http://localhost:8080';
  authToken;
  user;
  options;
  role;

  constructor(
    private http: Http
  ) { }

    createAuthenticationHeaders() {
      this.loadToken();
      this.options = new RequestOptions({
        headers: new Headers({
          'Content-Type': 'application/json',
          'authorization': this.authToken
        })
      });
    }

    loadToken() {
      this.authToken = localStorage.getItem('token');
    }

  registerUser(user) {
    return this.http.post(this.domain + '/authentication/register', user).map(res => res.json());
  }


  login(user) {
    return this.http.post(this.domain + '/authentication/login', user).map(res => res.json());
  }

  activeAccount(token) {
    return this.http.get(this.domain + 'authentication/activate/' + token).map(res => res.json());
  }

  storeUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
    this.role = user.role;
  }

  getProfile() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/authentication/profile', this.options).map(res => res.json());
  }

  // Function to logout
  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear(); // Clear local storage
  }
  loggedIn() {
    return tokenNotExpired();
  }

  isManager() {
    if (tokenNotExpired()) {

        if (this.role == 'manager') {
            return true;
        } else {
            return false;
        }

    } else {
        return false;
    }
}


  isDeveloper() {
    if (tokenNotExpired()) {
        if (this.role == 'developer') {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
  }

}