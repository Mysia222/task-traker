import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  constructor() { }
  messageClass;
  message;
  newProject = false;
  loadingProjects= false;

  NewProjectForm() {

    this.newProject = true;

  }
  reloadProject() {
    this.loadingProjects = true;
  }
  ngOnInit() {
  }

}
