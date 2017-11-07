import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProjectService } from '../../services/project.service';
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  messageClass;
  message;
  newProject = false;
  loadingProjects= false;
  processing = false;
  newProjectForm: FormGroup;
  username;
  projects = [{}];
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private projectService: ProjectService,
  ) { this.createNewProjectForm(); }


  createNewProjectForm() {
    this.newProjectForm = this.formBuilder.group({

      title: '',
      description: ''

    });
  }

  NewProjectForm() {
    this.newProject = true;
  }

  reloadProject() {
    this.loadingProjects = true;
    this.getAllProjects();
    setTimeout(() => {
      this.loadingProjects = false; // Release button lock after four seconds
    }, 4000);
  }

  onProjectSubmit() {
    this.processing = true;

    const project = {
      title: this.newProjectForm.get('title').value,
      description: this.newProjectForm.get('description').value,
      createdBy: this.username
    };

    this.projectService.newProject(project).subscribe(data => {

      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
          this.newProject = false;
          this.processing = false;
          this.message = false;
          this.newProjectForm.reset();
          this.getAllProjects();
        }, 500);
      }
    });

  }

  goBack() {
    window.location.reload();
  }

  getAllProjects() {
    console.log(typeof this.projects);
    const that = this;
    this.projects.splice(0, 1);
    // Function to GET all blogs from database
    this.projectService.getAllProjects().subscribe(data => {
      for (let i = 0; i < data.projects.length; i++) {
        if (data.projects[i].createdBy === that.username) {
          this.projects.push(data.projects[i]);
        }
      }
    });
  }

  ngOnInit() {

    const that = this;
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; // Used when creating new project
      that.getAllProjects();
    });

  }

}

