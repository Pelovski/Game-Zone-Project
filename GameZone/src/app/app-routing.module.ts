import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { UploadComponent } from './video/upload/upload.component';
import { GameVideosComponent } from './game-videos/game-videos.component';

//Contain a list of objects with configuration settings for each route
const routes: Routes = [{
  path:'',
  component: HomeComponent
},
{
  path:'about',
  component: AboutComponent
},
{
  path:'upload',
  component: UploadComponent,
  data:{
    authOnly: true
  }
},
{
  path:'video/:id',
  component: GameVideosComponent,
}];

@NgModule({
  // Registring the routes
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule] // Configuration file for the routes
})
export class AppRoutingModule { }
