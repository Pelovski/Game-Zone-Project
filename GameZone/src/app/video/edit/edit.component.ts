import { Component, OnInit, OnDestroy, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import IVideo from 'src/app/models/video.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeVideo: IVideo | null = null;
  inSubmission = false;
  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait! Updating video.'

  @Output() update = new EventEmitter();

  videoID = new FormControl('', {
    nonNullable: true
  });

  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  });

  editForm = new FormGroup({
    title: this.title,
    id: this.videoID
  });

  constructor(private modal: ModalService, private videoService: VideoService) { }

  ngOnInit(): void {
    this.modal.register('editVideo')
  }

  ngOnDestroy() {
    this.modal.unregister('editVideo');
  }

  ngOnChanges() {
    if (!this.activeVideo) {
      return;
    }
    this.inSubmission = false;
    this.showAlert = false;
    this.videoID.setValue(this.activeVideo.docID as string);
    this.title.setValue(this.activeVideo.title);

  }

  async submit() {
    if (!this.activeVideo) {
      return;
    }
    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Updating video.';

    try {
      await this.videoService.updateVideo(this.videoID.value, this.title.value);

    } catch (e) {
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'Something went wrong. Try again later.'
      return;
    }

    this.activeVideo.title = this.title.value;
    this.update.emit(this.activeVideo);

    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMsg = 'Success!'
  }
}
