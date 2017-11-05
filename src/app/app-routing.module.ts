import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ActivateComponent } from './components/activate/activate.component';
import { ProjectsComponent } from './components/projects/projects.component';

import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { ManagerGuard } from './guards/manager.guard';


const appRoutes: Routes = [

  {
    path: ' ',
    component: HomeComponent
  },

  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'about',
    component: AboutComponent, // Dashboard Route,
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    component: RegisterComponent, // Login Route
    canActivate: [NotAuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent, // Login Route
    canActivate: [NotAuthGuard]
  },
  {
    path: 'activate/:token',
    component: ActivateComponent, // Login Route
    canActivate: [NotAuthGuard]
  },
  {
    path: 'projects',
    component: ProjectsComponent, // Dashboard Route,
    canActivate: [ManagerGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent, // Dashboard Route,
    canActivate: [AuthGuard]
  },
  { path: '**', component: HomeComponent }

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [],
  exports: [RouterModule]
})

export class AppRoutingModule { }