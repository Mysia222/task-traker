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
        }, 500);
      }
    });

  }

  goBack() {
    window.location.reload();
  }
  
  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; // Used when creating new project
    });
  }

}

