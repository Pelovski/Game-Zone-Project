import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

//Contain a list of objects with configuration settings for each route
const routes: Routes = [{
  path:'',
  component: HomeComponent
},
{
  path:'about',
  component: AboutComponent
}];

@NgModule({
  // Registring the routes
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule] // Configuration file for the routes
})
export class AppRoutingModule { }
