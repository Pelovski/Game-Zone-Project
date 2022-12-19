import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { NavComponent } from './nav/nav.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore/';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { GameVideosComponent } from './game-videos/game-videos.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { VideosListComponent } from './videos-list/videos-list.component';
import { FbTimestampPipe } from './pipes/fb-timestamp.pipe';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    AboutComponent,
    GameVideosComponent,
    NotFoundComponent,
    VideosListComponent,
    FbTimestampPipe
  ],
  imports: [
    BrowserModule,
    UserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AppRoutingModule,
    AngularFireStorageModule // Helps for uploading files in Firebase
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
