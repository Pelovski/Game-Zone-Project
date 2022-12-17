import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { VideoService } from 'src/app/services/video.service';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';
import { combineLatest, forkJoin } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {

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

  task?: AngularFireUploadTask;

  screenshots: string[] = [];
  selectedScreenshot = '';
  screenshotTask?: AngularFireUploadTask;

  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  });


  uploadForm = new FormGroup({
    title: this.title
  });

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private videosService: VideoService,
    private router: Router,
    public ffmpegService: FfmpegService
  ) {
    auth.user.subscribe(user => this.user = user);
    this.ffmpegService.init();
  }

  ngOnDestroy(): void {
    this.task?.cancel();
  }

  async storeFile($event: Event) {
    if(this.ffmpegService.isRunnung){
      return
    }

    this.isDragover = false;

    this.file = ($event as DragEvent).dataTransfer ?
      ($event as DragEvent).dataTransfer?.files.item(0) ?? null :
      ($event.target as HTMLInputElement).files?.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    this.screenshots = await this.ffmpegService.getScreenshots(this.file);

    this.selectedScreenshot = this.screenshots[0];

    console.log(this.screenshots);
    

    this.title.setValue(
      this.file.name.replace(/\.[^/.]+$/, '')
    );

    this.nextStep = true;
  }

  async uploadFile() {
    this.uploadForm.disable();

    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Your video is being uploaded.';
    this.inSubmission = true;
    this.showPercentage = true;


    const videoFileName = uuid();
    const videoPath = `videos/${videoFileName}.mp4`;


    const screenshotBlob = await this.ffmpegService.blobFromURL(
      this.selectedScreenshot
    ); 

    const screenshotPath = `screenshots/${videoFileName}.png`;

    this.task = this.storage.upload(videoPath, this.file);
    const videoref = this.storage.ref(videoPath);

    this.screenshotTask = this.storage.upload(screenshotPath, screenshotBlob);

    const screenshotRef = this.storage.ref(screenshotPath);

    combineLatest([
      this.task.percentageChanges(),
      this.screenshotTask.percentageChanges()
    ]).subscribe((progress) => {
      const[videoProgress, screenshotProgress] = progress

      if(!videoProgress || !screenshotProgress){
        return
      }

      const total = videoProgress + screenshotProgress;

      this.percentage = total as number / 200;
    });

    // Push values while the upload is in progress
    // Waiting for Firebase to give us the URLs to both files, after we've recived them we will push them onto the subscriber

    forkJoin([
      this.task.snapshotChanges(),
      this.screenshotTask.snapshotChanges()   
    ]).pipe(
      switchMap(() => forkJoin([
        videoref.getDownloadURL(),
        screenshotRef.getDownloadURL()
      ]))
    ).subscribe({
      next: async (urls) => {
        const[videoUrl, screenshotURL] = urls;

        const video = {

          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value,
          fileName: `${videoFileName}.mp4`,
          url: videoUrl,
          screenshotURL,
          screenshotFileName: `${videoFileName}.png`,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        const videoDocRef = await this.videosService.createVideo(video);


        this.alertColor = 'green';
        this.alertMsg = 'Success! Your video is now ready to share with the world.';
        this.showPercentage = false;

        setTimeout(() => {
          this.router.navigate([
            'video', videoDocRef.id
          ])
        }, 1000);

      },
      error: (error) => {
        this.uploadForm.enable();
        this.alertColor = 'red';
        this.alertMsg = 'Upload failed! Please try again later.'
        this.inSubmission = true;
        this.showPercentage = false;
        console.error(error);
      }
    });
  }
}
