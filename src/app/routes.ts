import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthWithPasswordComponent } from './auth-with-password/auth-with-password.component';
import { AccountComponent } from './account/account.component';
import { AuthComponent } from './auth/auth.component';
import { profileGuard } from './guards/profile.guard';
// import { DetailsComponent } from './details/details.component';

export const routeConfig: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page',
    canActivate: [profileGuard]
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    title: 'sign up'
  },
  {
    path: 'sign-in',
    component: AuthWithPasswordComponent,
    title: 'sign in'
  }, 
  {
    path: "account", 
    component: AccountComponent, 
    title: "account",
    canActivate: [profileGuard]
  },
  {
    path: "auth",
    component: AuthComponent,
    title: "auth"
  }
  // {
  //   path: 'details/:id',
  //   component: DetailsComponent,
  //   title: 'Home details',
  // },
];
