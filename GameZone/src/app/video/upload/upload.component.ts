import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 as uuid} from 'uuid';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  isDragover = false;
  file: File | null = null;
  nextStep = false;

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

  constructor(private storage: AngularFireStorage) {

   }

  ngOnInit(): void {
  }

  storeFile($event: Event){
    this.isDragover = false;

    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null;
    console.log(this.file);
    

    if(!this.file || this.file.type !== 'video/mp4'){
      return;
    }

    this.title.setValue(
      this.file.name.replace(/\.[^/.]+$/, '')
    );
    this.nextStep = true;
  }

  uploadFile(){

    console.log('upload file');
    
    const videoFileName = uuid();
    const videoPath = `videos/${videoFileName}.mp4`;

    this.storage.upload(videoPath, this.file);
  }

}
