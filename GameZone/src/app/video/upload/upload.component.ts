import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 as uuid} from 'uuid';
import { last, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'; 

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  isDragover = false;
  file: File | null = null;
  nextStep = false;

  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait! Your video is being uploaded.';
  inSubmission = false;

  percentage = 0;
  showPercentage = false;
  user: firebase.User | null = null;

  title =  new FormControl('',{
  validators:[
    Validators.required,
    Validators.minLength(3)
  ],
  nonNullable: true
});


uploadForm = new FormGroup({
title: this.title
});

  constructor(private storage: AngularFireStorage , private auth: AngularFireAuth) {
    auth.user.subscribe(user => this.user = user);
   }

  ngOnInit(): void {
  }

  storeFile($event: Event){
    this.isDragover = false;

    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null;

    if(!this.file || this.file.type !== 'video/mp4'){
      return;
    }

    this.title.setValue(
      this.file.name.replace(/\.[^/.]+$/, '')
    );

    this.nextStep = true;
  }

  uploadFile(){
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Your video is being uploaded.';
    this.inSubmission = true;
    this.showPercentage = true;

    const videoFileName = uuid();
    const videoPath = `videos/${videoFileName}.mp4`;

    const task = this.storage.upload(videoPath, this.file);
    const videoref = this.storage.ref(videoPath);

    task.percentageChanges().subscribe(progress =>{
      this.percentage = progress as number / 100
    });

    task.snapshotChanges().pipe(
      last(),
      switchMap(() => videoref.getDownloadURL())
    ).subscribe({
      next: (url) =>{
        const video = {
          
          uid: this.user?.uid,
          displayName: this.user?.displayName,
          title: this.title.value,
          fileName: `${videoFileName}.mp4`,
          url
        };

        console.log(video);
        

        this.alertColor = 'green';
        this.alertMsg = 'Success! Your video is now ready to share with the world.';
        this.showPercentage = false;
      },
      error: (error) => {
        this.alertColor = 'red';
        this.alertMsg = 'Upload failed! Please try again later.'
        this.inSubmission = true;
        this.showPercentage = false;
        console.error(error);
      }
    });
  }

}
