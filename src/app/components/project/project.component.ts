import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProjectService } from '../../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  providers: [DatePipe]
})
export class ProjectComponent implements OnInit {

  username;
  currentUrl;
  project;
  message;
  newDeveloperForm: FormGroup;
  messageClass;
  newDeveloper = false;
  developers;
  processing = false;
  data;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private datePipe: DatePipe,
    private router: Router
   ) { this.createNewProjectsDeveloperForm();  }


   createNewProjectsDeveloperForm() {
    this.newDeveloperForm = this.formBuilder.group({
      addingDeveloper: ''
    });
   }

   NewProjectsDeveloper() {
    this.newDeveloper = true;
  }

  onDeveloperSubmit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.processing = true;
    this.data = {
      developer: this.newDeveloperForm.get('addingDeveloper').value,
      id: this.currentUrl.id
    };
    this.projectService.addProjectsDeveloper(this.data).subscribe(data => {
      // Check if PUT request was a success or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Set error bootstrap class
        this.message = data.message; // Set error message
        this.processing = false; // Unlock form fields
      } else {
        this.messageClass = 'alert alert-success'; // Set success bootstrap class
        this.message = data.message; // Set success message
        // After two seconds, navigate back to blog page
        setTimeout(() => {
          this.router.navigate(['/project']); // Navigate back to route page
        }, 2000);
      }
    });

  }
  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;

    this.projectService.getProject(this.currentUrl.id).subscribe(data => {
      // Check if GET request was success or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Set bootstrap error class
        this.message = data.message; // Set error message
      } else {
        this.project = data.project; // Save blog object for use in HTML
        this.project.createdAt = this.datePipe.transform(this.project.createdAt);
      }
    });

    this.projectService.getAllDevelopers().subscribe(data => {
      // Check if GET request was success or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Set bootstrap error class
        this.message = data.message; // Set error message
      } else {
        this.developers = data.developers; // Save blog object for use in HTML
      }
    });

  }

}
