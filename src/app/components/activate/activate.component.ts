import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css']
})
export class ActivateComponent implements OnInit {
  currentUrl;
  messageClass;
  message;
  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params; // Get URL parameters on page load
    // Service to get the public profile data
    this.authService.activeAccount(this.currentUrl.emailtoken).subscribe(data => {
      // Check if user was found in database
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return bootstrap error class
        this.message = data.message; // Return error message
      } else {

      }
    });
  }
}
