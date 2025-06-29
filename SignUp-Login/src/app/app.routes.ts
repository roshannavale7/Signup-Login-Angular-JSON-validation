import { Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
    {path:'dashboard', component:DashboardComponent},
    {path:'login', component:SignInComponent},
    {path:'signup', component:SignUpComponent},
    {path:'**',pathMatch:'full',redirectTo:'/dashboard'}
    
];
