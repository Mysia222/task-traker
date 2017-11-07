import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';


@Injectable()
export class ProjectService {
  options;
  domain = this.authService.domain;

  constructor(
    private authService: AuthService,
    private http: Http
  ) { }


    createAuthenticationHeaders() {
      this.authService.loadToken();

      this.options = new RequestOptions({
        headers: new Headers({
          'Content-Type': 'application/json',
          'authorization': this.authService.authToken
        })
      });
    }

    newProject(project) {
      this.createAuthenticationHeaders();
      return this.http.post(this.domain + '/projects/newProject', project, this.options).map(res => res.json());
    }

    getAllProjects() {
      this.createAuthenticationHeaders();
      return this.http.get(this.domain + '/projects/allProjects', this.options).map(res => res.json());
    }

  
    getProject(id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + '/projects/project/' + id, this.options).map(res => res.json());
  }

  getAllDevelopers() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/developers/allDevelopers', this.options).map(res => res.json());
  }

  addProjectsDeveloper(data) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.put(this.domain + '/developers/addDeveloper', data, this.options).map(res => res.json());
  }


}
